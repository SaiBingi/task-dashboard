import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  setStatusFilter,
  setPriorityFilter,
} from "../../features/tasks/tasksSlice";
import { selectFilters } from "../../features/tasks/tasksSelectors";
import {
  STATUS_FILTER_OPTIONS,
  PRIORITY_FILTER_OPTIONS,
} from "../../constants";
import "./Filters.css";

export default function Filters() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  return (
    <div className="filters app-container">
      <div className="filters__search-wrap">
        <span className="filters__search-icon">
          <SearchIcon />
        </span>
        <input
          type="text"
          className="filters__search"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
        {filters.search && (
          <button
            className="filters__search-clear"
            onClick={() => dispatch(setSearch(""))}
          >
            ✕
          </button>
        )}
      </div>

      <div className="filters__controls">
        <div className="filters__tabs">
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`filters__tab ${
                filters.status === opt.value ? "filters__tab--active" : ""
              }`}
              onClick={() => dispatch(setStatusFilter(opt.value))}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <select
          className="filters__priority"
          value={filters.priority}
          onChange={(e) =>
            dispatch(
              setPriorityFilter(e.target.value as typeof filters.priority),
            )
          }
        >
          {PRIORITY_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="6.5" cy="6.5" r="5" />
      <line x1="10.5" y1="10.5" x2="15" y2="15" />
    </svg>
  );
}
