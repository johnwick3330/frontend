# 🎓 VS Code Walkthrough - Assignment Portal

**Complete step-by-step guide to run this project in VS Code**

---

## 📋 Table of Contents
1. [Opening the Project](#1-opening-the-project)
2. [Installing Dependencies](#2-installing-dependencies)
3. [Configuring Supabase](#3-configuring-supabase)
4. [Running the Backend](#4-running-the-backend)
5. [Running the Frontend](#5-running-the-frontend)
6. [Testing the Application](#6-testing-the-application)
7. [Debugging Tips](#7-debugging-tips)

---

## 1. Opening the Project

### Step 1.1: Open VS Code
- Launch Visual Studio Code

### Step 1.2: Open Project Folder
- File → Open Folder (or `Ctrl+K Ctrl+O`)
- Navigate to your project folder
- Click "Select Folder"

### Step 1.3: Trust the Workspace
- If prompted, click "Yes, I trust the authors"

### Step 1.4: Open Integrated Terminal
- View → Terminal (or `` Ctrl+` ``)
- The terminal should open at the bottom of VS Code

---

## 2. Installing Dependencies

### Step 2.1: Verify Node.js Installation
In the terminal, type:
```bash
node --version
```
**Expected output:** `v18.x.x` or higher

If not installed:
- Download from [nodejs.org](https://nodejs.org/)
- Install the LTS version
- Restart VS Code

### Step 2.2: Install Project Dependencies
In the terminal, run:
```bash
npm install
```

**What this does:** Installs React, TypeScript, Tailwind, and all required libraries

**Expected output:**
```
added 500+ packages in 30s
```

### Step 2.3: Verify Installation
Check if `node_modules` folder appears in the file explorer (left sidebar)

---

## 3. Configuring Supabase

### Step 3.1: Create Supabase Account
1. Open browser → [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub/Google/Email

### Step 3.2: Create New Project
1. Click "New Project"
2. Fill in:
   - **Name:** Assignment Portal
   - **Database Password:** (save this!)
   - **Region:** Choose closest to you
3. Click "Create new project"
4. **Wait 1-2 minutes** for initialization

### Step 3.3: Get API Credentials
1. In Supabase Dashboard, click **Settings** (⚙️ icon)
2. Click **API** in sidebar
3. Copy these values (keep tab open):
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - Click "Reveal" next to **service_role** key, then copy it

### Step 3.4: Get Project ID
From the Project URL `https://abcdefgh.supabase.co`, the project ID is `abcdefgh`

### Step 3.5: Create Configuration Files

#### File 1: Create `/utils/supabase/info.tsx`

In VS Code:
1. Right-click `utils` folder → New Folder → name it `supabase`
2. Right-click `supabase` folder → New File → name it `info.tsx`
3. Paste this code (replace with YOUR values):

```typescript
export const projectId = 'abcdefgh'; // YOUR project ID
export const publicAnonKey = 'eyJhbGc...'; // YOUR anon public key
```

4. Save file (`Ctrl+S`)

#### File 2: Create `.env` in Project Root

1. In VS Code Explorer, click on the root folder name
2. Right-click → New File → name it `.env`
3. Paste this (replace with YOUR values):

```env
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@db.abcdefgh.supabase.co:5432/postgres
```

**For SUPABASE_DB_URL:**
- Replace `YOUR_PASSWORD` with database password from Step 3.2
- Replace `abcdefgh` with your project ID

4. Save file (`Ctrl+S`)

### Step 3.6: Verify Configuration

In terminal, run:
```bash
npm run check
```

This script checks if all files are configured correctly.

---

## 4. Running the Backend

### Step 4.1: Install Supabase CLI

In terminal:
```bash
npm install -g supabase
```

**Verify installation:**
```bash
supabase --version
```

### Step 4.2: Login to Supabase

```bash
supabase login
```

**What happens:**
- Browser opens
- Click "Authorize"
- Return to VS Code

### Step 4.3: Link Your Project

```bash
supabase link --project-ref abcdefgh
```

Replace `abcdefgh` with YOUR project ID.

**Prompt:** Enter your database password (from Step 3.2)

### Step 4.4: Deploy Edge Function

```bash
supabase functions deploy server
```

**Expected output:**
```
Deploying Function...
Deployed!
```

### Step 4.5: Set Environment Secrets

Run these commands **one by one** (replace with YOUR values):

```bash
supabase secrets set SUPABASE_URL=https://abcdefgh.supabase.co

supabase secrets set SUPABASE_ANON_KEY=eyJhbG...

supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

supabase secrets set SUPABASE_DB_URL=postgresql://postgres:PASSWORD@db.abcdefgh.supabase.co:5432/postgres
```

**Verify secrets:**
```bash
supabase secrets list
```

### Step 4.6: Verify Backend Deployment

1. Go to Supabase Dashboard
2. Click **Edge Functions** in sidebar
3. You should see `server` function listed
4. Status should be "Active" (green)

---

## 5. Running the Frontend

### Step 5.1: Start Development Server

In VS Code terminal:
```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5.2: Open in Browser

**Option A:** Browser opens automatically

**Option B:** Manually open:
1. Open browser
2. Go to `http://localhost:5173`

### Step 5.3: Verify Frontend is Running

You should see the **Assignment Portal Login Page**

---

## 6. Testing the Application

### Test 6.1: Create Teacher Account

1. On login page, click "**Don't have an account? Sign up**"
2. Fill in:
   - **Username:** `teacher1`
   - **Password:** `password123`
   - **I am a:** Select "**Teacher**"
3. Click "**Sign Up**"

**Expected:** Redirected to Teacher Dashboard

### Test 6.2: Create a Course

1. Click "**Courses**" tab
2. Click "**Create Course**" button
3. Fill in:
   - **Course Name:** `Computer Science 101`
   - **Description:** `Introduction to programming`
4. Click "**Create Course**"

**Expected:** Course appears in the list

### Test 6.3: Logout

1. Click "**Logout**" button (top-right)

**Expected:** Return to login page

### Test 6.4: Create Student Account

1. Click "**Don't have an account? Sign up**"
2. Fill in:
   - **Username:** `student1`
   - **Password:** `password123`
   - **I am a:** Select "**Student**"
3. Click "**Sign Up**"

**Expected:** Redirected to Student Dashboard

### Test 6.5: Logout as Student

Click "**Logout**" (top-right)

### Test 6.6: Login as Teacher and Enroll Student

1. Login as `teacher1` / `password123`
2. Click "**Courses**" tab
3. Click "**Create Course**"
4. In the student list, check the box next to `student1`
5. Fill course name and click "**Create Course**"

### Test 6.7: Create Assignment

1. Click "**Create Assignment**" tab
2. Fill in:
   - **Title:** `Homework 1`
   - **Description:** `Write a program...`
   - **Due Date:** Pick a future date
   - **Max Score:** `100`
3. Click "**Create Assignment**"

**Expected:** Assignment created successfully

### Test 6.8: Submit as Student

1. Logout → Login as `student1`
2. You should see "Homework 1" in dashboard
3. Click the assignment card
4. Click "**Submit Assignment**"
5. Write some text in the submission box
6. Click "**Submit**"

**Expected:** Submission successful

### Test 6.9: Grade as Teacher

1. Logout → Login as `teacher1`
2. Click "**Submissions**" tab
3. Find `student1`'s submission
4. Click "**Download**" button to download submission
5. Click "**Grade**" button
6. Enter score and feedback
7. Click "**Submit Grade**"

**Expected:** Submission graded

### Test 6.10: View Grade as Student

1. Logout → Login as `student1`
2. Click "**Graded**" tab
3. You should see your grade and feedback!

**🎉 SUCCESS! Everything is working!**

---

## 7. Debugging Tips

### Use VS Code Debugger

1. Press `F5` or click Run → Start Debugging
2. Chrome opens with debugger attached
3. Set breakpoints by clicking left margin of code
4. Hover over variables to see values

### Check Browser Console

1. In browser, press `F12`
2. Click "**Console**" tab
3. Look for errors (red text)

### Check Network Requests

1. In browser DevTools (`F12`)
2. Click "**Network**" tab
3. Look for failed requests (red)
4. Click on request to see details

### View Backend Logs

1. Go to Supabase Dashboard
2. Click **Edge Functions**
3. Click **server** function
4. Click "**Logs**" tab
5. See real-time backend logs

### Common Issues

#### "Cannot find module" error
**Solution:**
```bash
npm install
```

#### Backend not responding
**Solution:**
1. Check if function is deployed: `supabase functions list`
2. Check logs in Supabase dashboard
3. Verify secrets are set: `supabase secrets list`

#### Login not working
**Solution:**
1. Check browser console for errors
2. Verify `/utils/supabase/info.tsx` has correct values
3. Verify `.env` file exists and has correct values

#### Port 5173 already in use
**Solution:**
```bash
npx kill-port 5173
npm run dev
```

---

## 🎯 VS Code Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Terminal | `` Ctrl+` `` |
| Split Terminal | `Ctrl+Shift+5` |
| Command Palette | `Ctrl+Shift+P` |
| Quick Open File | `Ctrl+P` |
| Save File | `Ctrl+S` |
| Find in File | `Ctrl+F` |
| Find in All Files | `Ctrl+Shift+F` |
| Start Debugging | `F5` |
| Toggle Sidebar | `Ctrl+B` |

---

## 🚀 Running Daily

After initial setup, to start development:

1. **Open VS Code** → Open project folder
2. **Terminal 1:** `npm run dev` (Frontend)
3. **Open browser:** `http://localhost:5173`

Backend is already deployed to Supabase - no need to run it locally!

---

## 📚 Additional Resources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [VS Code Docs](https://code.visualstudio.com/docs)

---

**🎉 Congratulations! You've successfully set up and run the Assignment Portal!**

Need more help? Check:
- `QUICKSTART.md` - 5-minute quick start
- `SETUP_GUIDE.md` - Detailed setup guide
- `SETUP_CHECKLIST.md` - Step-by-step checklist
