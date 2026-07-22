import { useEffect, useState } from "react";
import {
  getMeetings,
  createMeeting,
} from "@/services/meeting.service";

export function useMeetings() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMeetings() {
    try {
      const data = await getMeetings();
      setMeetings(data ?? []);
    } catch (error) {
      console.error("Error loading meetings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addMeeting(meeting: any) {
    await createMeeting(meeting);
    await loadMeetings();
  }

  useEffect(() => {
    loadMeetings();
  }, []);

  return {
    meetings,
    loading,
    refresh: loadMeetings,
    addMeeting,
  };
}