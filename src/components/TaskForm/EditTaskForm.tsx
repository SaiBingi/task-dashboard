import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from '../../features/tasks/tasksSlice';
import { selectAllTasks } from '../../features/tasks/tasksSelectors';
import { PRIORITY_OPTIONS } from '../../constants';
import type { TaskFormData } from '../../types/task';
import './TaskForm.css';

interface EditTaskFormProps {
  taskId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditTaskForm({
  taskId,
  onClose,
  onSuccess,
}: EditTaskFormProps) {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const task = tasks.find((t) => t.id === taskId);

  const [form, setForm] = useState<TaskFormData>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    priority: task?.priority ?? 'medium',
    dueDate: task?.dueDate ?? '',
  });

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  if (!task) return null;

  function validate(): boolean {
    const newErrors: Partial<TaskFormData> = {};
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (!form.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof TaskFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    dispatch(updateTask({ id: taskId, data: form }));
    onSuccess?.();
    onClose();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label className="form-label" htmlFor="edit-title">
          Title <span className="form-required">*</span>
        </label>
        <input
          id="edit-title"
          name="title"
          type="text"
          className={`form-input ${errors.title ? 'form-input--error' : ''}`}
          value={form.title}
          onChange={handleChange}
          autoFocus
          maxLength={100}
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="edit-description">
          Description
        </label>
        <textarea
          id="edit-description"
          name="description"
          className="form-input form-textarea"
          value={form.description}
          onChange={handleChange}
          rows={3}
          maxLength={500}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="edit-priority">
            Priority
          </label>
          <select
            id="edit-priority"
            name="priority"
            className="form-input form-select"
            value={form.priority}
            onChange={handleChange}
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="edit-dueDate">
            Due Date <span className="form-required">*</span>
          </label>
          <input
            id="edit-dueDate"
            name="dueDate"
            type="date"
            className={`form-input ${errors.dueDate ? 'form-input--error' : ''}`}
            value={form.dueDate}
            onChange={handleChange}
          />
          {errors.dueDate && (
            <span className="form-error">{errors.dueDate}</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          Save Changes
        </button>
      </div>
    </form>
  );
}