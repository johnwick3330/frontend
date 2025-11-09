# 🚀 START HERE - Assignment Portal Setup

Welcome! This document will help you get started with the Assignment Portal project.

---

## 📚 Which Guide Should I Follow?

Choose based on your experience level:

### 🏃‍♂️ **For Quick Setup (5 minutes)**
→ Read: **[QUICKSTART.md](./QUICKSTART.md)**

Best if you:
- ✅ Have used Supabase before
- ✅ Know basic terminal commands
- ✅ Want to get running ASAP

### 📖 **For Step-by-Step Instructions**
→ Read: **[VS_CODE_WALKTHROUGH.md](./VS_CODE_WALKTHROUGH.md)**

Best if you:
- ✅ New to Supabase
- ✅ Want detailed explanations
- ✅ Prefer visual step-by-step guides

### ✅ **For Checklist-Style Setup**
→ Read: **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)**

Best if you:
- ✅ Like checkbox lists
- ✅ Want to track progress
- ✅ Need to verify each step

### 📘 **For Complete Documentation**
→ Read: **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**

Best if you:
- ✅ Want comprehensive docs
- ✅ Need troubleshooting info
- ✅ Want to understand architecture

---

## ⚡ Super Quick Start (For Experienced Developers)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (use .env.example as template)
# Add your Supabase credentials

# 3. Create utils/supabase/info.tsx
# export const projectId = 'your-id';
# export const publicAnonKey = 'your-key';

# 4. Deploy backend
supabase login
supabase link --project-ref YOUR_PROJECT_ID
supabase functions deploy server
supabase secrets set SUPABASE_URL=...
supabase secrets set SUPABASE_ANON_KEY=...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase secrets set SUPABASE_DB_URL=...

# 5. Run frontend
npm run dev

# 6. Open http://localhost:5173
```

---

## 📁 Project Overview

### What is this?
An **assignment submission and grading system** with:
- 👨‍🏫 Teacher dashboard (create courses, assignments, grade submissions)
- 👨‍🎓 Student dashboard (submit work, view grades)
- 🔐 Secure authentication
- 💾 Persistent data storage with Supabase

### Tech Stack
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Supabase Edge Functions (Deno)
- **Database:** Supabase PostgreSQL
- **UI:** shadcn/ui components

---

## 🎯 Prerequisites

Before starting, make sure you have:

1. **Node.js v18+** - [Download](https://nodejs.org/)
2. **VS Code** - [Download](https://code.visualstudio.com/)
3. **Supabase Account** - [Sign up](https://supabase.com)
4. **Basic knowledge of:**
   - Terminal/Command line
   - JavaScript/TypeScript
   - React basics

---

## 🛠️ Setup Process Overview

### Step 1: Clone/Download Project
You already have this if you're reading this! ✅

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Supabase
- Create Supabase project
- Get API credentials
- Create config files

### Step 4: Deploy Backend
```bash
supabase functions deploy server
```

### Step 5: Run Frontend
```bash
npm run dev
```

### Step 6: Test
- Create teacher account
- Create student account
- Test full workflow

---

## 🔧 Helpful Commands

| Command | What it does |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run check` | Verify setup is correct |
| `supabase functions deploy server` | Deploy backend |
| `supabase secrets list` | Show backend secrets |

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `.env` | Backend environment variables |
| `utils/supabase/info.tsx` | Frontend Supabase config |
| `App.tsx` | Main app entry point |
| `components/` | React components |
| `supabase/functions/server/` | Backend code |

---

## ✅ Verify Your Setup

Run this command to check if everything is configured:

```bash
npm run check
```

This will tell you what's missing!

---

## 🎓 Learning Resources

### Understanding the Code

**Frontend:**
- `App.tsx` - Main app, handles login state
- `LoginPage.tsx` - Login/signup form
- `TeacherDashboard.tsx` - Teacher interface
- `StudentDashboard.tsx` - Student interface
- `CourseManagement.tsx` - Course CRUD operations

**Backend:**
- `supabase/functions/server/index.tsx` - API endpoints
- `utils/api.ts` - Frontend API client

### Key Concepts

**Authentication Flow:**
1. User signs up → Supabase Auth creates account
2. User logs in → Receives access token
3. Access token used for all API calls
4. Backend verifies token on each request

**Data Flow:**
1. Frontend makes API call with token
2. Backend verifies token
3. Backend queries/updates database (KV store)
4. Backend returns response
5. Frontend updates UI

---

## 🆘 Getting Help

### Something Not Working?

1. **Check your setup:**
   ```bash
   npm run check
   ```

2. **Check browser console:**
   - Press `F12` in browser
   - Look for red errors

3. **Check backend logs:**
   - Go to Supabase Dashboard
   - Edge Functions → server → Logs

4. **Common fixes:**
   - Missing `.env`? Copy from `.env.example`
   - Backend error? Check secrets: `supabase secrets list`
   - Module error? Run: `npm install`

### Documentation

- **Quick issues:** See [QUICKSTART.md](./QUICKSTART.md)
- **Detailed help:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Troubleshooting:** See [VS_CODE_WALKTHROUGH.md](./VS_CODE_WALKTHROUGH.md) Section 7

---

## 🎯 What's Next?

After getting it running:

1. **Explore the code** - Understand how it works
2. **Customize the UI** - Edit Tailwind classes
3. **Add features** - Extend functionality
4. **Deploy** - Host on Vercel/Netlify

---

## 📬 Project Structure

```
assignment-portal/
├── 📄 START_HERE.md           ← You are here!
├── 📄 QUICKSTART.md           ← 5-min setup
├── 📄 VS_CODE_WALKTHROUGH.md  ← Detailed walkthrough
├── 📄 SETUP_GUIDE.md          ← Complete docs
├── 📄 SETUP_CHECKLIST.md      ← Checkbox list
├── 📄 README.md               ← Project README
│
├── 📁 components/             ← React components
│   ├── LoginPage.tsx
│   ├── TeacherDashboard.tsx
│   ├── StudentDashboard.tsx
│   ├── CourseManagement.tsx
│   └── ui/                    ← shadcn components
│
├── 📁 supabase/functions/server/
│   └── index.tsx              ← Backend API
│
├── 📁 utils/
│   ├── api.ts                 ← API client
│   └── supabase/
│       └── info.tsx           ← Config (you create this)
│
├── 📄 App.tsx                 ← Main app
├── 📄 main.tsx                ← Entry point
├── 📄 .env.example            ← Template for .env
└── 📄 package.json            ← Dependencies
```

---

## 🎉 Ready to Start?

Pick your guide and let's go!

→ **Fast:** [QUICKSTART.md](./QUICKSTART.md)  
→ **Detailed:** [VS_CODE_WALKTHROUGH.md](./VS_CODE_WALKTHROUGH.md)  
→ **Checklist:** [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

---

**Questions?** All documentation is in this folder - check the guides above!

**Good luck! 🚀**
