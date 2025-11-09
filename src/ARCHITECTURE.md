# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│                     (http://localhost:5173)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  ┌────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ LoginPage  │  │   Teacher   │  │     Student         │  │
│  │            │  │  Dashboard  │  │    Dashboard        │  │
│  └────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                   │              │
│         └────────────────┴───────────────────┘              │
│                          │                                  │
│                    ┌─────▼──────┐                          │
│                    │  API Client │                          │
│                    │ (utils/api) │                          │
│                    └─────────────┘                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTPS Requests
                           │ (with Auth Token)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE EDGE FUNCTION                      │
│              (Deno Runtime + Hono Framework)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes (/make-server-eddc1f0e/...)             │  │
│  │  ┌────────────┐ ┌──────────┐ ┌──────────────────┐  │  │
│  │  │ Auth       │ │ Courses  │ │  Assignments     │  │  │
│  │  │ - Signup   │ │ - Create │ │  - Create        │  │  │
│  │  │ - Signin   │ │ - List   │ │  - List          │  │  │
│  │  └────────────┘ └──────────┘ │  - Submit        │  │  │
│  │                               │  - Grade         │  │  │
│  │                               └──────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE SERVICES                         │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │ Auth Service │  │  PostgreSQL   │  │   KV Store      │  │
│  │              │  │   Database    │  │  (Key-Value)    │  │
│  │ - User mgmt  │  │               │  │  - Users        │  │
│  │ - Tokens     │  │               │  │  - Courses      │  │
│  │ - Sessions   │  │               │  │  - Assignments  │  │
│  │              │  │               │  │  - Submissions  │  │
│  └──────────────┘  └───────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Signup Flow

```
Student/Teacher
      │
      │ 1. Enters username, password, role
      ▼
  LoginPage.tsx
      │
      │ 2. Calls signup()
      ▼
  utils/api.ts
      │
      │ 3. POST /signup with credentials
      ▼
Backend (index.tsx)
      │
      │ 4. Creates Supabase Auth user
      ├─────────────► Supabase Auth Service
      │
      │ 5. Stores user data in KV
      ├─────────────► KV Store (user:username)
      │
      │ 6. Returns user + access token
      ▼
  LoginPage.tsx
      │
      │ 7. Redirects to Dashboard
      ▼
Teacher/Student Dashboard
```

### 2. Create Assignment Flow (Teacher)

```
Teacher Dashboard
      │
      │ 1. Fills assignment form
      ▼
createAssignment()
      │
      │ 2. POST /assignments + access token
      ▼
Backend
      │
      │ 3. Verifies token
      ├─────────────► Supabase Auth
      │
      │ 4. Checks user is teacher
      │
      │ 5. Creates assignment in KV
      ├─────────────► KV Store
      │               - assignment:timestamp
      │               - teacher_assignments:username
      │
      │ 6. Returns created assignment
      ▼
Teacher Dashboard
      │
      │ 7. Updates UI with new assignment
      ▼
UI Updates
```

### 3. Submit Assignment Flow (Student)

```
Student Dashboard
      │
      │ 1. Clicks "Submit" on assignment
      ▼
submitAssignment()
      │
      │ 2. POST /submissions + content + token
      ▼
Backend
      │
      │ 3. Verifies token
      ├─────────────► Supabase Auth
      │
      │ 4. Checks user is student
      │
      │ 5. Stores submission in KV
      ├─────────────► KV Store
      │               - submission:assignmentId:username
      │
      │ 6. Returns submission
      ▼
Student Dashboard
      │
      │ 7. Shows success + updates status
      ▼
UI Updates
```

### 4. Grade Submission Flow (Teacher)

```
Teacher Dashboard
      │
      │ 1. Downloads submission
      │ 2. Enters score + feedback
      ▼
gradeSubmission()
      │
      │ 3. POST /grade + score + feedback + token
      ▼
Backend
      │
      │ 4. Verifies token
      ├─────────────► Supabase Auth
      │
      │ 5. Checks user is teacher
      │
      │ 6. Updates submission in KV
      ├─────────────► KV Store
      │               - Updates status to 'graded'
      │               - Adds score and feedback
      │
      │ 7. Returns updated submission
      ▼
Teacher Dashboard
      │
      │ 8. Shows success
      ▼
UI Updates
      │
      │ (Meanwhile...)
      ▼
Student Dashboard (when they login)
      │
      │ 9. Fetches submissions
      ├─────────────► Backend → KV Store
      │
      │ 10. Sees grade + feedback
      ▼
Shows Grade
```

---

## Database Schema (KV Store)

### Key Patterns

```javascript
// Users
'user:${username}' → {
  id: string,
  username: string,
  role: 'teacher' | 'student',
  createdAt: string
}

'userid:${userId}' → username (string)

'all_students' → Array<{ id: string, username: string }>

// Courses
'course:${timestamp}' → {
  id: string,
  name: string,
  description: string,
  enrolledStudents: string[], // usernames
  createdBy: string, // teacher username
  createdAt: string
}

'teacher_courses:${username}' → Array<courseId>
'student_courses:${username}' → Array<courseId>

// Assignments
'assignment:${timestamp}' → {
  id: string,
  title: string,
  description: string,
  dueDate: string,
  maxScore: number,
  createdBy: string, // teacher username
  createdAt: string
}

'teacher_assignments:${username}' → Array<assignmentId>

// Submissions
'submission:${assignmentId}:${username}' → {
  id: string,
  assignmentId: string,
  assignmentTitle: string,
  studentName: string,
  studentId: string,
  content: string,
  submittedAt: string,
  status: 'pending' | 'graded',
  maxScore: number,
  score?: number,
  feedback?: string,
  gradedAt?: string,
  gradedBy?: string
}
```

