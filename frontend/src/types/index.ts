export interface Organization {
  id: string;
  name: string;
  logo?: string;
  gst_number?: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
}

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

export interface MaterialMaster {
  id: string;
  material_name: string;
  unit: string;
  minimum_stock_level: number;
  created_at: string;
}

export interface MaterialInventory {
  id: string;
  project_id: string;
  material_id: string;
  opening_stock: number;
  received_stock: number;
  consumed_stock: number;
  current_stock: number;
  created_at: string;
}

export type RequestStatus = 'Pending' | 'Approved' | 'Ordered' | 'Delivered' | 'Cancelled';

export interface MaterialRequest {
  id: string;
  project_id: string;
  requested_by?: string;
  material_id?: string;
  quantity_requested: number;
  status: RequestStatus;
  created_at: string;
}

export interface Supplier {
  id: string;
  company_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  gst_number?: string;
  created_at: string;
}

export type DeliveryStatus = 'Ordered' | 'In Transit' | 'Delivered';

export interface Delivery {
  id: string;
  supplier_id?: string;
  project_id: string;
  material_id?: string;
  quantity: number;
  delivery_date?: string;
  status: DeliveryStatus;
  created_at: string;
}

export type EquipmentStatus = 'Active' | 'Maintenance' | 'Broken';

export interface Equipment {
  id: string;
  project_id: string;
  equipment_name: string;
  equipment_type?: string;
  working_hours?: number;
  idle_hours?: number;
  status: EquipmentStatus;
  created_at: string;
}

export type ActivityStatus = 'Pending' | 'In Progress' | 'Completed';

export interface SiteActivity {
  id: string;
  project_id: string;
  daily_log_id?: string;
  activity_name: string;
  floor_number?: string;
  location?: string;
  quantity?: number;
  unit?: string;
  status: ActivityStatus;
  created_at: string;
}

export type IssueCategory = 'Safety' | 'Material' | 'Labour' | 'Equipment' | 'Weather';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueStatus = 'Open' | 'In Progress' | 'Resolved';

export interface SiteIssue {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  created_at: string;
}

export interface SitePhoto {
  id: string;
  project_id: string;
  daily_log_id?: string;
  image_url: string;
  caption?: string;
  location?: string;
  uploaded_by?: string;
  ai_tags?: any;
  ai_summary?: string;
  created_at: string;
}
