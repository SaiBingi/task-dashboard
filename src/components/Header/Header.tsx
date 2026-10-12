import "./Header.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setViewMode } from "../../features/tasks/tasksSlice";
import { selectViewMode } from "../../features/tasks/tasksSelectors";
import type { User } from "firebase/auth";
import type { ViewMode } from "../../types/task";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onAddTask: () => void;
  user: User;
  onLogout: () => void;
}

export default function Header({
  theme,
  onToggleTheme,
  onAddTask,
  user,
  onLogout,
}: HeaderProps) {
  const dispatch = useDispatch();
  const viewMode = useSelector(selectViewMode);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  function handleViewChange(mode: ViewMode) {
    dispatch(setViewMode(mode));
  }

  return (
    <>
      <header className="header">
        <div className="header__inner app-container">
          <div className="header__left">
            <span className="header__icon">✓</span>
            <h1 className="header__title">Task Dashboard</h1>
          </div>

          <div className="header__right">
            <button className="btn btn--primary" onClick={onAddTask}>
              <span className="btn-plus">+</span>
              <span>Add Task</span>
            </button>

            <div className="view-toggle" role="group" aria-label="View mode">
              <button
                className={`view-toggle__btn ${viewMode === "list" ? "view-toggle__btn--active" : ""}`}
                onClick={() => handleViewChange("list")}
                title="List view"
                aria-pressed={viewMode === "list"}
              >
                <ListIcon />
                <span>List</span>
              </button>
              <button
                className={`view-toggle__btn ${viewMode === "card" ? "view-toggle__btn--active" : ""}`}
                onClick={() => handleViewChange("card")}
                title="Card view"
                aria-pressed={viewMode === "card"}
              >
                <CardIcon />
                <span>Card</span>
              </button>
            </div>

            <button
              className="theme-toggle"
              onClick={onToggleTheme}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <div className="header__user">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName ?? "User"}
                  className="header__avatar"
                  referrerPolicy="no-referrer"
                />
              )}
              <button
                className="header__signout"
                onClick={() => setShowSignOutConfirm(true)}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sign out confirmation */}
      {showSignOutConfirm && (
        <div
          className="signout-overlay"
          onClick={() => setShowSignOutConfirm(false)}
        >
          <div className="signout-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="signout-dialog__title">Sign out?</p>
            <p className="signout-dialog__sub">
              You'll need to sign in again to access your tasks.
            </p>
            <div className="signout-dialog__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setShowSignOutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn--danger"
                onClick={() => {
                  setShowSignOutConfirm(false);
                  onLogout();
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="1" width="16" height="2" rx="1" />
      <rect x="0" y="7" width="16" height="2" rx="1" />
      <rect x="0" y="13" width="16" height="2" rx="1" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="0" width="7" height="7" rx="1" />
      <rect x="9" y="0" width="7" height="7" rx="1" />
      <rect x="0" y="9" width="7" height="7" rx="1" />
      <rect x="9" y="9" width="7" height="7" rx="1" />
    </svg>
  );
}
