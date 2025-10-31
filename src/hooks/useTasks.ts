import { useEffect, useState, useCallback } from "react";
import { Task, TaskFilters } from "../types/task";
import { api, CreateTaskPayload, PatchTaskPayload } from "../lib/api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Unified refetch logic (shared across operations)
  const refresh = useCallback(async () => {
    try {
      const list = await api.listTasks();
      setTasks(list);
    } catch (e) {
      console.error("Refresh tasks failed", e);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    (async () => {
      try {
        const list = await api.listTasks();
        setTasks(list);
      } catch (e) {
        console.error("Load tasks failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Add new task + background refresh
  const addTask = async (
    data: Omit<Task, "id" | "createdAt" | "updatedAt" | "version">
  ) => {
    const payload: CreateTaskPayload = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      category: data.category,
      dueDate: data.dueDate,
      completed: data.completed ?? false,
      tags: data.tags,
      metadata: data.metadata,
    };
    const created = await api.createTask(payload);
    setTasks((prev) => [created, ...prev]);
    // фоновый рефетч — вдруг бэк доресчитал поля
    refresh();
  };
  // Update task + background refresh
  const updateTask = async (id: string, updates: Partial<Task>) => {
    const current = tasks.find((t) => t.id === id);
    if (!current || current.version == null) return;

    const patch: PatchTaskPayload = {
      title: updates.title,
      description: updates.description,
      priority: updates.priority,
      category: updates.category,
      dueDate: updates.dueDate,
      completed: updates.completed,
      tags: updates.tags,
      metadata: updates.metadata,
    };
    const saved = await api.patchTask(id, current.version, patch);
    // заменяем по id
    // 3) локальная замена (мгновенно)
    setTasks((prev) => prev.map((t) => (t.id === id ? saved : t)));

    // 4) фоновый рефетч — синхронизация между аккаунтами/нормализациями
    refresh();
  };

  const deleteTask = async (id: string) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    refresh();
  };

  const toggleComplete = async (id: string) => {
    const t = tasks.find((x) => x.id === id);
    if (!t || t.version == null) return;

    const saved = await api.patchTask(id, t.version, {
      completed: !t.completed,
    });
    setTasks((prev) => prev.map((x) => (x.id === id ? saved : x)));
    refresh();
  };

  const filterTasks = (filters: TaskFilters) =>
    tasks.filter((task) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const hit =
          task.title.toLowerCase().includes(s) ||
          (task.description?.toLowerCase().includes(s) ?? false);
        if (!hit) return false;
      }
      if (filters.category && task.category !== filters.category) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (
        filters.completed !== undefined &&
        task.completed !== filters.completed
      )
        return false;
      return true;
    });

  const isOverdue = (task: Task) =>
    !!task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    filterTasks,
    isOverdue,
    refresh,
  };
}
