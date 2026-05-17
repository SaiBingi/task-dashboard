import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { setViewMode } from "../../features/tasks/tasksSlice";
import { selectViewMode } from "../../features/tasks/tasksSelectors";
import type { ViewMode } from "../../types/task";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onAddTask: () => void;
}

export default function Header({
  theme,
  onToggleTheme,
  onAddTask,
}: HeaderProps) {
  const dispatch = useDispatch();
  const viewMode = useSelector(selectViewMode);

  function handleViewChange(mode: ViewMode) {
    dispatch(setViewMode(mode));
  }

  return (
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

          <div className="view-toggle">
            <button
              className={`view-toggle__btn ${viewMode === "list" ? "view-toggle__btn--active" : ""}`}
              onClick={() => handleViewChange("list")}
              title="List view"
            >
              <ListIcon />
              <span>List</span>
            </button>
            <button
              className={`view-toggle__btn ${viewMode === "card" ? "view-toggle__btn--active" : ""}`}
              onClick={() => handleViewChange("card")}
              title="Card view"
            >
              <CardIcon />
              <span>Card</span>
            </button>
          </div>

          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </header>
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
