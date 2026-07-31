export interface CreateHabitInput {
  title: string;
  description?: string;
}

export interface UpdateHabitInput {
  title?: string;
  description?: string;
  completed?: boolean;
}