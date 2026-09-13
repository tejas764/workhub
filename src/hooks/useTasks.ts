import { useEffect, useState } from "react";
import {
  createTask,
  getTasks,
  type TaskMutation,
  updateTask,
} from "@/services/task.service";
import { taskItemFromRow } from "@/lib/supabase-records";
import type { TaskItem } from "@/types";

export function useTasks(enabled = true) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(enabled);

  async function loadTasks() {
    if (!enabled) return;
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks((data ?? []).map((row, index) => taskItemFromRow(row, index)));
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function changeTaskStatus(
    taskId: string,
    status: TaskMutation["status"]
  ) {
    await updateTask(taskId, { status });
    await loadTasks();
  }

  async function addTask(input: TaskMutation) {
    await createTask(input);
    await loadTasks();
  }

  async function editTask(taskId: string, input: TaskMutation) {
    await updateTask(taskId, input);
    await loadTasks();
  }

  useEffect(() => {
    void loadTasks();
  }, [enabled]);

  return {
    tasks,
    loading,
    refresh: loadTasks,
    addTask,
    editTask,
    changeTaskStatus,
  };
}
