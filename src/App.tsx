import { useState } from "react";
import "./App.css";
import { useTheme } from "./hooks/useTheme";
import { useAuth } from "./hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "./features/tasks/tasksSlice";
import { selectViewMode } from "./features/tasks/tasksSelectors";
import {
  useFirestoreTasks,
  deleteTaskFromFirestore,
} from "./hooks/useFirestoreTasks";
import Header from "./components/Header/Header";
import StatsBar from "./components/StatsBar/StatsBar";
import Filters from "./components/Filters/Filters";
import TaskList from "./components/TaskList/TaskList";
import Modal from "./components/Modal/Modal";
import TaskForm from "./components/TaskForm/TaskForm";
import EditTaskForm from "./components/TaskForm/EditTaskForm";
import ConfirmDialog from "./components/ConfirmDialog/ConfirmDialog";
import Login from "./components/Login/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const dispatch = useDispatch();
  const viewMode = useSelector(selectViewMode);

  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  useFirestoreTasks(user?.uid ?? "");

  async function handleDeleteConfirm() {
    if (deletingTaskId && user) {
      dispatch(deleteTask(deletingTaskId));
      await deleteTaskFromFirestore(user.uid, deletingTaskId);
      setDeletingTaskId(null);
      toast.success("Task deleted");
    }
  }

  if (loading) {
    return (
      <div className="app-loading">
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Login onSignIn={signInWithGoogle} />
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          theme={theme === "dark" ? "dark" : "light"}
        />
      </>
    );
  }

  return (
    <div className="app-root">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onAddTask={() => setShowAddTask(true)}
        user={user}
        onLogout={logout}
      />

      <main className="app-main">
        <StatsBar />
        <Filters />
        {viewMode === "list" && (
          <p className="drag-hint app-container">↕ Drag tasks to reorder</p>
        )}
        <TaskList
          onEdit={setEditingTaskId}
          onDelete={setDeletingTaskId}
          userId={user.uid}
        />
      </main>

      {showAddTask && (
        <Modal title="Add Task" onClose={() => setShowAddTask(false)}>
          <TaskForm
            onClose={() => setShowAddTask(false)}
            onSuccess={() => toast.success("Task added successfully")}
            userId={user.uid}
          />
        </Modal>
      )}

      {editingTaskId && (
        <Modal title="Edit Task" onClose={() => setEditingTaskId(null)}>
          <EditTaskForm
            taskId={editingTaskId}
            onClose={() => setEditingTaskId(null)}
            onSuccess={() => toast.success("Task updated")}
            userId={user.uid}
          />
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
        theme={theme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}

export default App;
