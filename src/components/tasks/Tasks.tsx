import React, { useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle,
  CheckSquare,
  List,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Send,
  ChevronDown,
} from "lucide-react";
import type { FacultyMember, Role, TaskItem } from "@/types";
import type { TaskMutation } from "@/services/task.service";
import { C } from "@/constants";
import { cn, hov, unhov } from "@/lib/ui-utils";
import {
  Avatar,
  Btn,
  Card,
  Drawer,
  EmptyState,
  FilterBar,
  Input,
  Modal,
  PriorityBadge,
  Select,
  StatusBadge,
  Tabs,
} from "@/components/ui";

type TaskStatus = TaskMutation["status"];

type TaskFormState = {
  title: string;
  assignedTo: string;
  dueDate: string;
  status: TaskStatus;
};

const INITIAL_FORM: TaskFormState = {
  title: "",
  assignedTo: "",
  dueDate: "",
  status: "Pending",
};

const validStatuses: TaskStatus[] = ["Pending", "In Progress", "Completed"];

const toDateInput = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const dueDatePayload = (value: string) =>
  value ? new Date(`${value}T23:59:00`).toISOString() : null;

export function TasksPage({
  role,
  tasks = [],
  facultyMembers = [],
  currentFaculty,
  loading = false,
  onCreateTask,
  onUpdateTask,
}: {
  role: Role;
  tasks?: TaskItem[];
  facultyMembers?: FacultyMember[];
  currentFaculty?: FacultyMember;
  loading?: boolean;
  onCreateTask?: (input: TaskMutation) => Promise<void>;
  onUpdateTask?: (taskId: string, input: TaskMutation) => Promise<void>;
}) {
  const [tab, setTab] = useState("My Tasks");
  const [selected, setSelected] = useState<TaskItem | null>(null);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TaskFormState>(INITIAL_FORM);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [assigneeFilter, setAssigneeFilter] = useState("All Assignees");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeStatusDropdown, setActiveStatusDropdown] = useState<string | number | null>(null);

  const canCreate = role !== "faculty";
  const tabs = role === "faculty" ? ["My Tasks"] : ["My Tasks", "Department Tasks"];
  const currentFacultyId = currentFaculty?.id ? String(currentFaculty.id) : "";

  const visibleTasks = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const isMine = currentFacultyId && String(task.assigneeId) === currentFacultyId;
      const tabMatches = role === "faculty" || tab === "Department Tasks" || isMine;
      const searchMatches = !q || [task.title, task.assignee, task.department, task.description]
        .some((value) => value.toLowerCase().includes(q));
      const statusMatches = statusFilter === "All Status" || task.status === statusFilter;
      const assigneeMatches = assigneeFilter === "All Assignees" || task.assignee === assigneeFilter;

      return tabMatches && searchMatches && statusMatches && assigneeMatches;
    });
  }, [assigneeFilter, currentFacultyId, role, search, statusFilter, tab, tasks]);

  const openCreate = () => {
    const defaultAssignee = currentFacultyId || String(facultyMembers[0]?.id ?? "");
    setEditingTask(null);
    setForm({
      ...INITIAL_FORM,
      assignedTo: defaultAssignee,
    });
    setError("");
    setShowForm(true);
  };

  const openEdit = (task: TaskItem) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      assignedTo: task.assigneeId ?? "",
      dueDate: toDateInput(task.dueDateValue),
      status: validStatuses.includes(task.status as TaskStatus) ? task.status as TaskStatus : "Pending",
    });
    setError("");
    setShowForm(true);
  };

  const selectedFaculty = facultyMembers.find((faculty) => String(faculty.id) === form.assignedTo);
  const selectedDepartmentId = selectedFaculty?.departmentId || currentFaculty?.departmentId || editingTask?.departmentId || "";

  const submitTask = async () => {
    if (!form.title.trim()) {
      setError("Enter a task title.");
      return;
    }
    if (!form.assignedTo) {
      setError("Choose an assignee.");
      return;
    }
    if (!selectedDepartmentId) {
      setError("The selected assignee does not have a department ID.");
      return;
    }

    const payload: TaskMutation = {
      title: form.title.trim(),
      assignedTo: form.assignedTo,
      dueDate: dueDatePayload(form.dueDate),
      status: form.status,
      departmentId: selectedDepartmentId,
    };

    setSaving(true);
    setError("");

    try {
      if (editingTask) {
        await onUpdateTask?.(String(editingTask.id), payload);
      } else {
        await onCreateTask?.(payload);
      }

      setShowForm(false);
      setEditingTask(null);
      setSelected(null);
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save task.");
    } finally {
      setSaving(false);
    }
  };

  const handleInlineStatusUpdate = async (task: TaskItem, newStatus: TaskStatus) => {
    if (!task.assigneeId || !task.departmentId) return;
    try {
      await onUpdateTask?.(String(task.id), {
        title: task.title,
        assignedTo: task.assigneeId,
        dueDate: task.dueDateValue ?? null,
        status: newStatus,
        departmentId: task.departmentId,
      });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const updateSelectedStatus = async (status: TaskStatus) => {
    if (!selected || !selected.assigneeId || !selected.departmentId) return;
    await handleInlineStatusUpdate(selected, status);
    setSelected(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{color:C.blue600}}>Tasks</h1>
          <p className="text-sm mt-0.5" style={{color:C.textSecondary}}>Manage and track department tasks</p>
        </div>
        {canCreate && <Btn variant="primary" size="sm" icon={Plus} onClick={openCreate}>Create Task</Btn>}
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          {label:"Total", val:visibleTasks.length, bg:C.bg, color:C.textPrimary},
          {label:"In Progress", val:visibleTasks.filter(t=>t.status==="In Progress").length, bg:C.blue50, color:C.blue500},
          {label:"Pending", val:visibleTasks.filter(t=>t.status==="Pending").length, bg:C.gray50, color:C.gray400},
          {label:"Completed", val:visibleTasks.filter(t=>t.status==="Completed").length, bg:C.olive50, color:C.olive300},
        ].map(({label,val,bg,color})=>(
          <Card key={label} className="p-4 text-center" style={{background:bg}}>
            <p className="text-2xl font-black" style={{color}}>{val}</p>
            <p className="text-xs font-semibold mt-0.5" style={{color}}>{label}</p>
          </Card>
        ))}
      </div>

      <FilterBar>
        <Input placeholder="Search tasks..." icon={Search} className="flex-1 min-w-40" value={search} onChange={setSearch} />
        <Select options={["All Status", ...validStatuses]} value={statusFilter} onChange={setStatusFilter} />
        {role !== "faculty" && <Select options={["All Assignees", ...facultyMembers.map(f=>f.name)]} value={assigneeFilter} onChange={setAssigneeFilter} />}
      </FilterBar>

      {tabs.length > 1 && <Tabs tabs={tabs} active={tab} onChange={setTab} />}

      <div className="space-y-2">
        {visibleTasks.map(t=>(
          <Card key={t.id} className="p-4" onClick={()=>setSelected(t)}>
            <div className="flex items-start gap-4">
              <div 
                className="mt-0.5 flex-shrink-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextStatus = t.status === "Completed" ? "Pending" : "Completed";
                  handleInlineStatusUpdate(t, nextStatus);
                }}
              >
                <div className="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors"
                  style={t.status==="Completed"?{background:C.olive300,borderColor:C.olive300}:{borderColor:C.border}}>
                  {t.status==="Completed"&&<CheckCircle size={10} className="text-white" />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className={cn("text-sm font-bold",t.status==="Completed"&&"line-through opacity-40")} style={{color:C.textPrimary}}>{t.title}</p>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <PriorityBadge priority={t.priority} />
                    
                    {/* Direct Status Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveStatusDropdown(activeStatusDropdown === t.id ? null : t.id);
                        }}
                        className="flex items-center gap-1 focus:outline-none"
                      >
                        <StatusBadge status={t.status} />
                        <ChevronDown size={12} style={{ color: C.textMuted }} />
                      </button>

                      {activeStatusDropdown === t.id && (
                        <div 
                          className="absolute right-0 mt-1 z-30 w-32 bg-white rounded-lg shadow-lg border p-1 text-xs"
                          style={{ borderColor: C.border }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {validStatuses.map((st) => (
                            <button
                              key={st}
                              className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 flex items-center justify-between font-medium"
                              style={{ color: t.status === st ? C.blue600 : C.textPrimary }}
                              onClick={() => {
                                handleInlineStatusUpdate(t, st);
                                setActiveStatusDropdown(null);
                              }}
                            >
                              <span>{st}</span>
                              {t.status === st && <span className="text-[10px]">✓</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-xs mb-2 line-clamp-1" style={{color:C.textMuted}}>{t.department}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><Avatar name={t.assignee} size="sm" /><span className="text-xs font-semibold" style={{color:C.textSecondary}}>{t.assignee}</span></div>
                  <span className="text-xs flex items-center gap-1" style={{color:C.textMuted}}><Calendar size={11} style={{color:C.blue200}} />Due {t.dueDate}</span>
                </div>
              </div>

              <div className="flex gap-1 flex-shrink-0">
                {canCreate && <button className="p-1.5 rounded-lg" onClick={e=>{e.stopPropagation(); openEdit(t);}}
                  onMouseEnter={e=>hov(e.currentTarget,C.blue50)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                  <Pencil size={13} style={{color:C.blue200}} />
                </button>}
                <button className="p-1.5 rounded-lg" onClick={e=>e.stopPropagation()}
                  onMouseEnter={e=>hov(e.currentTarget,C.bg)} onMouseLeave={e=>unhov(e.currentTarget,"transparent")}>
                  <MoreHorizontal size={13} style={{color:C.textMuted}} />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {loading && <EmptyState icon={CheckSquare} title="Loading tasks" description="Fetching tasks from Supabase." />}
        {!loading && visibleTasks.length===0 && (
          <EmptyState icon={CheckSquare} title="No tasks found" description="Tasks from Supabase will appear here once records are available to this user." />
        )}
      </div>

      {showForm && (
        <Modal
          title={editingTask ? "Edit Task" : "Create Task"}
          onClose={()=>!saving && setShowForm(false)}
          footer={
            <>
              <Btn variant="outline" onClick={()=>setShowForm(false)} disabled={saving}>Cancel</Btn>
              <Btn variant="primary" onClick={submitTask} disabled={saving}>{saving ? "Saving..." : editingTask ? "Save Changes" : "Create Task"}</Btn>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{color:C.textPrimary}}>Title</label>
              <Input value={form.title} onChange={(title)=>setForm(p=>({...p,title}))} placeholder="Enter task title" />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{color:C.textPrimary}}>Assignee</label>
              <Select
                className="w-full"
                value={form.assignedTo}
                onChange={(assignedTo)=>setForm(p=>({...p,assignedTo}))}
                options={facultyMembers.length ? facultyMembers.map(f=>String(f.id)) : [""]}
              />
              <p className="text-[11px] mt-1.5" style={{color:C.textMuted}}>
                {selectedFaculty ? `${selectedFaculty.name} - ${selectedFaculty.department}` : "Select a faculty member"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{color:C.textPrimary}}>Due Date</label>
                <Input type="date" value={form.dueDate} onChange={(dueDate)=>setForm(p=>({...p,dueDate}))} />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{color:C.textPrimary}}>Status</label>
                <Select className="w-full" value={form.status} onChange={(status)=>setForm(p=>({...p,status:status as TaskStatus}))} options={validStatuses} />
              </div>
            </div>
            {error && <p className="text-xs font-semibold" style={{color:C.red300}}>{error}</p>}
          </div>
        </Modal>
      )}

      {selected && (
        <Drawer title="Task Details" onClose={()=>setSelected(null)} width="w-[560px]">
          <div className="space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-black" style={{color:C.blue600}}>{selected.title}</h3>
                <div className="flex gap-2 flex-shrink-0"><PriorityBadge priority={selected.priority} /><StatusBadge status={selected.status} /></div>
              </div>
              <p className="text-sm leading-relaxed" style={{color:C.textSecondary}}>Assigned task from Supabase.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[{label:"Assignee",val:selected.assignee},{label:"Department",val:selected.department},{label:"Due Date",val:selected.dueDate},{label:"Status",val:selected.status}].map(({label,val})=>(
                <div key={label} className="rounded-2xl p-3" style={{background:C.bg}}>
                  <p className="text-[10px] font-black uppercase tracking-wide mb-1" style={{color:C.textMuted}}>{label}</p>
                  <p className="text-sm font-bold" style={{color:C.textPrimary}}>{val}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Timeline</p>
              <EmptyState icon={List} title="No timeline yet" description="Task events will appear here once activity tracking is connected." />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wide mb-3" style={{color:C.textMuted}}>Comments</p>
              <div className="mb-3">
                <EmptyState icon={MessageSquare} title="No comments yet" description="Comments added to this task will appear here." />
              </div>
              <div className="flex gap-2">
                <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a comment..."
                  className="flex-1 text-xs border rounded-[10px] px-3 py-2 outline-none" style={{borderColor:C.border,background:C.bg}} />
                <button className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{background:C.blue200}}>
                  <Send size={12} className="text-white" />
                </button>
              </div>
            </div>

            {canCreate && (
              <div className="flex gap-3 pt-2 border-t" style={{borderColor:C.border}}>
                <Btn variant="primary" className="flex-1 justify-center" onClick={()=>openEdit(selected)}>Edit Task</Btn>
                {selected.status !== "Completed" && <Btn variant="outline" className="flex-1 justify-center" onClick={()=>void updateSelectedStatus("Completed")}>Mark Complete</Btn>}
              </div>
            )}
          </div>
        </Drawer>
      )}
    </div>
  );
}