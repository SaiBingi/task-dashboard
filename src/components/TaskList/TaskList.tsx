import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  closestCenter,
  rectIntersection,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  selectFilteredTasks,
  selectViewMode,
  selectAllTasks,
  selectFilters,
} from "../../features/tasks/tasksSelectors";
import { reorderTasks } from "../../features/tasks/tasksSlice";
import { saveAllTasksToFirestore } from "../../hooks/useFirestoreTasks";
import SortableTaskItem from "../TaskItem/SortableTaskItem";
import SortableTaskCard from "../TaskCard/SortableTaskCard";
import "./TaskList.css";
import type { Task } from "../../types/task";

const ITEMS_PER_PAGE = 9;

interface TaskListProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  userId: string;
}

export default function TaskList({ onEdit, onDelete, userId }: TaskListProps) {
  const dispatch = useDispatch();
  const filteredTasks = useSelector(selectFilteredTasks);
  const allTasks = useSelector(selectAllTasks);
  const viewMode = useSelector(selectViewMode);
  const filters = useSelector(selectFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const displayedPage = Math.min(currentPage, totalPages);
  const pageTasks = filteredTasks.slice(
    (displayedPage - 1) * ITEMS_PER_PAGE,
    displayedPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.status, filters.priority]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(filteredTasks, oldIndex, newIndex);
    const filteredIds = new Set(filteredTasks.map((t) => t.id));
    const nonFilteredTasks = allTasks.filter((t) => !filteredIds.has(t.id));
    const finalTasks = [...reordered, ...nonFilteredTasks];

    dispatch(reorderTasks(finalTasks));
    await saveAllTasksToFirestore(userId, finalTasks);
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="tasklist__empty app-container">
        <span className="tasklist__empty-icon">📋</span>
        <p className="tasklist__empty-title">No tasks found</p>
        <p className="tasklist__empty-sub">
          Add a new task or adjust your filters
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={
        viewMode === "list" ? closestCenter : rectIntersection
      }
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={pageTasks.map((t) => t.id)}
        strategy={
          viewMode === "list"
            ? verticalListSortingStrategy
            : rectSortingStrategy
        }
      >
        <div className={`tasklist app-container tasklist--${viewMode}`}>
          {pageTasks.map((task: Task) =>
            viewMode === "list" ? (
              <SortableTaskItem
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                userId={userId}
              />
            ) : (
              <SortableTaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                userId={userId}
              />
            ),
          )}
        </div>
      </SortableContext>
      {totalPages > 1 && (
        <nav className="tasklist-pagination app-container" aria-label="Task pages">
          <button
            className="tasklist-pagination__button"
            type="button"
            onClick={() => setCurrentPage(displayedPage - 1)}
            disabled={displayedPage === 1}
          >
            Previous
          </button>
          <span className="tasklist-pagination__status" aria-live="polite">
            Page {displayedPage} of {totalPages}
          </span>
          <button
            className="tasklist-pagination__button"
            type="button"
            onClick={() => setCurrentPage(displayedPage + 1)}
            disabled={displayedPage === totalPages}
          >
            Next
          </button>
        </nav>
      )}
    </DndContext>
  );
}
