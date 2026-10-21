# Renewal and Compliance Management System

A beginner-friendly full-stack web application designed for managing and tracking renewal dates of contracts, licenses, certifications, warranties, and more. This project is ideal for a college Full Stack Development assignment.

## Features
- **Authentication**: Simple login system.
- **Dashboard**: Overview of total, active, due soon, and expired renewals.
- **Manage Renewals**: Add, Edit, View, and Delete renewal records.
- **Renewal Records Table**: View all records with Search and Filtering capabilities.
- **Renewal History**: Track historical changes and activities for each renewal.
- **Reminder System**: Visual indicators and notification sections for upcoming and expired items based on remaining days.
- **Calendar View**: Simple grid-based calendar highlighting renewal dates.
- **Responsive UI**: Built with HTML, CSS, Bootstrap 5, and Fetch API.

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla/Fetch API), Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MySQL (using `mysql2` package)
- **Security**: `bcrypt` for password hashing, `cors`, `dotenv`

## System Requirements
- Node.js and npm

## Run Locally

The current API uses in-memory mock data, so MySQL setup is not required. Changes to renewals are temporary and reset when the server restarts.

1. Open a terminal in the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies and start the server:
   ```bash
   npm ci
   npm start
   ```
3. Open `http://localhost:5000` in your browser. Express serves the frontend and API from the same origin.

## Deploy on Render

1. Push the project to GitHub and create a **Web Service** on Render connected to the repository.
2. Leave **Root Directory** blank and set:
   - **Build Command:** `npm ci --prefix backend`
   - **Start Command:** `npm start --prefix backend`
3. Deploy. No environment variables or MySQL instance are required for the current mock-data version. Render provides the `PORT` environment variable.
4. Open the Render service URL to use the app.

The current backend stores data in memory, so changes reset when the service restarts or redeploys. Do not use this version to store sensitive or production data.

## Sample Login Credentials
Use these credentials to log into the application (pre-configured in the database):
- **Email**: `admin@example.com`
- **Password**: `password123`

## API Endpoints
The Node.js backend provides the following REST API endpoints:
- `POST /api/login` - Authenticate user
- `GET /api/dashboard` - Get statistics for dashboard
- `GET /api/renewals` - Get all renewal records
- `POST /api/renewals` - Add a new renewal record
- `GET /api/renewals/:id` - Get a specific renewal record
- `PUT /api/renewals/:id` - Update a specific renewal record
- `DELETE /api/renewals/:id` - Delete a specific renewal record
- `GET /api/renewals/:id/history` - Get history for a specific renewal
- `POST /api/renewals/:id/history` - Add history for a specific renewal

## Project Structure
```text
renewal-management-system/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── add-renewal.html
│   ├── records.html
│   ├── details.html
│   ├── calendar.html
│   ├── notifications.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── common.js
│       ├── login.js
│       ├── dashboard.js
│       ├── records.js
│       ├── add-renewal.js
│       ├── details.js
│       ├── calendar.js
│       └── notifications.js
├── backend/
│   ├── package.json
│   ├── .env
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── historyController.js
│   │   └── renewalController.js
│   └── routes/
│       ├── authRoutes.js
│       ├── historyRoutes.js
│       └── renewalRoutes.js
└── database/
    └── database.sql
```
