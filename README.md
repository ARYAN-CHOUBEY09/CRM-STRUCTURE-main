# CRM Structure Main

Full-stack CRM project with:

- `frontend` built using React + Vite
- `backend` built using Express + MongoDB

## Features

- Admin login with JWT authentication
- Admin-controlled user creation
- Role-based module access for `Admin`, `Manager`, and `Staff`
- Customer management
- User management
- Permissions management
- Import logs
- CSV-based customer import

## Project Structure

```text
CRM-STRUCTURE-main/
├─ frontend/
├─ backend/
├─ scripts/
└─ package.json
```

## Quick Start

### 1. Install dependencies

Backend:

```powershell
cd backend
npm install
```

Frontend:

```powershell
cd frontend
npm install
```

### 2. Configure backend env

Create `backend/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
PORT=5000
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Create first admin

From `backend`:

```powershell
$env:ADMIN_FULL_NAME="Admin User"; $env:ADMIN_USERNAME="admin"; $env:ADMIN_PASSWORD="admin123"; npm run seed:admin
```

### 4. Run the project

From the root folder:

```powershell
npm run dev
```

This starts:

- backend on `http://localhost:5000`
- frontend on Vite dev server, usually `http://localhost:5173`

## Login

Default admin credentials:

```text
username: admin
password: admin123
```

## Roles and Access

Roles:

- `Admin`
- `Manager`
- `Staff`

Permission levels:

- `No Access`
- `View`
- `Edit`

Modules:

- Dashboard
- Customers
- Imports
- Users
- Permissions

Behavior:

- `Admin` has full access
- `Manager` and `Staff` access is controlled by stored module permissions
- users are created by admin and then log in directly
- public signup is not part of the UI flow

## Import Behavior

- CSV files can import customer rows into the CRM
- import history is saved in import logs
- original uploaded files are not stored on the backend
- non-CSV files are not parsed into customer records

Recommended CSV columns:

```csv
name,company,email,phone,source,status,internalNotes,salesAmount,payment,subscription,subscriptionDate
```

## Useful Commands

Root:

```powershell
npm run dev
npm run backend
npm run frontend
npm run build
```

Backend:

```powershell
npm start
npm run dev
npm run seed:admin
```

Frontend:

```powershell
npm run dev
npm run build
```

## Hostinger Deployment

Recommended production setup:

- host `frontend` as a static site on the main domain
- host `backend` as a Node.js app on a subdomain like `api.yourdomain.com`
- use MongoDB Atlas or another hosted MongoDB service

### Backend deployment

Deploy the `backend` folder and configure these environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

Commands:

```powershell
npm install
npm start
```

Health check:

```text
https://api.yourdomain.com/api/health
```

Bootstrap the first admin once after deployment:

```powershell
$env:ADMIN_FULL_NAME="Admin User"; $env:ADMIN_USERNAME="admin"; $env:ADMIN_PASSWORD="ChangeMe123!"; npm run seed:admin
```

### Frontend deployment

Deploy the `frontend` folder with this environment variable:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

Build command:

```powershell
npm install
npm run build
```

The project includes `frontend/public/.htaccess` so React Router routes continue to work after refresh on Apache-based hosting.

### Final checks

- verify login on the live domain
- create, edit, and delete a customer
- import a CSV file
- create a user and test permissions
- refresh `/app/dashboard` and `/app/customers`

## Notes

- `.env` files are ignored and should not be pushed to GitHub
- if backend permissions change, restart the backend before testing
- root `npm run dev` runs frontend and backend in the same terminal
