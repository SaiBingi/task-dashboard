import { useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import { db } from "../firebase";
import type { Task } from "../types/task";
import { reorderTasks } from "../features/tasks/tasksSlice";

export function useFirestoreTasks(userId: string) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const tasksRef = collection(db, "users", userId, "tasks");
    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((doc) => doc.data() as Task);
      const sorted = tasks.sort((a, b) => a.order - b.order);
      dispatch(reorderTasks(sorted));
    });

    return unsubscribe;
  }, [userId, dispatch]);
}

export async function saveTaskToFirestore(userId: string, task: Task) {
  const taskRef = doc(db, "users", userId, "tasks", task.id);
  await setDoc(taskRef, task);
}

export async function deleteTaskFromFirestore(userId: string, taskId: string) {
  const taskRef = doc(db, "users", userId, "tasks", taskId);
  await deleteDoc(taskRef);
}

export async function saveAllTasksToFirestore(userId: string, tasks: Task[]) {
  const batch = writeBatch(db);
  tasks.forEach((task) => {
    const taskRef = doc(db, "users", userId, "tasks", task.id);
    batch.set(taskRef, task);
  });
  await batch.commit();
}
