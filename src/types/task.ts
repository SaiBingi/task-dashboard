export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'completed';
export type ViewMode = 'list' | 'card';
export type FilterStatus = 'all' | 'pending' | 'completed';
export type FilterPriority = 'all' | 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;       
  status: Status;
  createdAt: string;     
  order: number;         // for drag-and-drop ordering
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

export interface FilterState {
  search: string;
  status: FilterStatus;
  priority: FilterPriority;
}