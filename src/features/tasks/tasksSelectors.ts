import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { filterTasks } from '../../utils/taskUtils';

const selectTasksState = (state: RootState) => state.tasks;

export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectFilters = (state: RootState) => state.tasks.filters;
export const selectViewMode = (state: RootState) => state.tasks.viewMode;

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectFilters,
  (tasks, filters) => {
    const sorted = [...tasks].sort((a, b) => a.order - b.order);
    return filterTasks(sorted, filters);
  }
);

export const selectTaskStats = createSelector(selectAllTasks, (tasks) => ({
  total: tasks.length,
  pending: tasks.filter((t) => t.status === 'pending').length,
  completed: tasks.filter((t) => t.status === 'completed').length,
}));