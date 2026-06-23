# API Testing Guide

This document outlines the API endpoints exposed by the server and provides examples of how to test them.

## Base URL

By default, the server runs locally at: `http://localhost:5000`
All API routes are prefixed with `/api/v1`.

## Authentication

Most routes are protected and require a valid Bearer token from Supabase.
To authenticate your requests, include the token in the `Authorization` header:

```http
Authorization: Bearer <YOUR_SUPABASE_TOKEN>
```

## Endpoints

### 0. Authentication
Manages user registration and login.
- **Base Route**: `/api/v1/auth`
- **Routes**:
  - `POST /register` - Register a new user (Admin or Project Manager only).
  - `POST /login` - Login to receive a session token.

**Dummy JSON Payload (POST /register)**:
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "full_name": "Jane Smith",
  "phone": "+1234567890",
  "role": "Site Engineer"
}
```

**Dummy JSON Payload (POST /login)**:
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123"
}
```

### 1. Health Check
- **Endpoint**: `GET /api/v1/health`
- **Auth Required**: No
- **Description**: Verifies if the server is running.
- **Example**:
  ```bash
  curl http://localhost:5000/api/v1/health
  ```

### 2. Projects
Manages the construction projects.
- **Base Route**: `/api/v1/projects`
- **Auth Required**: Yes
- **Routes**:
  - `GET /` - Get all projects
  - `POST /` - Create a new project
  - `GET /:id` - Get project by ID
  - `PATCH /:id` - Update a project
  - `DELETE /:id` - Delete a project

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "project_name": "Skyline Residential Tower",
  "project_code": "PRJ-2024-001",
  "description": "Construction of a 15-story residential tower.",
  "project_type": "Residential",
  "client_name": "Acme Corp",
  "client_phone": "+1234567890",
  "site_address": "123 Main St, Springfield",
  "budget": 5000000,
  "estimated_cost": 4800000,
  "start_date": "2024-01-15T00:00:00Z",
  "expected_completion_date": "2025-12-30T00:00:00Z",
  "status": "Planning"
}
```

### 3. Daily Logs
Manages the daily activity logs for projects.
- **Base Route**: `/api/v1/daily-logs`
- **Auth Required**: Yes
- **Routes**:
  - `GET /` - Get all daily logs
  - `POST /` - Create a daily log
  - `GET /:id` - Get a daily log by ID
  - `PATCH /:id` - Update a daily log
  - `DELETE /:id` - Delete a daily log

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "project_id": "123e4567-e89b-12d3-a456-426614174000",
  "log_date": "2024-06-21T00:00:00Z",
  "progress_update": "Completed the foundation laying for block A.",
  "photo_link": "https://example.com/photos/log123.jpg"
}
```

### 4. Workers
Manages the workforce data.
- **Base Route**: `/api/v1/workers`
- **Auth Required**: Yes
- **Routes**:
  - `GET /` - Get all workers
  - `POST /` - Add a worker
  - `GET /:id` - Get worker by ID
  - `PATCH /:id` - Update worker details
  - `DELETE /:id` - Remove a worker

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "worker_name": "John Doe",
  "phone": "+1987654321",
  "trade": "Mason",
  "daily_wage": 150.00,
  "contractor_name": "BuildRight Contractors",
  "joining_date": "2024-02-01T00:00:00Z",
  "is_active": true
}
```

### 5. Material Logs
Manages material usage and inventory on sites.
- **Base Route**: `/api/v1/material-logs`
- **Auth Required**: Yes
- **Routes**:
  - `GET /` - Get all material logs
  - `POST /` - Create a material log
  - `GET /:id` - Get a material log by ID
  - `PATCH /:id` - Update a material log
  - `DELETE /:id` - Delete a material log

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "project_id": "123e4567-e89b-12d3-a456-426614174000",
  "materials_used": "100 bags of cement, 50 tons of steel",
  "log_date": "2024-06-21T00:00:00Z"
}
```

### 6. Notifications
Triggers notifications for specific events.
- **Base Route**: `/api/v1/notifications`
- **Auth Required**: Yes
- **Routes**:
  - `POST /` - Trigger a notification
  - **Body Example**:
    ```json
    {
      "message": "New materials arrived",
      "type": "material_update",
      "projectId": "12345"
    }
    ```
### 7. Attendance
Manages worker attendance records.
- **Base Route**: `/api/v1/attendance`
- **Auth Required**: Yes
- **Routes**: `GET /`, `POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "project_id": "123e4567-e89b-12d3-a456-426614174000",
  "worker_id": "987e6543-e21b-12d3-a456-426614174000",
  "attendance_date": "2024-06-25",
  "check_in": "08:00:00",
  "check_out": "17:00:00",
  "total_hours": 9,
  "status": "Present"
}
```

