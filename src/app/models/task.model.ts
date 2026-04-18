export type FilterType = 'all' | 'completed' | 'pending';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCounts {
  all: number;
  completed: number;
  pending: number;
}
