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
- Node.js (v14 or higher)
- MySQL Server

## Installation Steps

### 1. Database Setup
1. Open your MySQL client (e.g., phpMyAdmin, MySQL Workbench, or CLI).
2. Execute the provided SQL script to create the database, tables, and sample data.
   - You can copy the contents of `database/database.sql` and run it.
   - Alternatively, from terminal: `mysql -u root -p < database/database.sql`
   *(Assuming your MySQL root user has no password. Adjust if necessary).*

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd renewal-management-system/backend
   ```
2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables:
   - Copy `.env.example` to `.env` in the `backend` directory.
   - Update the `DB_PASSWORD` in `.env` if your MySQL root user has a password. The local `.env` file is not committed.
     ```env
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=renewal_db
     ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *You should see a message saying "Server is running on http://localhost:5000" and "Successfully connected to the database."*

### 3. Frontend Setup
The frontend consists of plain HTML, CSS, and JS files. You do not need Node.js to run the frontend.
1. Simply open the `frontend/index.html` file in any modern web browser.
2. Alternatively, you can use a simple local server like VS Code's "Live Server" extension for a better experience.

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
