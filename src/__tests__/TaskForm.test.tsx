import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";
import TaskForm from "../components/TaskForm/TaskForm";

function renderForm(onClose = vi.fn()) {
  const store = configureStore({
    reducer: { tasks: tasksReducer },
    preloadedState: {
      tasks: {
        tasks: [],
        filters: { search: "", status: "all", priority: "all" },
        viewMode: "list" as const,
      },
    },
  });

  return {
    store,
    onClose,
    ...render(
      <Provider store={store}>
        <TaskForm onClose={onClose} />
      </Provider>,
    ),
  };
}

describe("TaskForm", () => {
  it("renders all form fields", () => {
    const { container } = renderForm();
    expect(container.querySelector("#title")).toBeInTheDocument();
    expect(container.querySelector("#description")).toBeInTheDocument();
    expect(container.querySelector("#priority")).toBeInTheDocument();
    expect(container.querySelector("#dueDate")).toBeInTheDocument();
  });

  it("shows error when title is empty on submit", async () => {
    renderForm();
    fireEvent.click(screen.getByText(/add task/i));
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it("shows error when due date is missing", async () => {
    const { container } = renderForm();
    fireEvent.change(container.querySelector("#title")!, {
      target: { value: "Valid title" },
    });
    fireEvent.click(screen.getByText(/add task/i));
    await waitFor(() => {
      expect(screen.getByText(/due date is required/i)).toBeInTheDocument();
    });
  });

  it("calls onClose and adds task on valid submission", async () => {
    const { onClose, store, container } = renderForm();

    fireEvent.change(container.querySelector("#title")!, {
      target: { value: "My new task" },
    });
    fireEvent.change(container.querySelector("#dueDate")!, {
      target: { value: "2026-01-01" },
    });
    fireEvent.click(screen.getByText(/add task/i));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    const state = store.getState();
    expect(state.tasks.tasks).toHaveLength(1);
    expect(state.tasks.tasks[0].title).toBe("My new task");
  });

  it("calls onClose when cancel is clicked", () => {
    const { onClose } = renderForm();
    fireEvent.click(screen.getByText(/cancel/i));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
