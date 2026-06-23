export type UserRole = 'Admin' | 'Project Manager' | 'Site Engineer' | 'Contractor' | 'Supplier';

export interface User {
  id: string;
  organization_id?: string;
  full_name: string;
  phone?: string;
  email: string;
  role: UserRole;
  profile_photo?: string;
  is_active: boolean;
  created_at: string;
}

export type ProjectType = 'Residential' | 'Commercial' | 'Industrial' | 'Interior';
export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Delayed' | 'Completed';

export interface Project {
  id: string;
  organization_id?: string;
  project_name: string;
  project_code: string;
  description?: string;
  project_type: ProjectType;
  client_name?: string;
  client_phone?: string;
  site_address?: string;
  budget?: number;
  estimated_cost?: number;
  start_date?: string;
  expected_completion_date?: string;
  actual_completion_date?: string;
  status: ProjectStatus;
  created_at: string;
}

export interface DailyLog {
  id: string;
  project_id: string;
  log_date: string;
  progress_update?: string;
  photo_link?: string;
  created_at: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Overtime';

export interface Attendance {
  id: string;
  project_id: string;
  worker_id: string;
  attendance_date: string;
  check_in?: string;
  check_out?: string;
  total_hours?: number;
  status: AttendanceStatus;
  created_at: string;
}

export interface Worker {
  id: string;
  organization_id?: string;
  worker_name: string;
  phone?: string;
  trade: string;
  daily_wage?: number;
  contractor_name?: string;
  joining_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface MaterialLog {
  id: string;
  project_id: string;
  materials_used: string;
  log_date: string;
  created_at: string;
}
