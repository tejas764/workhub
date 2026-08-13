import { useEffect, useState } from "react";
import {
  getAnnouncements,
  createAnnouncement,
} from "@/services/announcement.service";
import { announcementFromRow } from "@/lib/supabase-records";
import type { Announcement } from "@/types";

export function useAnnouncements(enabled = true) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(enabled);

  async function loadAnnouncements() {
    if (!enabled) return;
    setLoading(true);
    try {
      const data = await getAnnouncements();
      setAnnouncements((data ?? []).map((row, index) => announcementFromRow(row, index)));
    } catch (error) {
      console.error("Error loading announcements:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addAnnouncement(announcement: any) {
    await createAnnouncement(announcement);
    await loadAnnouncements();
  }

  useEffect(() => {
    void loadAnnouncements();
  }, [enabled]);

  return {
    announcements,
    loading,
    refresh: loadAnnouncements,
    addAnnouncement,
  };
}
