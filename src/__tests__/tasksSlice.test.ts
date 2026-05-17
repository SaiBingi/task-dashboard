import tasksReducer, {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  setSearch,
  setStatusFilter,
  setViewMode,
} from "../features/tasks/tasksSlice";
import type { TaskFormData } from "../types/task";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

const formData: TaskFormData = {
  title: "Test Task",
  description: "A description",
  priority: "medium",
  dueDate: "2025-12-31",
};

function getInitialState() {
  return tasksReducer(undefined, { type: "@@INIT" });
}

describe("tasksSlice — initial state", () => {
  beforeEach(() => localStorageMock.clear());

  it("starts with empty tasks array when localStorage is empty", () => {
    const state = getInitialState();
    expect(state.tasks).toEqual([]);
  });

  it("starts with correct default filters", () => {
    const state = getInitialState();
    expect(state.filters.search).toBe("");
    expect(state.filters.status).toBe("all");
    expect(state.filters.priority).toBe("all");
  });

  it("starts with list view mode", () => {
    const state = getInitialState();
    expect(state.viewMode).toBe("list");
  });
});

describe("addTask", () => {
  it("adds a task to the list", () => {
    const state = tasksReducer(getInitialState(), addTask(formData));
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].title).toBe("Test Task");
  });

  it("sets status to pending", () => {
    const state = tasksReducer(getInitialState(), addTask(formData));
    expect(state.tasks[0].status).toBe("pending");
  });
});

describe("updateTask", () => {
  it("updates task fields correctly", () => {
    let state = tasksReducer(getInitialState(), addTask(formData));
    const id = state.tasks[0].id;
    state = tasksReducer(
      state,
      updateTask({
        id,
        data: { ...formData, title: "Updated Title", priority: "high" },
      }),
    );
    expect(state.tasks[0].title).toBe("Updated Title");
    expect(state.tasks[0].priority).toBe("high");
  });

  it("does not change status when updating", () => {
    let state = tasksReducer(getInitialState(), addTask(formData));
    const id = state.tasks[0].id;
    state = tasksReducer(state, toggleTaskStatus(id));
    state = tasksReducer(
      state,
      updateTask({ id, data: { ...formData, title: "New" } }),
    );
    expect(state.tasks[0].status).toBe("completed");
  });
});

describe("deleteTask", () => {
  it("removes the task with matching id", () => {
    let state = tasksReducer(getInitialState(), addTask(formData));
    const id = state.tasks[0].id;
    state = tasksReducer(state, deleteTask(id));
    expect(state.tasks).toHaveLength(0);
  });

  it("does nothing for unknown id", () => {
    let state = tasksReducer(getInitialState(), addTask(formData));
    state = tasksReducer(state, deleteTask("nonexistent"));
    expect(state.tasks).toHaveLength(1);
  });
});

describe("toggleTaskStatus", () => {
  it("toggles pending to completed", () => {
    let state = tasksReducer(getInitialState(), addTask(formData));
    const id = state.tasks[0].id;
    state = tasksReducer(state, toggleTaskStatus(id));
    expect(state.tasks[0].status).toBe("completed");
  });

  it("toggles completed back to pending", () => {
    let state = tasksReducer(getInitialState(), addTask(formData));
    const id = state.tasks[0].id;
    state = tasksReducer(state, toggleTaskStatus(id));
    state = tasksReducer(state, toggleTaskStatus(id));
    expect(state.tasks[0].status).toBe("pending");
  });
});

describe("filter actions", () => {
  it("setSearch updates search string", () => {
    const state = tasksReducer(getInitialState(), setSearch("hello"));
    expect(state.filters.search).toBe("hello");
  });

  it("setStatusFilter updates status", () => {
    const state = tasksReducer(getInitialState(), setStatusFilter("completed"));
    expect(state.filters.status).toBe("completed");
  });

  it("setViewMode updates view mode", () => {
    const state = tasksReducer(getInitialState(), setViewMode("card"));
    expect(state.viewMode).toBe("card");
  });
});
