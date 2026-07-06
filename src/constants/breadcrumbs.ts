import type { AppPage } from "@/types";

export const BREADCRUMBS: Record<AppPage, string[]> = {
  dashboard: ["Home","Dashboard"], faculty: ["Home","Faculty"],
  announcements: ["Home","Announcements"], meetings: ["Home","Meetings"],
  documents: ["Home","Documents"], tasks: ["Home","Tasks"],
  "ai-knowledge": ["Home","AI Knowledge"], reports: ["Home","Reports"],
  department: ["Home","Department"], notifications: ["Home","Notifications"],
  profile: ["Home","Profile"], settings: ["Home","Settings"],
  help: ["Home","Help & Support"], e404: ["Home","404"],
  e403: ["Home","403"], e500: ["Home","500"],
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const FACULTY_DATA: FacultyMember[] = [
  { id:1,  name:"Dr. Anita Sharma",   email:"anita.sharma@college.edu",   phone:"+91 98765 43210", designation:"Professor",          department:"Computer Science", role:"HOD",         status:"Active",   joined:"2015-08-01" },
  { id:2,  name:"Prof. Rajan Mehta",  email:"rajan.mehta@college.edu",    phone:"+91 87654 32109", designation:"Associate Professor", department:"Computer Science", role:"Coordinator", status:"Active",   joined:"2017-07-15" },
  { id:3,  name:"Dr. Priya Nair",     email:"priya.nair@college.edu",     phone:"+91 76543 21098", designation:"Assistant Professor", department:"Computer Science", role:"Faculty",     status:"Active",   joined:"2019-01-10" },
  { id:4,  name:"Mr. Vikram Singh",   email:"vikram.singh@college.edu",   phone:"+91 65432 10987", designation:"Assistant Professor", department:"Computer Science", role:"Faculty",     status:"On Leave", joined:"2020-06-01" },
  { id:5,  name:"Dr. Sunita Patel",   email:"sunita.patel@college.edu",   phone:"+91 54321 09876", designation:"Associate Professor", department:"Electronics",      role:"HOD",         status:"Active",   joined:"2013-09-15" },
  { id:6,  name:"Prof. Kiran Desai",  email:"kiran.desai@college.edu",    phone:"+91 43210 98765", designation:"Professor",          department:"Mathematics",      role:"Faculty",     status:"Active",   joined:"2010-03-20" },
  { id:7,  name:"Dr. Amit Verma",     email:"amit.verma@college.edu",     phone:"+91 32109 87654", designation:"Assistant Professor", department:"Physics",          role:"Faculty",     status:"Active",   joined:"2021-08-01" },
  { id:8,  name:"Ms. Deepa Krishnan", email:"deepa.krishnan@college.edu", phone:"+91 21098 76543", designation:"Lecturer",           department:"Computer Science", role:"Faculty",     status:"Active",   joined:"2022-07-18" },
  { id:9,  name:"Dr. Rohit Joshi",    email:"rohit.joshi@college.edu",    phone:"+91 10987 65432", designation:"Associate Professor", department:"Mechanical",       role:"Coordinator", status:"Inactive", joined:"2016-01-05" },
  { id:10, name:"Prof. Meera Iyer",   email:"meera.iyer@college.edu",     phone:"+91 09876 54321", designation:"Professor",          department:"Civil",            role:"HOD",         status:"Active",   joined:"2008-06-12" },
];

const ANNOUNCEMENTS_DATA: Announcement[] = [
  { id:1, title:"Annual Academic Review Meeting — All HODs to Attend",  category:"Academic",   department:"All Departments",  postedBy:"Dr. Anita Sharma",  date:"2026-06-28", pinned:true,  hasAttachment:true,  summary:"Mandatory attendance for all HODs. Agenda includes curriculum review and faculty performance metrics for Q2." },
  { id:2, title:"Semester End Examination Schedule Published",           category:"Examination",department:"Computer Science", postedBy:"Prof. Rajan Mehta", date:"2026-06-25", pinned:false, hasAttachment:true,  summary:"End-semester exams scheduled July 15–30. Hall tickets available from July 10." },
  { id:3, title:"New Faculty Onboarding — Orientation Program Details",  category:"HR",         department:"All Departments",  postedBy:"Admin Office",      date:"2026-06-22", pinned:false, hasAttachment:false, summary:"New faculty orientation on July 5th at 10 AM. HR documentation deadline July 3rd." },
  { id:4, title:"Research Grant Application — Last Date July 15th",     category:"Research",   department:"All Departments",  postedBy:"Dr. Anita Sharma",  date:"2026-06-20", pinned:true,  hasAttachment:true,  summary:"SERB research grant applications open. Eligible faculty must submit proposals via the research portal." },
  { id:5, title:"Lab Equipment Calibration — CS Lab Closed July 1–3",   category:"Facilities", department:"Computer Science", postedBy:"Lab Coordinator",   date:"2026-06-18", pinned:false, hasAttachment:false, summary:"CS lab maintenance scheduled. Alternative lab arrangements made for ongoing projects." },
  { id:6, title:"Student Performance Review — Q2 Reports Due",          category:"Academic",   department:"Computer Science", postedBy:"Prof. Rajan Mehta", date:"2026-06-15", pinned:false, hasAttachment:false, summary:"Q2 student performance reports must be submitted by June 30. Format guidelines attached." },
];

const MEETINGS_DATA: Meeting[] = [
  { id:1, title:"Department Faculty Meeting — July Curriculum Planning", organizer:"Dr. Anita Sharma", date:"2026-07-03", time:"10:00 AM", participants:14, status:"Upcoming",  department:"Computer Science", location:"Conference Room A" },
  { id:2, title:"Research Committee Review — Q2 Progress",              organizer:"Prof. Meera Iyer",  date:"2026-07-05", time:"2:00 PM",  participants:8,  status:"Upcoming",  department:"All Departments",  location:"Board Room" },
  { id:3, title:"Student Grievance Redressal Meeting",                  organizer:"Prof. Rajan Mehta", date:"2026-07-07", time:"11:00 AM", participants:5,  status:"Upcoming",  department:"Computer Science", location:"HOD Office" },
  { id:4, title:"Annual Budget Review — FY 2026–27",                    organizer:"Dr. Anita Sharma",  date:"2026-06-20", time:"3:00 PM",  participants:12, status:"Completed", department:"All Departments",  location:"Conference Room B" },
  { id:5, title:"Accreditation Preparation Meeting — NAAC",             organizer:"Principal",          date:"2026-06-15", time:"9:00 AM",  participants:24, status:"Completed", department:"All Departments",  location:"Seminar Hall" },
  { id:6, title:"Placement Cell Coordination — Industry Connect",       organizer:"Prof. Kiran Desai",  date:"2026-06-10", time:"11:30 AM", participants:9,  status:"Completed", department:"Computer Science", location:"Placement Office" },
];

const DOCUMENTS_DATA: DocItem[] = [
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
