import { useEffect, useState } from "react";
import {
  getAnnouncements,
  createAnnouncement,
} from "@/services/announcement.service";

export function useAnnouncements() {
const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAnnouncements() {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data || []);
    } finally {
      setLoading(false);
    }
  }

  async function addAnnouncement(announcement: any) {
    await createAnnouncement(announcement);
    await loadAnnouncements();
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    refresh: loadAnnouncements,
    addAnnouncement,
  };
}