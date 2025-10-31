// tasks
export type Priority = "High" | "Medium" | "Low";
export type Category = "Work" | "Personal";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  category: Category;
  createdAt: string;
  updatedAt: string;

  version?: number;

  tags?: string[];
  metadata?: Record<string, unknown>;
  ownerId?: string;
  ownerEmail?: string;
}

export interface TaskFilters {
  category?: Category;
  priority?: Priority;
  completed?: boolean;
  search: string;
}
