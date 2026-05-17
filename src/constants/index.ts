import type { Priority, FilterStatus, FilterPriority } from '../types/task';

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const STATUS_FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

export const PRIORITY_FILTER_OPTIONS: { value: FilterPriority; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const LOCAL_STORAGE_KEY = 'task_dashboard_tasks';
export const THEME_KEY = 'task_dashboard_theme';
export const VIEW_MODE_KEY = 'task_dashboard_view_mode';