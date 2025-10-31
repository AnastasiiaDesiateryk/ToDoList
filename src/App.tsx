import React, { useState } from "react";
import { useAuth } from "./auth/AuthContext";
import { LogOut } from "lucide-react";
import { ShareDialog } from "./components/sharing/ShareDialog";
import { Share2 } from "lucide-react";
import { Task, TaskFilters } from "./types/task";
import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { SearchAndFilters } from "./components/SearchAndFilters";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Separator } from "./components/ui/separator";
import { Plus, ListTodo } from "lucide-react";

export default function App() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    filterTasks,
    isOverdue,
  } = useTasks();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    category: undefined,
    priority: undefined,
    completed: undefined,
  });

  const filteredTasks = filterTasks(filters);

  const taskCounts = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter((t) => isOverdue(t)).length,
  };

  const handleAddTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    addTask(taskData);
    setShowAddForm(false);
  };

  const handleEditTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };
  {
    /* Log out */
  }
  const { logout } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);

  const { user: me } = useAuth();
  const isOwner = !!(editingTask && me && editingTask.ownerId === me.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ListTodo className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Todo Application</h1>
              <p className="text-muted-foreground">
                Organize your tasks efficiently
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Add Task Form (Desktop) */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div className="sticky top-8">
              <div className="hidden xl:block">
                <TaskForm mode="add" onSubmit={handleAddTask} />
              </div>
            </div>
          </div>

          {/* Right Column - Task List and Filters */}
          <div className="xl:col-span-2 order-1 xl:order-2 space-y-6">
            {/* Search and Filters */}
            <SearchAndFilters
              filters={filters}
              onFiltersChange={setFilters}
              taskCounts={taskCounts}
            />

            <Separator />

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={toggleComplete}
              onEdit={handleEditClick}
              onDelete={deleteTask}
              isOverdue={isOverdue}
            />
          </div>
        </div>

        {/* Mobile Add Task Dialog */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              mode="add"
              onSubmit={handleAddTask}
              onCancel={() => setShowAddForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>

            {editingTask && (
              <>
                <TaskForm
                  mode="edit"
                  task={editingTask}
                  onSubmit={handleEditTask}
                  onCancel={handleCancelEdit}
                />

                {/* показываем кнопку только владельцу */}
                {isOwner && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShareOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Manage access
                    </Button>
                  </div>
                )}

                {/* и сам диалог тоже рендерим только владельцу */}
                {isOwner && (
                  <ShareDialog
                    taskId={editingTask.id}
                    open={shareOpen}
                    onOpenChange={setShareOpen}
                  />
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
