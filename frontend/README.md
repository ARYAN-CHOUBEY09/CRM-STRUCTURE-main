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

For same-domain production deployments behind Nginx, the frontend now defaults to `/api`, so
`VITE_API_URL` is optional.

If your backend is on another domain or subdomain, set:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

Recommended production flow:

1. Build the frontend with `npm run build`
2. Copy `dist/` into your web root, for example `/var/www/crm-frontend`
3. Serve the built files directly from Nginx
4. Proxy `/api/` to the backend Node app

Do not use `npm run preview` as the production web server.

The `public/.htaccess` file is included so React Router routes work after refresh on Apache-based hosting.
For Nginx, use the sample config in `frontend/nginx.conf.example`.
