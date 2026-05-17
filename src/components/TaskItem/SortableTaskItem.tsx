import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskItem from './TaskItem';
import type { Task } from '../../types/task';

interface SortableTaskItemProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SortableTaskItem({
  task,
  onEdit,
  onDelete,
}: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskItem
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}