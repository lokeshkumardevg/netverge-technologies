# NetVerge Technologies — Full Stack Website

Next.js 14 (website + admin panel) + NestJS API + MongoDB

```
netverge/
├── backend/    NestJS API      -> http://localhost:4000/api
├── frontend/   Next.js app     -> http://localhost:3000
└── docker-compose.yml          (optional local MongoDB)
```

## Run (3 terminals)

1. MongoDB:   `docker compose up -d`   (ya apna local MongoDB / Atlas URI use karo)
2. Backend:
   ```
   cd backend && cp .env.example .env     # values badlo
   npm install && npm run start:dev
   ```
3. Frontend:
   ```
   cd frontend && cp .env.example .env.local
   npm install && npm run dev
   ```

## URLs
- Website:     http://localhost:3000
- Admin panel: http://localhost:3000/admin   (login = ADMIN_EMAIL / ADMIN_PASSWORD from backend/.env)

## Admin se kya edit hota hai
- Page Content: Home, About, Services, Leadership, Contact (text, images, stats, lists)
- Manage: Services, Team, Partners (add / edit / delete / reorder / hide)
- Site Settings: logo, phone, email, address, map embed URL, social links, footer text
- Messages inbox, Dashboard stats, image upload, change password, admin users

## Production
- Frontend: `npm run build && npm start`  (NEXT_PUBLIC_API_URL = live API URL)
- Backend:  `npm run build && npm run start:prod` (FRONTEND_URL = live site URL, strong JWT_SECRET)
- Admin password pehli login ke baad badal do (Account & Users page).
