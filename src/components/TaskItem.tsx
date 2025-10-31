import React, { useState } from "react";
import { Task } from "../types/task";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Edit2, Trash2, Calendar, Clock } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isOverdue: (task: Task) => boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isOverdue,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500 hover:bg-red-600";
      case "Medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Low":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Work":
        return "bg-blue-500 hover:bg-blue-600";
      case "Personal":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const overdue = isOverdue(task);
  const { user: me } = useAuth();

  const toKey = (v: unknown) =>
    typeof v === "string" || typeof v === "number"
      ? String(v).toLowerCase()
      : "";

  const meId = toKey(me?.id ?? (me as any)?.userId ?? (me as any)?.sub);
  const meEmail = toKey(me?.email);

  const ownerId = toKey(task.ownerId ?? (task as any)?.owner?.id);
  const ownerEmail = toKey(task.ownerEmail ?? (task as any)?.owner?.email);

  const isOwner =
    (!!meId && !!ownerId && meId === ownerId) ||
    (!!meEmail && !!ownerEmail && meEmail === ownerEmail);

  return (
    <Card
      className={`transition-all duration-200 ${
        task.completed ? "opacity-60" : ""
      } ${overdue ? "border-red-500 border-2" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {/* line through */}
                <h3
                  className={`font-medium mb-1 ${
                    task.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </h3>

                {!isOwner && !!task.ownerEmail && (
                  <span
                    className="inline-flex items-center gap-2 text-xs text-muted-foreground truncate max-w-[240px]"
                    title={`Owner: ${task.ownerEmail}`}
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px]">
                      {task.ownerEmail
                        .split("@")[0]
                        .split(/[.\-_]/)
                        .slice(0, 2)
                        .map((s) => s[0]?.toUpperCase())
                        .join("") || "?"}
                    </span>
                    by {task.ownerEmail}
                  </span>
                )}
                {task.description && (
                  <p
                    className={`text-sm text-muted-foreground mb-2 ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(task)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {/* delete confirmation */}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{task.title}"? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(task.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            {/* badge */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge
                className={`${getPriorityColor(task.priority)} text-white`}
              >
                {task.priority}
              </Badge>

              <Badge
                className={`${getCategoryColor(task.category)} text-white`}
              >
                {task.category}
              </Badge>

              {task.dueDate && (
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 ${
                    overdue ? "border-red-500 text-red-600" : ""
                  }`}
                >
                  {overdue ? (
                    <Clock className="h-3 w-3" />
                  ) : (
                    <Calendar className="h-3 w-3" />
                  )}
                  {formatDate(task.dueDate)}
                  {overdue && (
                    <span className="text-red-600 ml-1">(Overdue)</span>
                  )}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
