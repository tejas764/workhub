import type { NotifItem } from "@/types";

export const NOTIFICATIONS_DATA: NotifItem[] = [
  { id:1,  type:"task",         title:"Task Assigned: Review Question Papers",       body:"Dr. Anita Sharma assigned a high-priority task due July 8.",         time:"2 min ago",  read:false },
  { id:2,  type:"meeting",      title:"Meeting Reminder: Faculty Meeting Tomorrow",  body:"Dept. Faculty Meeting on July 3 at 10:00 AM in Conf. Room A.",       time:"1 hr ago",   read:false },
  { id:3,  type:"announcement", title:"New Announcement: Research Grant Deadline",  body:"SERB research grant application deadline is July 15th.",             time:"3 hr ago",   read:false },
  { id:4,  type:"document",     title:"Document Uploaded: Curriculum Framework",    body:"Dr. Anita Sharma uploaded a new document to the Academic category.", time:"5 hr ago",   read:true  },
  { id:5,  type:"ai",           title:"AI Insight: Workload Imbalance Detected",    body:"3 faculty members above 120% workload allocation.",                  time:"6 hr ago",   read:true  },
  { id:6,  type:"task",         title:"Task Overdue: Lab Inventory Update",         body:"Mr. Vikram Singh's task was due June 20 and remains incomplete.",    time:"1 day ago",  read:true  },
  { id:7,  type:"meeting",      title:"Meeting Minutes Available",                  body:"Minutes for Annual Budget Review (June 20) have been uploaded.",    time:"1 day ago",  read:true  },
  { id:8,  type:"announcement", title:"Announcement: CS Lab Closure",               body:"CS Lab will be closed July 1–3 for equipment calibration.",          time:"2 days ago", read:true  },
  { id:9,  type:"document",     title:"Document Approved: NAAC Report",             body:"NAAC Self Study Document has been reviewed and approved.",            time:"2 days ago", read:true  },
  { id:10, type:"ai",           title:"AI Summary Ready: June Announcements",       body:"AI has generated summaries for 6 new announcements this month.",     time:"3 days ago", read:true  },
];
