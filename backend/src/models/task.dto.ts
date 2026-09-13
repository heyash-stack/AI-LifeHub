export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: Date | string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: Date | string | null;
}
