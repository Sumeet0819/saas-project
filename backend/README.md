# Civil Project Backend

This is the Node.js / Express backend for the Civil Project application. It connects to Supabase for its PostgreSQL database and authentication.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- `npm`

### Installation
1. Clone the repository and navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Make sure you install any missing dependencies like lottie-web: `npm install lottie-web`.

### Environment Setup
Create a `.env` file in the `backend` root with the following variables:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Running the Server
To start the server in development mode (with hot-reloading via nodemon):
```bash
npm run dev
```
The server will start listening on `http://localhost:5000`.

## API Documentation

The backend exposes a wide range of endpoints to manage the construction site.

**Full API Documentation & Postman Testing Guide:**  
Please refer to the [API_TESTING.md](./API_TESTING.md) file for a comprehensive list of all endpoints, required headers, and dummy JSON payloads.

**Core Endpoints:**
All endpoints are prefixed with `/api/v1`.
- `/auth`: Registration and login.
- `/projects`: Manage construction projects.
- `/daily-logs`: Submit and view daily site reports.
- `/workers`: Manage worker details and trades.
- `/attendance`: Track worker check-ins and check-outs.
- `/material-master`: Global catalog of construction materials.
- `/material-inventory`: Site-specific stock tracking for materials.
- `/material-requests`: Manage and approve requests for new materials.
- `/material-logs`: Record actual material consumption on site.
- `/deliveries`: Track inbound material deliveries from suppliers.
- `/equipment`: Manage heavy machinery and their working hours.
- `/site-activities`: Track progress on specific site tasks.
- `/site-issues`: Report safety or operational issues.
- `/site-photos`: Upload photographic evidence of site progress.
- `/suppliers`: Manage vendor and supplier information.

## Project Structure & Architecture
Please refer to the [SERVER_DETAILS.md](./SERVER_DETAILS.md) file for a detailed breakdown of the internal folder structure, TypeScript definitions, and the Role-Based Access Control (RBAC) implementation.
