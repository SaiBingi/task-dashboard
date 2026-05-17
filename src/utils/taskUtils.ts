import type { Task, TaskFormData, FilterState } from '../types/task';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createTask(data: TaskFormData, order: number): Task {
  return {
    id: generateId(),
    title: data.title.trim(),
    description: data.description.trim(),
    priority: data.priority,
    dueDate: data.dueDate,
    status: 'pending',
    createdAt: new Date().toISOString(),
    order,
  };
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function isOverdue(dueDate: string, status: string): boolean {
  if (!dueDate || status === 'completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  return due < today;
}

export function filterTasks(tasks: Task[], filters: FilterState): Task[] {
  const search = filters.search.toLowerCase().trim();

  return tasks.filter((task) => {
    if (search) {
      const matchesSearch =
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search);
      if (!matchesSearch) return false;
    }

    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    return true;
  });
}

export function loadTasksFromStorage(key: string): Task[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export function saveTasksToStorage(key: string, tasks: Task[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(tasks));
  } catch {
    // storage quota exceeded or unavailable — fail silently
    console.warn('localStorage write failed');
  }
}