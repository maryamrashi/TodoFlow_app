
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Category {
  WORK = 'Work',
  PERSONAL = 'Personal',
  SHOPPING = 'Shopping',
  HEALTH = 'Health',
  OTHER = 'Other'
}

export enum Recurrence {
  NONE = 'None',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly'
}

export interface Todo {
  id: string;
  text: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate: string;
  recurrence: Recurrence;
  createdAt: number;
}

export type FilterStatus = 'All' | 'Active' | 'Completed';
export type SortOption = 'Newest' | 'Oldest' | 'Priority' | 'Due Date';