---

## Authentication Flow

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Login with username/password
       ▼
┌─────────────────────────────────┐
│    Supabase Auth Service        │
│  (via backend server)           │
└──────┬──────────────────────────┘
       │
       │ 2. Returns access_token
       ▼
┌─────────────┐
│   Client    │
│  Stores in  │
│   State     │
└──────┬──────┘
       │
       │ 3. All API calls include:
       │    Authorization: Bearer {access_token}
       ▼
┌─────────────────────────────────┐
│    Backend Edge Function        │
│  - Verifies token with Auth     │
│  - Gets user ID                 │
│  - Checks permissions           │
│  - Processes request            │
└─────────────────────────────────┘
```

---

## File Structure

```
project-root/
│
├── Frontend (React + TypeScript)
│   │
│   ├── App.tsx                    # Root component, auth state
│   ├── main.tsx                   # Entry point
│   │
│   ├── components/
│   │   ├── LoginPage.tsx          # Login/Signup UI
│   │   ├── TeacherDashboard.tsx   # Teacher interface
│   │   ├── StudentDashboard.tsx   # Student interface
│   │   ├── CourseManagement.tsx   # Course CRUD
│   │   └── ui/                    # shadcn components
│   │
│   └── utils/
│       ├── api.ts                 # API client functions
│       └── supabase/
│           └── info.tsx           # Supabase config
│
├── Backend (Deno + Hono)
│   │
│   └── supabase/functions/server/
│       ├── index.tsx              # API routes
│       └── kv_store.tsx           # Database utilities
│
└── Configuration
    ├── .env                       # Environment variables
    ├── vite.config.ts             # Vite config
    ├── tsconfig.json              # TypeScript config
    └── package.json               # Dependencies
```

---

## API Endpoints

### Authentication
- `POST /make-server-eddc1f0e/signup` - Create account
- `POST /make-server-eddc1f0e/signin` - Login

### Courses (Teacher only)
- `GET /make-server-eddc1f0e/students` - List all students
- `POST /make-server-eddc1f0e/courses` - Create course
- `GET /make-server-eddc1f0e/courses` - Get courses
- `DELETE /make-server-eddc1f0e/courses/:id` - Delete course

### Assignments
- `POST /make-server-eddc1f0e/assignments` - Create (teacher)
- `GET /make-server-eddc1f0e/assignments` - List all

### Submissions
- `POST /make-server-eddc1f0e/submissions` - Submit (student)
- `GET /make-server-eddc1f0e/submissions` - List submissions
- `POST /make-server-eddc1f0e/grade` - Grade submission (teacher)

---

## Security Model

```
┌──────────────────────────────────────────────────┐
│              Security Layers                     │
├──────────────────────────────────────────────────┤
│                                                  │
│  1. Frontend (Public)                           │
│     - Uses publicAnonKey                        │
│     - No sensitive operations                   │
│                                                  │
│  2. Network (HTTPS)                             │
│     - All traffic encrypted                     │
│     - Access token in Authorization header      │
│                                                  │
│  3. Backend (Protected)                         │
│     - Verifies access_token for every request   │
│     - Uses service_role_key for admin ops       │
│     - Role-based access control                 │
│                                                  │
│  4. Database (Isolated)                         │
│     - Only backend can access                   │
│     - service_role_key never exposed            │
│                                                  │
└──────────────────────────────────────────────────┘

Key Security Rules:
✅ publicAnonKey → Safe in frontend
✅ access_token → Stored in React state (memory only)
❌ service_role_key → NEVER in frontend
❌ .env → NEVER committed to git
```

---

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Vite** - Build tool
- **Lucide React** - Icons

### Backend
- **Deno** - JavaScript runtime
- **Hono** - Web framework
- **Supabase Auth** - Authentication
- **Supabase Storage** - Key-Value database

### Development
- **VS Code** - IDE
- **ESLint** - Code linting
- **Git** - Version control

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Production Setup                │
├─────────────────────────────────────────┤
│                                         │
│  Frontend                               │
│  ├── Vercel/Netlify                    │
│  ├── CDN for static assets             │
│  └── Auto-deploy from git              │
│                                         │
│  Backend                                │
│  ├── Supabase Edge Functions           │
│  ├── Auto-scale                         │
│  └── Global edge network                │
│                                         │
│  Database                               │
│  ├── Supabase PostgreSQL               │
│  ├── Automatic backups                  │
│  └── Point-in-time recovery             │
│                                         │
└─────────────────────────────────────────┘
```

---

## Performance Considerations

- **Frontend:** Vite provides fast HMR (Hot Module Replacement)
- **Backend:** Edge Functions run close to users (low latency)
- **Database:** KV store provides fast key-based lookups
- **Auth:** JWT tokens cached, minimal auth checks

---

## Scalability

The architecture supports:
- ✅ Unlimited students and teachers
- ✅ Unlimited courses and assignments
- ✅ Concurrent submissions
- ✅ Horizontal scaling (Edge Functions)
- ✅ Global distribution

---

**Need more details?** Check the code documentation in each file!
