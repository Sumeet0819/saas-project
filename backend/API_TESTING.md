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

## Testing with Postman or Insomnia

1. Create a new Request.
2. Set the method (GET, POST, PATCH, DELETE).
3. Set the URL (e.g., `http://localhost:5000/api/v1/projects`).
4. Go to the **Headers** or **Auth** tab and add the Bearer Token.
5. If it's a `POST` or `PATCH` request, go to the **Body** tab, select **JSON**, and add the required payload.
6. Click **Send** to see the response.
