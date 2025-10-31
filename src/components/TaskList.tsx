import React from "react";
import { Task } from "../types/task";
import { TaskItem } from "./TaskItem";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "./ui/card";
import { CheckCircle } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isOverdue: (task: Task) => boolean;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  isOverdue,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No tasks found
          </h3>
          <p className="text-sm text-muted-foreground">
            Create your first task or adjust your filters to see tasks here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort tasks: incomplete first, then by priority (High > Medium > Low), then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Sort by priority
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // Sort by due date (soonest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    // Finally sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="w-full">
      <ScrollArea className="h-[600px] w-full">
        <div className="space-y-3 pr-4">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              isOverdue={isOverdue}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
