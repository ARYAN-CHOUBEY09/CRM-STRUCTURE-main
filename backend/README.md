# CRM Backend

Express + MongoDB backend for the CRM app.

## Setup

1. `cd backend`
2. `npm install`
3. Create `.env`
4. Set the required environment variables
5. Start the server with `npm start`

For local development you can also use:

- `npm run dev`
- `npm run nodemon`

## Required Env Vars

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
PORT=5000
JWT_EXPIRES_IN=7d
```

## Base URL

```text
http://localhost:5000/api
```

## First Admin Bootstrap

Create the first admin user with:

```powershell
$env:ADMIN_FULL_NAME="Admin User"; $env:ADMIN_USERNAME="admin"; $env:ADMIN_PASSWORD="ChangeMe123!"; npm run seed:admin
```

Notes:

- If the username already exists and is not an admin, the script promotes that user to `Admin`
- Login does not require prior auth
- User creation is admin-controlled

## Auth Flow

- `POST /auth/login` is public
- `POST /auth/register` is admin-only
- Users created by admin do not sign up again
- Created users log in directly with their assigned username and password

Auth header:

```text
Authorization: Bearer <token>
```

## Role-Based Access

The backend now uses module-based role permissions.

Roles:

- `Admin`
- `Manager`
- `Staff`

Permission values:

- `No Access`
- `View`
- `Edit`

Modules:

- `dashboard`
- `customers`
- `imports`
- `users`
- `permissions`

Behavior:

- `Admin` has full access to everything
- `Manager` and `Staff` are checked through the `permissions` collection
- If a permission document for `Manager` or `Staff` does not exist yet, it is auto-created with schema defaults
- `View` allows read requests
- `Edit` allows read + write requests

Default non-admin module permissions from the schema:

- `dashboard: View`
- `customers: Edit`
- `imports: View`
- `users: No Access`
- `permissions: No Access`

## API Endpoints

### Health

- `GET /health`

### Auth

- `POST /auth/login`
- `POST /auth/register` (`Admin` only)

### Users

- `GET /users`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

Access:

- controlled by `users` module permission
- non-admin users cannot create or promote another user to `Admin`

### Customers

- `GET /customers`
- `GET /customers/:id`
- `POST /customers`
- `PUT /customers/:id`
- `DELETE /customers/:id`

Access:

- controlled by `customers` module permission

### Permissions

- `GET /permissions/:role`
- `PUT /permissions/:role`

Access:

- `Admin` can read and update any role
- `Manager` / `Staff` can read only their own role document
- only `Admin` can update permissions

### Imports

- `GET /imports`
- `POST /imports`

Access:

- controlled by `imports` module permission

## Current Import Behavior

The backend stores import logs, not raw uploaded files.

Stored in import log:

- `fileName`
- `totalRows`
- `successRows`
- `failedRows`
- `status`
- `createdBy`

Current frontend behavior:

- CSV customer rows are imported into customers
- non-CSV files are not parsed into customers
- original file contents are not stored on the backend

## Run Commands

```powershell
npm start
```

```powershell
npm run dev
```

```powershell
npm run seed:admin
```
