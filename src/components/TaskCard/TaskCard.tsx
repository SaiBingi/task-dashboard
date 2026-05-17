import { useDispatch } from 'react-redux';
import { toggleTaskStatus } from '../../features/tasks/tasksSlice';
import { formatDate, isOverdue } from '../../utils/taskUtils';
import { PRIORITY_LABELS } from '../../constants';
import type { Task } from '../../types/task';
import { toast } from 'react-toastify';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  isDragging?: boolean;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  dragHandleProps,
  isDragging = false,
}: TaskCardProps) {
  const dispatch = useDispatch();
  const overdue = isOverdue(task.dueDate, task.status);

  function handleToggle() {
    dispatch(toggleTaskStatus(task.id));

    const toastId = `toggle-${task.id}`;
    const isCompleting = task.status === 'pending';
    const message = isCompleting
      ? 'Task marked as completed'
      : 'Task marked as pending';
    const type = isCompleting ? 'success' : 'info';

    if (toast.isActive(toastId)) {
      toast.update(toastId, {
        render: message,
        type,
        autoClose: 2500,
      });
    } else {
      toast[type](message, { toastId, autoClose: 2500 });
    }
  }

  return (
    <div
      className={`task-card
        ${task.status === 'completed' ? 'task-card--completed' : ''}
        ${isDragging ? 'task-card--dragging' : ''}
      `}
    >
      <div className="task-card__header">
        <div className="task-card__header-left">
          {dragHandleProps && (
            <span
              className="task-card__drag-handle"
              title="Drag to reorder"
              {...dragHandleProps}
            >
              <DragIcon />
            </span>
          )}
          <span className={`task-item__priority priority--${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>

        <div className="task-card__actions">
          <button
            className="task-item__action-btn"
            onClick={() => onEdit(task.id)}
            title="Edit task"
          >
            <EditIcon />
          </button>
          <button
            className="task-item__action-btn task-item__action-btn--danger"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>

      <h3 className="task-card__title">{task.title}</h3>

      {task.description && (
        <p className="task-card__desc">{task.description}</p>
      )}

      <div className="task-card__footer">
        <span
          className={`task-card__due ${overdue ? 'task-item__due--overdue' : ''}`}
        >
          <CalendarIcon />
          {overdue ? 'Overdue · ' : ''}
          {formatDate(task.dueDate)}
        </span>

        <button
          className={`task-card__check-btn ${
            task.status === 'completed' ? 'task-card__check-btn--done' : ''
          }`}
          onClick={handleToggle}
          title={
            task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'
          }
        >
          {task.status === 'completed' ? '✓ Done' : 'Mark done'}
        </button>
      </div>
    </div>
  );
}

function DragIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5" cy="3" r="1.5" />
      <circle cx="11" cy="3" r="1.5" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="11" cy="8" r="1.5" />
      <circle cx="5" cy="13" r="1.5" />
      <circle cx="11" cy="13" r="1.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 2l3 3-9 9H2v-3l9-9z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,4 13,4" />
      <path d="M5 4V2h6v2" />
      <path d="M4 4l1 10h6l1-10" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="1" y="3" width="14" height="12" rx="2" />
      <line x1="1" y1="7" x2="15" y2="7" />
      <line x1="5" y1="1" x2="5" y2="5" />
      <line x1="11" y1="1" x2="11" y2="5" />
    </svg>
  );
}