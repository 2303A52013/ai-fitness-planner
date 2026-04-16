# AI Fitness Planner

A full-stack AI fitness planner with a static frontend, Node.js/Express backend, MongoDB data storage, and a Python Flask ML service.

## Project structure

- `client/` — frontend UI with HTML, CSS, and JavaScript
- `server/` — Node.js + Express backend API
- `ml/` — Python Flask ML microservice

## Prerequisites

- Node.js v18+
- Python 3.9+
- MongoDB (local or Atlas)

## Setup

### 1. Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` or update the provided values:

```env
MONGO_URI=mongodb://localhost:27017/ai_fitness_planner
JWT_SECRET=your_jwt_secret
PORT=5000
ML_API_URL=http://localhost:5001
```

Run the backend:

```bash
npm run dev
```

The frontend and API will be available at `http://localhost:5000`.

### 2. ML API

```bash
cd ../ml
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 3. Frontend

Open the app at `http://localhost:5000` after starting the backend.

## Notes

- The backend provides authentication and CRUD endpoints for meals, workouts, and progress.
- The ML API exposes calorie prediction and workout recommendation endpoints.
- Frontend pages use token-based auth and basic forms for data entry.

## API Endpoints

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login and receive a JWT
- `GET /api/meals` — get meals for the authenticated user
- `POST /api/meals` — add a new meal entry
- `GET /api/workouts` — get workouts for the authenticated user
- `POST /api/workouts` — create a workout
- `GET /api/progress` — get progress entries
- `POST /api/progress` — add a progress entry
- `GET /api/progress/weekly` — get the last 7 days of progress

## ML API Endpoints

- `GET /health` — health check for the ML service
- `POST /predict-calories` — estimate daily calorie needs
- `POST /recommend` — get workout and diet recommendations
