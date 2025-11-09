# 📚 Assignment Portal (FEDF-PS25)

A full-stack assignment submission and grading system with role-based authentication for teachers and students.

## ✨ Features

### For Teachers:
- ✅ Create and manage courses
- ✅ Enroll students in courses
- ✅ Create assignments with deadlines
- ✅ Download student submissions
- ✅ Grade submissions with feedback
- ✅ Track submission progress
- ✅ Delete courses

### For Students:
- ✅ View enrolled courses
- ✅ Submit assignments
- ✅ View grades and feedback
- ✅ Track assignment deadlines
- ✅ Monitor submission status

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase Edge Functions (Deno + Hono)
- **Database:** Supabase (PostgreSQL + Key-Value Store)
- **Auth:** Supabase Authentication

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

**Option A: Use Supabase Cloud (Recommended)**
1. Create a project at [supabase.com](https://supabase.com)
2. Get your credentials from Project Settings > API
3. Create `/utils/supabase/info.tsx`:
```typescript
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

4. Create `.env` in project root:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_DB_URL=your_db_url
```

### 3. Deploy Backend
```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Deploy edge function
supabase functions deploy server

# Set secrets
supabase secrets set SUPABASE_URL=https://xxxxx.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your_anon_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set SUPABASE_DB_URL=your_db_url
```

### 4. Run Frontend
```bash
npm run dev
```

### 5. Open in Browser
Navigate to `http://localhost:5173`

## 📖 Detailed Setup

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for comprehensive instructions.

## 🎯 Usage Flow

1. **Sign up** as a teacher or student
2. **Teacher:** Create a course and enroll students
3. **Teacher:** Create an assignment
4. **Student:** Submit the assignment
5. **Teacher:** Download, grade, and provide feedback
6. **Student:** View grade and feedback

## 📁 Project Structure

```
/
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── LoginPage.tsx       # Login/signup page
│   ├── TeacherDashboard.tsx
│   ├── StudentDashboard.tsx
│   └── CourseManagement.tsx
├── supabase/functions/server/
│   ├── index.tsx           # Backend API (Hono server)
│   └── kv_store.tsx        # Key-value database utilities
├── utils/
│   ├── api.ts              # API client functions
│   └── supabase/info.tsx   # Supabase config
├── App.tsx                 # Main app component
└── package.json
```

## 🔑 Environment Variables

Required in `.env`:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)
- `SUPABASE_DB_URL` - Database connection URL

## 🐛 Troubleshooting

### Backend not connecting?
- Verify `.env` file exists with correct values
- Check Supabase project is active
- Ensure edge function is deployed

### Frontend errors?
- Run `npm install` again
- Clear browser cache
- Check console for specific errors

### CORS issues?
- Ensure backend is deployed correctly
- Verify API endpoint in `/utils/api.ts`

## 📝 API Endpoints

All endpoints are prefixed with `/make-server-eddc1f0e`:

- `POST /signup` - Create new account
- `POST /signin` - Login
- `GET /students` - List all students (teacher only)
- `POST /courses` - Create course (teacher only)
- `GET /courses` - Get enrolled courses
- `DELETE /courses/:id` - Delete course (teacher only)
- `POST /assignments` - Create assignment (teacher only)
- `GET /assignments` - Get assignments
- `POST /submissions` - Submit assignment (student only)
- `GET /submissions` - Get submissions
- `POST /grade` - Grade submission (teacher only)

## 🔒 Security Notes

- Never commit `.env` file to version control
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Frontend uses `publicAnonKey` only
- Backend validates all requests with auth tokens

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

Built with ❤️ using React, Supabase, and TypeScript
