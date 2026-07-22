import { useEffect, useState } from "react";
import {
  getTasks,
  updateTask,
} from "@/services/task.service";

export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    try {
      const data = await getTasks();
      setTasks(data ?? []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function changeTaskStatus(
    taskId: string,
    status: string
  ) {
    await updateTask(taskId, status);
    await loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    refresh: loadTasks,
    changeTaskStatus,
  };
}