### 8. Deliveries
Manages material deliveries from suppliers.
- **Base Route**: `/api/v1/deliveries`
- **Auth Required**: Yes
- **Routes**: `GET /`, `POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "supplier_id": "111e2222-e89b-12d3-a456-426614174000",
  "project_id": "123e4567-e89b-12d3-a456-426614174000",
  "material_id": "333e4444-e89b-12d3-a456-426614174000",
  "quantity": 500,
  "delivery_date": "2024-06-25",
  "status": "In Transit"
}
```

### 9. Equipment
Manages project equipment and machinery.
- **Base Route**: `/api/v1/equipment`
- **Auth Required**: Yes
- **Routes**: `GET /`, `POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "project_id": "123e4567-e89b-12d3-a456-426614174000",
  "equipment_name": "Caterpillar Excavator",
  "equipment_type": "Heavy Machinery",
  "working_hours": 120,
  "idle_hours": 15,
  "status": "Active"
}
```

### 10. Material Master
Manages the global list of materials.
- **Base Route**: `/api/v1/material-master`
- **Auth Required**: Yes
- **Routes**: `GET /`, `POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "material_name": "Portland Cement",
  "unit": "Bags",
  "minimum_stock_level": 100
}
```

### 11. Material Inventory
Manages material stock levels per project.
- **Base Route**: `/api/v1/material-inventory`
- **Auth Required**: Yes
- **Routes**: `GET /`, `POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "project_id": "123e4567-e89b-12d3-a456-426614174000",
  "material_id": "333e4444-e89b-12d3-a456-426614174000",
  "opening_stock": 200,
  "received_stock": 500,
  "consumed_stock": 150,
  "current_stock": 550
}
```

### 12. Material Requests
Manages requests for new materials.
- **Base Route**: `/api/v1/material-requests`
- **Auth Required**: Yes
- **Routes**: `GET /`, `POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "project_id": "123e4567-e89b-12d3-a456-426614174000",
  "requested_by": "555e6666-e89b-12d3-a456-426614174000",
  "material_id": "333e4444-e89b-12d3-a456-426614174000",
  "quantity_requested": 1000,
  "status": "Pending"
}
```

### 13. Site Activities
Manages daily activities and tasks on site.
- **Base Route**: `/api/v1/site-activities`
- **Auth Required**: Yes
- **Routes**: `GET /`, `POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "project_id": "123e4567-e89b-12d3-a456-426614174000",
  "daily_log_id": "777e8888-e89b-12d3-a456-426614174000",
  "activity_name": "Pouring Concrete for Foundation",
  "floor_number": "Basement",
  "location": "North Wing",
  "quantity": 50,
  "unit": "Cubic Meters",
  "status": "In Progress"
}
```

### 14. Site Issues
Manages problems or safety concerns on site.
- **Base Route**: `/api/v1/site-issues`
- **Auth Required**: Yes
- **Routes**: `GET /`, `POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "project_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Crane Malfunction",
  "description": "The main tower crane is experiencing hydraulic leaks.",
  "category": "Equipment",
  "priority": "Critical",
  "status": "Open"
}
```

### 15. Site Photos
Manages photographic evidence and logs.
- **Base Route**: `/api/v1/site-photos`
- **Auth Required**: Yes
- **Routes**: `GET /`, `POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "project_id": "123e4567-e89b-12d3-a456-426614174000",
  "daily_log_id": "777e8888-e89b-12d3-a456-426614174000",
  "image_url": "https://example.com/images/crane_issue.jpg",
  "caption": "Hydraulic fluid leaking from the main tower crane.",
  "location": "Central Tower Area",
  "uploaded_by": "555e6666-e89b-12d3-a456-426614174000"
}
```

### 16. Suppliers
Manages vendors and material suppliers.
- **Base Route**: `/api/v1/suppliers`
- **Auth Required**: Yes
- **Routes**: `GET /`, `POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`

**Dummy JSON Payload (POST / PATCH)**:
```json
{
  "company_name": "BuildPro Materials Ltd",
  "contact_person": "Michael Scott",
  "phone": "+1987654321",
  "email": "sales@buildpro.com",
  "gst_number": "22AAAAA0000A1Z5"
}
```
## Testing with Postman or Insomnia

1. Create a new Request.
2. Set the method (GET, POST, PATCH, DELETE).
3. Set the URL (e.g., `http://localhost:5000/api/v1/projects`).
4. Go to the **Headers** or **Auth** tab and add the Bearer Token.
5. If it's a `POST` or `PATCH` request, go to the **Body** tab, select **JSON**, and add the required payload.
6. Click **Send** to see the response.
