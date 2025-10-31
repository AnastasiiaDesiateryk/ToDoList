import React from "react";
import { TaskFilters, Priority, Category } from "../types/task";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Search, X } from "lucide-react";

interface SearchAndFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  taskCounts: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
}

export function SearchAndFilters({
  filters,
  onFiltersChange,
  taskCounts,
}: SearchAndFiltersProps) {
  const clearFilters = () => {
    onFiltersChange({
      search: "",
      category: undefined,
      priority: undefined,
      completed: undefined,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.priority ||
    filters.completed !== undefined;

  return (
    <div className="space-y-4">
      {/* Search Bar Search tasks by title or description */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks by title or description..."
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select
          value={filters.category || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              category: value === "all" ? undefined : (value as Category),
            })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Work">Work</SelectItem>
            <SelectItem value="Personal">Personal</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              priority: value === "all" ? undefined : (value as Priority),
            })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            filters.completed === undefined
              ? "all"
              : filters.completed
              ? "completed"
              : "pending"
          }
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              completed: value === "all" ? undefined : value === "completed",
            })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Task Summary */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Total: {taskCounts.total}</Badge>
        <Badge variant="secondary">Pending: {taskCounts.pending}</Badge>
        <Badge variant="secondary">Completed: {taskCounts.completed}</Badge>
        {taskCounts.overdue > 0 && (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            Overdue: {taskCounts.overdue}
          </Badge>
        )}
      </div>
    </div>
  );
}
