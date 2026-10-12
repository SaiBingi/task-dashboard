import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import TaskList from "../components/TaskList/TaskList";
import tasksReducer, { setSearch } from "../features/tasks/tasksSlice";
import type { Task, ViewMode } from "../types/task";

vi.mock("../components/TaskItem/SortableTaskItem", () => ({
  default: ({ task }: { task: { title: string } }) => <div>{task.title}</div>,
}));

vi.mock("../components/TaskCard/SortableTaskCard", () => ({
  default: ({ task }: { task: { title: string } }) => <div>{task.title}</div>,
}));

vi.mock("../hooks/useFirestoreTasks", () => ({
  saveAllTasksToFirestore: vi.fn(),
}));

function makeTasks(count: number): Task[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `task-${index + 1}`,
    title: `Task ${index + 1}`,
    description: "",
    priority: "low",
    dueDate: "2026-10-12",
    status: "pending",
    createdAt: "2026-10-11T00:00:00.000Z",
    order: index,
  }));
}

function renderTaskList(viewMode: ViewMode, count = 20) {
  const store = configureStore({
    reducer: { tasks: tasksReducer },
    preloadedState: {
      tasks: {
        tasks: makeTasks(count),
        filters: { search: "", status: "all", priority: "all" },
        viewMode,
      },
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <TaskList onEdit={vi.fn()} onDelete={vi.fn()} userId="user-1" />
      </Provider>,
    ),
  };
}

describe.each(["list", "card"] as const)("TaskList in %s view", (viewMode) => {
  it("shows nine tasks per page and navigates to the next page", async () => {
    const user = userEvent.setup();
    renderTaskList(viewMode);

    for (let taskNumber = 1; taskNumber <= 9; taskNumber += 1) {
      expect(screen.getByText(`Task ${taskNumber}`)).toBeInTheDocument();
    }
    expect(screen.queryByText("Task 10")).not.toBeInTheDocument();
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Task 10")).toBeInTheDocument();
    expect(screen.getByText("Task 18")).toBeInTheDocument();
    expect(screen.queryByText("Task 9")).not.toBeInTheDocument();
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
  });

  it("does not show pagination for nine or fewer tasks", () => {
    renderTaskList(viewMode, 9);

    expect(screen.queryByRole("navigation", { name: "Task pages" })).not.toBeInTheDocument();
  });
});

it("returns to the first page when search filters change", async () => {
  const user = userEvent.setup();
  const { store } = renderTaskList("list");
  await user.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();

  act(() => store.dispatch(setSearch("Task 1")));

  expect(screen.getByText("Task 1")).toBeInTheDocument();
  expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
});