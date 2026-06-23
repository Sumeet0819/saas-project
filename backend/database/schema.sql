-- Organization
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  gst_number VARCHAR(50),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TYPE user_role AS ENUM ('Admin', 'Project Manager', 'Site Engineer', 'Contractor', 'Supplier');

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  organization_id UUID REFERENCES organizations(id),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role NOT NULL,
  profile_photo TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TYPE project_type AS ENUM ('Residential', 'Commercial', 'Industrial', 'Interior');
CREATE TYPE project_status AS ENUM ('Planning', 'Active', 'On Hold', 'Delayed', 'Completed');

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  project_name VARCHAR(255) NOT NULL,
  project_code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  project_type project_type NOT NULL,
  client_name VARCHAR(255),
  client_phone VARCHAR(20),
  site_address TEXT,
  budget NUMERIC,
  estimated_cost NUMERIC,
  start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  status project_status DEFAULT 'Planning',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Members
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  designation VARCHAR(100),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Daily Logs
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  progress_update TEXT,
  photo_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Activities
CREATE TYPE activity_status AS ENUM ('Pending', 'In Progress', 'Completed');

CREATE TABLE site_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
  activity_name VARCHAR(255) NOT NULL,
  floor_number VARCHAR(50),
  location VARCHAR(255),
  quantity NUMERIC,
  unit VARCHAR(50),
  status activity_status DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Worker Registry
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  worker_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  trade VARCHAR(100) NOT NULL, -- Mason, Carpenter, etc.
  daily_wage NUMERIC,
  contractor_name VARCHAR(255),
  joining_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance
CREATE TYPE attendance_status AS ENUM ('Present', 'Absent', 'Half Day', 'Overtime');

CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  total_hours NUMERIC,
  status attendance_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Material Master
CREATE TABLE material_master (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_name VARCHAR(255) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  minimum_stock_level NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Material Inventory
CREATE TABLE material_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  material_id UUID REFERENCES material_master(id),
  opening_stock NUMERIC DEFAULT 0,
  received_stock NUMERIC DEFAULT 0,
  consumed_stock NUMERIC DEFAULT 0,
  current_stock NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, material_id)
);

-- Material Logs
CREATE TABLE material_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  materials_used TEXT NOT NULL,
  log_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Material Requests
CREATE TYPE request_status AS ENUM ('Pending', 'Approved', 'Ordered', 'Delivered', 'Cancelled');

CREATE TABLE material_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES users(id),
  material_id UUID REFERENCES material_master(id),
  quantity_requested NUMERIC NOT NULL,
  status request_status DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  gst_number VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deliveries
CREATE TYPE delivery_status AS ENUM ('Ordered', 'In Transit', 'Delivered');

CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  material_id UUID REFERENCES material_master(id),
  quantity NUMERIC NOT NULL,
  delivery_date DATE,
  status delivery_status DEFAULT 'Ordered',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment
CREATE TYPE equipment_status AS ENUM ('Active', 'Maintenance', 'Broken');

CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  equipment_name VARCHAR(255) NOT NULL,
  equipment_type VARCHAR(100),
  working_hours NUMERIC DEFAULT 0,
  idle_hours NUMERIC DEFAULT 0,
  status equipment_status DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Issues
CREATE TYPE issue_category AS ENUM ('Safety', 'Material', 'Labour', 'Equipment', 'Weather');
CREATE TYPE issue_priority AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE issue_status AS ENUM ('Open', 'In Progress', 'Resolved');

CREATE TABLE site_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category issue_category NOT NULL,
  priority issue_priority NOT NULL,
  status issue_status DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Photos
CREATE TABLE site_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  daily_log_id UUID REFERENCES daily_logs(id),
  image_url TEXT NOT NULL,
  caption TEXT,
  location VARCHAR(255),
  uploaded_by UUID REFERENCES users(id),
  ai_tags JSONB,
  ai_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TYPE notification_type AS ENUM ('Material Request', 'Daily Report', 'Issue', 'Delivery');

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
