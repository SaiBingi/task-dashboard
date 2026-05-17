import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskFormData, FilterState, ViewMode } from '../../types/task';
import {
  createTask,
  loadTasksFromStorage,
  saveTasksToStorage,
} from '../../utils/taskUtils';
import { LOCAL_STORAGE_KEY, VIEW_MODE_KEY } from '../../constants';

interface TasksState {
  tasks: Task[];
  filters: FilterState;
  viewMode: ViewMode;
}

function loadViewMode(): ViewMode {
  try {
    const stored = localStorage.getItem(VIEW_MODE_KEY);
    if (stored === 'list' || stored === 'card') return stored;
  } catch {}
  return 'list';
}

const initialState: TasksState = {
  tasks: loadTasksFromStorage(LOCAL_STORAGE_KEY),
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
  },
  viewMode: loadViewMode(),
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<TaskFormData>) {
      const order = state.tasks.length;
      const task = createTask(action.payload, order);
      state.tasks.push(task);
      saveTasksToStorage(LOCAL_STORAGE_KEY, state.tasks);
    },

    updateTask(
      state,
      action: PayloadAction<{ id: string; data: TaskFormData }>
    ) {
      const { id, data } = action.payload;
      const index = state.tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          title: data.title.trim(),
          description: data.description.trim(),
          priority: data.priority,
          dueDate: data.dueDate,
        };
        saveTasksToStorage(LOCAL_STORAGE_KEY, state.tasks);
      }
    },

    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      state.tasks.forEach((t, i) => { t.order = i; });
      saveTasksToStorage(LOCAL_STORAGE_KEY, state.tasks);
    },

    toggleTaskStatus(state, action: PayloadAction<string>) {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.status = task.status === 'pending' ? 'completed' : 'pending';
        saveTasksToStorage(LOCAL_STORAGE_KEY, state.tasks);
      }
    },

    reorderTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload.map((t, i) => ({ ...t, order: i }));
      saveTasksToStorage(LOCAL_STORAGE_KEY, state.tasks);
    },

    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },

    setStatusFilter(state, action: PayloadAction<FilterState['status']>) {
      state.filters.status = action.payload;
    },

    setPriorityFilter(state, action: PayloadAction<FilterState['priority']>) {
      state.filters.priority = action.payload;
    },

    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
      try {
        localStorage.setItem(VIEW_MODE_KEY, action.payload);
      } catch {}
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  reorderTasks,
  setSearch,
  setStatusFilter,
  setPriorityFilter,
  setViewMode,
} = tasksSlice.actions;

export default tasksSlice.reducer;