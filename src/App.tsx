import { useState } from 'react';
import './App.css';

import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from './hooks/useTheme';

import { deleteTask } from './features/tasks/tasksSlice';
import { selectViewMode } from './features/tasks/tasksSelectors';

import Header from './components/Header/Header';
import StatsBar from './components/StatsBar/StatsBar';
import Filters from './components/Filters/Filters';
import TaskList from './components/TaskList/TaskList';
import Modal from './components/Modal/Modal';
import TaskForm from './components/TaskForm/TaskForm';
import EditTaskForm from './components/TaskForm/EditTaskForm';
import ConfirmDialog from './components/ConfirmDialog/ConfirmDialog';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { theme, toggleTheme } = useTheme();

  const dispatch = useDispatch();

  const viewMode = useSelector(selectViewMode);

  const [showAddTask, setShowAddTask] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(
    null
  );

  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(
    null
  );

  function handleEdit(id: string) {
    setEditingTaskId(id);
  }

  function handleDeleteRequest(id: string) {
    setDeletingTaskId(id);
  }

  function handleDeleteConfirm() {
    if (!deletingTaskId) return;

    dispatch(deleteTask(deletingTaskId));

    setDeletingTaskId(null);

    toast.success('Task deleted');
  }

  return (
    <div className="app-root">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onAddTask={() => setShowAddTask(true)}
      />

      <main className="app-main">
        <StatsBar />

        <Filters />

        {viewMode === 'list' && (
          <p className="drag-hint app-container">
            ↕ Drag tasks to reorder
          </p>
        )}

        <TaskList
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      </main>

      {showAddTask && (
        <Modal
          title="Add Task"
          onClose={() => setShowAddTask(false)}
        >
          {(handleClose) => (
            <TaskForm
              onClose={handleClose}
              onSuccess={() => {
                toast.success('Task added successfully');
              }}
            />
          )}
        </Modal>
      )}

      {editingTaskId && (
        <Modal
          title="Edit Task"
          onClose={() => setEditingTaskId(null)}
        >
          {(handleClose) => (
            <EditTaskForm
              taskId={editingTaskId}
              onClose={handleClose}
              onSuccess={() => {
                toast.success('Task updated');
              }}
            />
          )}
        </Modal>
      )}

      {deletingTaskId && (
        <ConfirmDialog
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingTaskId(null)}
        />
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable={false}
        theme={theme}
      />
    </div>
  );
}

export default App;