import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../features/tasks/tasksSlice';
import { PRIORITY_OPTIONS } from '../../constants';
import type { TaskFormData, Priority } from '../../types/task';
import './TaskForm.css';

interface TaskFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const EMPTY_FORM: TaskFormData = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

export default function TaskForm({ onClose, onSuccess }: TaskFormProps) {
  const dispatch = useDispatch();
  const [form, setForm] = useState<TaskFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

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
    dispatch(addTask(form));
    onSuccess?.();
    onClose();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label className="form-label" htmlFor="title">
          Title <span className="form-required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`form-input ${errors.title ? 'form-input--error' : ''}`}
          placeholder="e.g. Fix login page bug"
          value={form.title}
          onChange={handleChange}
          autoFocus
          maxLength={100}
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="form-input form-textarea"
          placeholder="Optional details about this task..."
          value={form.description}
          onChange={handleChange}
          rows={3}
          maxLength={500}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
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
          <label className="form-label" htmlFor="dueDate">
            Due Date <span className="form-required">*</span>
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className={`form-input ${errors.dueDate ? 'form-input--error' : ''}`}
            value={form.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
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
          Add Task
        </button>
      </div>
    </form>
  );
}