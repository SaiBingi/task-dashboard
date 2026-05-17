import {
  generateId,
  createTask,
  formatDate,
  isOverdue,
} from "../utils/taskUtils";
import type { TaskFormData } from "../types/task";

describe("generateId", () => {
  it("returns unique ids on each call", () => {
    const ids = new Set(Array.from({ length: 50 }, generateId));
    expect(ids.size).toBe(50);
  });
});

describe("createTask", () => {
  const formData: TaskFormData = {
    title: "  Fix bug  ",
    description: "  Some desc  ",
    priority: "high",
    dueDate: "2025-12-31",
  };

  it("trims title and description", () => {
    const task = createTask(formData, 0);
    expect(task.title).toBe("Fix bug");
    expect(task.description).toBe("Some desc");
  });

  it("sets status to pending", () => {
    const task = createTask(formData, 0);
    expect(task.status).toBe("pending");
  });

  it("sets the order correctly", () => {
    const task = createTask(formData, 3);
    expect(task.order).toBe(3);
  });
});

describe("formatDate", () => {
  it("returns — for empty string", () => {
    expect(formatDate("")).toBe("—");
  });
});

describe("isOverdue", () => {
  it("returns false for completed tasks regardless of date", () => {
    expect(isOverdue("2000-01-01", "completed")).toBe(false);
  });

  it("returns true for a past due date on a pending task", () => {
    expect(isOverdue("2000-01-01", "pending")).toBe(true);
  });
});
