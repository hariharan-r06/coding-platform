# Coding Practice Platform

A full-stack web application for tracking coding practice progress, managing problem patterns, and reviewing submissions.

## Tech Stack
- **Frontend**: React.js (Vite), Axios, Lucide React, Chart.js, Framer Motion
- **Backend**: Node.js, Express, Supabase (PostgreSQL & Storage)
- **Authentication**: JWT & Bcrypt

## Setup Instructions

### 1. Database Setup (Supabase)
Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user', -- 'admin' or 'user'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Patterns Table
CREATE TABLE patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Problems Table
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  problem_link VARCHAR(500) NOT NULL,
  pattern_id UUID REFERENCES patterns(id) ON DELETE CASCADE,
  difficulty VARCHAR(20), -- 'Easy', 'Medium', 'Hard'
  platform VARCHAR(50), -- 'LeetCode', 'GeeksforGeeks'
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Submissions Table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  screenshot_url VARCHAR(500) NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- 5. Storage
-- Go to Storage in Supabase and create a public bucket named 'submission-screenshots'
```

### 2. Environment Variables
Connect your Supabase project by updating `server/.env`:
```env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
JWT_SECRET=your-secure-secret
```

Update `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation & Running

**Backend:**
```bash
cd server
npm install
npm start
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

## Admin Setup
To create your first Admin user:
1. Register a new account via the frontend.
2. Go to your Supabase dashboard -> `users` table.
3. Manually change the `role` from 'user' to 'admin' for your account.

## Features
- **Progress Tracking**: Solve problems on LC/GFG and upload screenshot proof.
- **Visual Analytics**: View progress by difficulty and pattern via interactive charts.
- **Pattern Management**: Admins can organize problems by algorithm patterns.
- **Submission Review**: Admins can approve or reject submissions with screenshot verification.
