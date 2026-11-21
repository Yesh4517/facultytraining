# FTCF — Faculty Training Credit Framework

Full-stack web app: React + Vite frontend, Express + MongoDB backend.

---

## Quick Start

### Step 1 — Set up MongoDB (choose one option)

**Option A — MongoDB Atlas (easiest, free, no install needed)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster (M0 tier)
3. Click **Connect → Drivers** → copy your connection string
4. It looks like: `mongodb+srv://user:password@cluster0.abc.mongodb.net/ftcf?...`

**Option B — Local MongoDB**
1. Download from https://www.mongodb.com/try/download/community
2. Install with "Run as a Service" checked
3. MongoDB will start automatically on port 27017

---

### Step 2 — Configure the Backend

```
cd SWE-PROJECT/ftcf-backend
```

Edit `.env` and set your `MONGO_URI`:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ftcf   # Atlas
# OR
MONGO_URI=mongodb://localhost:27017/ftcf                      # Local
JWT_SECRET=ftcf_super_secret_jwt_key_2026
PORT=5000
```

---

### Step 3 — Seed the Database

```
cd SWE-PROJECT/ftcf-backend
npm install
node seed.js
```

This creates all users, trainings, registrations, and certificates.

---

### Step 4 — Start the Backend

```
cd SWE-PROJECT/ftcf-backend
npm run dev
# → Server on http://localhost:5000
```

---

### Step 5 — Start the Frontend

```
cd SWE-PROJECT/ftcf-app
npm run dev
# → App on http://localhost:5173
```

---

## Demo Login Credentials

| Role        | Email                              | Password       |
|-------------|-------------------------------------|----------------|
| Faculty     | nitish.pradhan@lnmiit.ac.in         | faculty123     |
| Coordinator | rajbir.kaur@lnmiit.ac.in            | coordinator123 |
| Admin       | mohan.kumar@lnmiit.ac.in            | admin123       |

---

## What's Connected to MongoDB

| Feature                    | Before         | Now              |
|----------------------------|----------------|------------------|
| Login / Logout             | Mock array     | JWT + MongoDB    |
| Session persistence        | Lost on refresh | localStorage JWT |
| Browse Trainings           | Static data    | Live API         |
| Register Training          | No-op form     | Real DB write    |
| Upload Certificate         | No-op form     | File upload + DB |
| Credit History             | Static         | Live from DB     |
| Verify / Reject Certs      | Local state    | Updates DB       |
| Manage Registrations       | Local state    | Approve via API  |
| Manage Programs            | Local state    | Full CRUD API    |
| Role-based routes          | None           | Enforced         |

---

## API Endpoints

| Method | Path                            | Description                    |
|--------|---------------------------------|--------------------------------|
| POST   | /api/auth/login                 | Login, returns JWT             |
| GET    | /api/auth/me                    | Get current user from token    |
| GET    | /api/trainings                  | List trainings (with filters)  |
| POST   | /api/trainings                  | Create training (coord/admin)  |
| GET    | /api/registrations              | List registrations             |
| POST   | /api/registrations              | Faculty registers              |
| PUT    | /api/registrations/:id/status   | Approve / reject               |
| GET    | /api/certificates               | List certificates              |
| POST   | /api/certificates               | Upload certificate + file      |
| PUT    | /api/certificates/:id/verify    | Verify or reject               |
| GET    | /api/credits                    | Credit history                 |
| POST   | /api/attendance/bulk            | Save session attendance        |
| GET    | /api/stats/system               | Admin KPIs                     |
| GET    | /api/stats/departments          | Per-department breakdown       |
| GET    | /api/stats/monthly-trends       | Monthly credit trends          |
