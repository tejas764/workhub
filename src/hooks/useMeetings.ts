import { useEffect, useState } from "react";
import {
  getMeetings,
  createMeeting,
} from "@/services/meeting.service";
import { meetingFromRow } from "@/lib/supabase-records";
import type { Meeting } from "@/types";

export function useMeetings(enabled = true) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(enabled);

  async function loadMeetings() {
    if (!enabled) return;
    setLoading(true);
    try {
      const data = await getMeetings();
      setMeetings((data ?? []).map((row, index) => meetingFromRow(row, index)));
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
    void loadMeetings();
  }, [enabled]);

  return {
    meetings,
    loading,
    refresh: loadMeetings,
    addMeeting,
  };
}
