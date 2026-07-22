export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  status: string;
  department_id?: string;
  created_at?: string;
}