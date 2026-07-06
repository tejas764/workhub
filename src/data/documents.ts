import type { DocItem } from "@/types";

export const DOCUMENTS_DATA: DocItem[] = [
  { id:1, title:"Curriculum Framework 2026–27 — CS Department",   category:"Academic",       uploadedBy:"Dr. Anita Sharma",  date:"2026-06-25", type:"pdf",  size:"2.4 MB",  hasSummary:true  },
  { id:2, title:"Faculty Workload Distribution — Semester II",     category:"Administrative", uploadedBy:"Prof. Rajan Mehta", date:"2026-06-22", type:"xlsx", size:"840 KB",  hasSummary:true  },
  { id:3, title:"NAAC Accreditation Report — Self Study Document", category:"Accreditation",  uploadedBy:"Quality Cell",      date:"2026-06-20", type:"pdf",  size:"18.2 MB", hasSummary:true  },
  { id:4, title:"Student Attendance Summary — June 2026",          category:"Academic",       uploadedBy:"Dr. Priya Nair",    date:"2026-06-18", type:"xlsx", size:"1.1 MB",  hasSummary:false },
  { id:5, title:"Research Publication List — Faculty 2025–26",     category:"Research",       uploadedBy:"Dr. Rohit Joshi",   date:"2026-06-15", type:"doc",  size:"560 KB",  hasSummary:true  },
  { id:6, title:"Lab Safety Guidelines — Updated Version",         category:"Facilities",     uploadedBy:"Lab Coordinator",   date:"2026-06-12", type:"pdf",  size:"980 KB",  hasSummary:false },
  { id:7, title:"Department Budget Utilization — Q1 FY2027",       category:"Finance",        uploadedBy:"Prof. Rajan Mehta", date:"2026-06-10", type:"xlsx", size:"720 KB",  hasSummary:true  },
  { id:8, title:"Faculty Development Program Schedule",            category:"HR",             uploadedBy:"HR Office",         date:"2026-06-08", type:"ppt",  size:"4.8 MB",  hasSummary:false },
];

const TASKS_DATA: TaskItem[] = [
  { id:1, title:"Prepare Semester II Timetable Draft",        assignee:"Prof. Rajan Mehta",  priority:"High",   status:"In Progress", dueDate:"2026-07-05", department:"Computer Science", description:"Draft the complete timetable for semester II including lab sessions and tutorial slots." },
  { id:2, title:"Submit NAAC Criterion IV Documentation",     assignee:"Dr. Priya Nair",     priority:"High",   status:"Pending",     dueDate:"2026-07-10", department:"Computer Science", description:"Compile and submit all NAAC Criterion IV documentation." },
  { id:3, title:"Faculty Feedback Analysis — Semester I",     assignee:"Prof. Rajan Mehta",  priority:"Medium", status:"Completed",   dueDate:"2026-06-30", department:"Computer Science", description:"Analyze student feedback for semester I and prepare summary report." },
  { id:4, title:"Update Laboratory Inventory Records",        assignee:"Mr. Vikram Singh",   priority:"Low",    status:"Overdue",     dueDate:"2026-06-20", department:"Computer Science", description:"Update all CS lab equipment inventory as per the new format." },
  { id:5, title:"Research Grant Proposal Submission — SERB",  assignee:"Dr. Priya Nair",     priority:"High",   status:"In Progress", dueDate:"2026-07-15", department:"Computer Science", description:"Prepare and submit SERB research grant proposal for the AI in Education project." },
  { id:6, title:"Review and Approve Question Papers",         assignee:"Dr. Anita Sharma",   priority:"High",   status:"Pending",     dueDate:"2026-07-08", department:"Computer Science", description:"Review all end-semester question papers for technical accuracy." },
  { id:7, title:"Faculty Performance Appraisal Forms",        assignee:"Ms. Deepa Krishnan", priority:"Medium", status:"In Progress", dueDate:"2026-07-12", department:"Computer Science", description:"Collect self-appraisal forms from all faculty and compile for HOD review." },
  { id:8, title:"Update Department Website Content",          assignee:"Mr. Vikram Singh",   priority:"Low",    status:"Pending",     dueDate:"2026-07-20", department:"Computer Science", description:"Update faculty profiles, achievements, and course listings on the department website." },
];

const NOTIFICATIONS_DATA: NotifItem[] = [
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
