# Language Learner

A full-stack web app for learning new languages. Save vocabulary, review flashcards, and track your progress.

## Stack

- **Frontend**: React 18 + Vite + React Router v6 + Axios — `localhost:5173`
- **Backend**: Node.js + Express + PostgreSQL + JWT auth — `localhost:3001`

## Features

- Register/login with JWT auth (7-day tokens)
- Set your native and target language on signup
- Add vocabulary words with translations, example sentences, and difficulty ratings
- Flashcard review mode with correct/incorrect tracking
- Dashboard showing vocabulary count, review stats, and accuracy
- CRUD for vocabulary and lessons

## Setup

### 1. Database

Create a PostgreSQL database:

```sql
CREATE DATABASE language_learner;
```

### 2. Server

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npm run dev
```

### 3. Client

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

### `server/.env`

```
DATABASE_URL=postgresql://user:password@localhost:5432/language_learner
JWT_SECRET=your_long_random_secret
PORT=3001
ANTHROPIC_API_KEY=optional_for_ai_features
```

### `client/.env` (optional)

```
VITE_API_URL=http://localhost:3001
```

## API Routes

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/vocabulary` | Yes | List vocabulary |
| POST | `/api/vocabulary` | Yes | Add word |
| PUT | `/api/vocabulary/:id` | Yes | Update word |
| POST | `/api/vocabulary/:id/review` | Yes | Record review result |
| DELETE | `/api/vocabulary/:id` | Yes | Delete word |
| GET | `/api/lessons` | Yes | List lessons |
| POST | `/api/lessons` | Yes | Create lesson |
| PUT | `/api/lessons/:id` | Yes | Update lesson |
| DELETE | `/api/lessons/:id` | Yes | Delete lesson |
| GET | `/api/health` | No | Health check |
