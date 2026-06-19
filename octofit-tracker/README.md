# OctoFit Tracker Setup and Running Guide

## Project Structure

```
octofit-tracker/
├── backend/          # Express + MongoDB API server
│   ├── src/
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API endpoints
│   │   └── index.ts         # Main server file
│   ├── package.json
│   └── tsconfig.json
├── frontend/         # React + Vite UI
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── api/             # API client
│   │   ├── App.jsx          # Main app
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── .gitignore
```

## Stack

- **Backend:** Node.js + Express + TypeScript
- **Frontend:** React 19 + Vite + Bootstrap + React Router
- **Database:** MongoDB
- **API Port:** 8000
- **Frontend Port:** 5173

## Prerequisites

- Node.js (LTS) installed
- MongoDB running on localhost:27017
- npm package manager

## Backend Setup

```bash
# 1. Install backend dependencies
npm install --prefix octofit-tracker/backend

# 2. Start MongoDB (if not running)
ps aux | grep mongod

# 3. Start backend server
npm --prefix octofit-tracker/backend start
# or for development with auto-reload:
npm --prefix octofit-tracker/backend run dev
```

The backend API will be available at `http://localhost:8000`

### Backend API Endpoints

#### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Activities
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Log new activity
- `GET /api/activities/user/:userId` - Get user's activities
- `DELETE /api/activities/:id` - Delete activity

#### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams/:id/members` - Add member to team
- `DELETE /api/teams/:id/members/:userId` - Remove member from team

#### Leaderboard
- `GET /api/leaderboard` - Get full leaderboard
- `GET /api/leaderboard/user/:userId` - Get user's rank

#### Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get workout by ID
- `DELETE /api/workouts/:id` - Delete workout

## Frontend Setup

```bash
# 1. Install frontend dependencies
npm install --prefix octofit-tracker/frontend

# 2. Start frontend development server
npm --prefix octofit-tracker/frontend run dev
```

The frontend will be available at `http://localhost:5173`

## Features

### 1. User Profiles
- Create users with roles: **Student** or **Teacher**
- View all registered users
- Delete users

### 2. Activity Tracking
- Log activities with type, duration, and date
- Automatic score calculation (1 point per minute)
- View activity history
- Delete past activities

### 3. Teams
- Create teams with description
- Add/remove members
- View team members
- Delete teams

### 4. Leaderboard
- View all users ranked by total score
- Real-time score updates based on logged activities
- Competitive ranking system

### 5. Workout Suggestions
- Browse suggested workouts
- Workouts have difficulty levels (Easy, Medium, Hard)
- Add new workout suggestions
- Organize by type and duration

## Testing

### Quick Test with curl

```bash
# 1. Create a user
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"pass123","role":"student"}'

# 2. Get all users
curl http://localhost:8000/api/users

# 3. Create an activity (replace USER_ID with actual ID)
curl -X POST http://localhost:8000/api/activities \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","type":"Running","duration":30}'

# 4. Get leaderboard
curl http://localhost:8000/api/leaderboard

# 5. Get health check
curl http://localhost:8000/api/health
```

## Running Both Services

### Terminal 1: Start Backend
```bash
npm --prefix octofit-tracker/backend run dev
```

### Terminal 2: Start Frontend
```bash
npm --prefix octofit-tracker/frontend run dev
```

Then open your browser to `http://localhost:5173`

## Database

MongoDB will automatically create the database `octofit_db` when the backend connects.

Collections created:
- `users`
- `activities`
- `teams`
- `leaderboards`
- `workouts`

## Notes

- Activities automatically update the leaderboard when logged
- When a user is deleted, their leaderboard entry is also deleted
- Team members are stored as user references
- Scores are calculated as 1 point per minute of activity
