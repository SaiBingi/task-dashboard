import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import type { Task } from '../../types/task';

interface SortableTaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SortableTaskCard({
  task,
  onEdit,
  onDelete,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
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
    height: '100%',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}