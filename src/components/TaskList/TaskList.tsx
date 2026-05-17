import { useSelector, useDispatch } from 'react-redux';
import {
  DndContext,
  closestCenter,
  rectIntersection,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  selectFilteredTasks,
  selectViewMode,
  selectAllTasks,
} from '../../features/tasks/tasksSelectors';
import { reorderTasks } from '../../features/tasks/tasksSlice';
import SortableTaskItem from '../TaskItem/SortableTaskItem';
import SortableTaskCard from '../TaskCard/SortableTaskCard';
import './TaskList.css';
import type { Task } from '../../types/task';

interface TaskListProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ onEdit, onDelete }: TaskListProps) {
  const dispatch = useDispatch();
  const filteredTasks = useSelector(selectFilteredTasks);
  const allTasks = useSelector(selectAllTasks);
  const viewMode = useSelector(selectViewMode);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(filteredTasks, oldIndex, newIndex);

    const filteredIds = new Set(filteredTasks.map((t) => t.id));
    const nonFilteredTasks = allTasks.filter((t) => !filteredIds.has(t.id));

    dispatch(reorderTasks([...reordered, ...nonFilteredTasks]));
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="tasklist__empty app-container">
        <span className="tasklist__empty-icon">📋</span>
        <p className="tasklist__empty-title">No tasks found</p>
        <p className="tasklist__empty-sub">
          Add a new task or adjust your filters
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={viewMode === 'list' ? closestCenter : rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredTasks.map((t) => t.id)}
        strategy={viewMode === 'list' ? verticalListSortingStrategy : rectSortingStrategy}
      >
        <div className={`tasklist app-container tasklist--${viewMode}`}>
          {filteredTasks.map((task: Task) =>
            viewMode === 'list' ? (
              <SortableTaskItem
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ) : (
              <SortableTaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}