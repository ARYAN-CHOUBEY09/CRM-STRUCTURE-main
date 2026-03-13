# CRM Frontend

React + Vite frontend for the CRM app.

## Setup

1. `cd frontend`
2. `npm install`
3. Create `.env`
4. Run `npm run dev`

Local environment variable:

```env
VITE_API_URL=http://localhost:5000/api
```

## Build

```powershell
npm run build
```

## Production

Use your deployed backend URL:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

The `public/.htaccess` file is included so React Router routes work after refresh on Apache-based hosting.
