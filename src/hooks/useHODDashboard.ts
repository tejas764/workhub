import { useCallback, useEffect, useState } from "react";
import { getHODDashboardData, type HODDashboardData } from "@/services/dashboard.service";

export function useHODDashboard(enabled = true) {
  const [data, setData] = useState<HODDashboardData | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const nextData = await getHODDashboardData();
      setData(nextData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load dashboard data.";
      console.error("HOD dashboard fetch error:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
