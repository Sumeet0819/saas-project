# Civil Project Backend Server Details

This directory contains the backend server for the Civil Project application.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database / Backend-as-a-Service**: Supabase (`@supabase/supabase-js`)
- **Other utilities**: `cors` for Cross-Origin Resource Sharing, `dotenv` for environment variable management.

## Project Structure

- `src/index.ts`: The main entry point of the server. It initializes the Express application, sets up middleware (CORS, JSON parsing), and registers all the API routes.
- `src/controllers/`: Contains the logic for handling requests to various endpoints.
- `src/routes/`: Express routers that define the paths and map them to their respective controllers.
- `src/middlewares/`: Contains custom middleware (e.g., `auth.ts` for handling authentication using Supabase).
- `src/types/`: TypeScript interface and type definitions.

## Authentication & Authorization

The server uses Supabase for authentication and includes a custom Role-Based Access Control (RBAC) system.
- **Roles**: `Admin`, `Project Manager`, `Site Engineer`, `Contractor`, `Supplier`.
- **Middleware**: `requireAuth` validates the Supabase session, while `authorizeRoles` ensures the user has one of the allowed roles for a specific route.
- User creation is restricted; only users with the `Admin` or `Project Manager` roles can create new users via the `/api/v1/auth/register` endpoint.


## Scripts

The `package.json` provides the following commands:
- `npm run dev`: Starts the server in development mode using `nodemon` and `ts-node`. Automatically restarts on file changes.
- `npm run build`: Compiles the TypeScript code into JavaScript in the `dist/` directory.
- `npm run start`: Starts the compiled application from `dist/index.js` (suitable for production).

## Server Configuration

The server runs on the port specified by the `PORT` environment variable. If not provided, it defaults to `5000`.

## Environment Variables

The server relies on environment variables (usually loaded via a `.env` file). Based on typical Supabase integrations, you likely need:
- `PORT`: Optional port override (default: 5000).
- `SUPABASE_URL`: The URL for your Supabase project.
- `SUPABASE_KEY` / `SUPABASE_SERVICE_ROLE_KEY`: The API keys to connect to your Supabase instance.
