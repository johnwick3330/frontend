# 🚀 Quick Start Guide (5 Minutes)

## Step 1: Install Dependencies (1 min)

Open VS Code terminal (`` Ctrl+` ``) and run:

```bash
npm install
```

---

## Step 2: Set Up Supabase (2 min)

### A. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project name and password
4. Wait for initialization (~1 min)

### B. Get Your Credentials
1. Go to **Project Settings** (⚙️ icon) → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Project ID** (the `xxxxx` part)
   - **anon public key**
   - **service_role key** (click "Reveal" first)

### C. Configure Your Project

**Create** `/utils/supabase/info.tsx`:
```typescript
export const projectId = 'xxxxx'; // Your project ID
export const publicAnonKey = 'eyJhb...'; // Your anon public key
```

**Create** `.env` file in project root:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
SUPABASE_DB_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
```

> 💡 **Tip:** Copy from `.env.example` and fill in your values

---

## Step 3: Deploy Backend (1 min)

In VS Code terminal, run these commands:

```bash
# Login to Supabase (opens browser)
supabase login

# Link your project (replace with your project ID)
supabase link --project-ref xxxxx

# Deploy the backend
supabase functions deploy server

# Set environment variables
supabase secrets set SUPABASE_URL=https://xxxxx.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your_anon_key_here
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
supabase secrets set SUPABASE_DB_URL=your_db_url_here
```

---

## Step 4: Run Frontend (30 sec)

```bash
npm run dev
```

**Your app is now running at:** `http://localhost:5173` 🎉

---

## Step 5: Test It Out!

### Create Teacher Account
1. Open `http://localhost:5173`
2. Click "Sign Up"
3. Username: `teacher1`
4. Password: `password123`
5. Role: **Teacher**
6. Click "Sign Up"

### Create Student Account
1. Logout (top-right)
2. Click "Sign Up"
3. Username: `student1`
4. Password: `password123`
5. Role: **Student**
6. Click "Sign Up"

### Try the Features
1. **As Teacher:**
   - Go to "Courses" tab → Create a course
   - Enroll `student1` in the course
   - Go to "Create Assignment" tab → Create an assignment

2. **Logout and login as Student:**
   - View the assignment
   - Submit your work
   - See it appear in your submissions

3. **Logout and login as Teacher:**
   - Go to "Submissions" tab
   - Download the student's submission
   - Grade it with feedback

4. **Logout and login as Student again:**
   - See your grade and feedback! ✨

---

## 🎯 VS Code Tips

### Use Built-in Tasks
Press `Ctrl+Shift+P` → Type "Tasks: Run Task" → Select:
- 📦 Install Dependencies
- 🚀 Run Frontend (Dev Server)
- 🔧 Deploy Backend to Supabase

### Split Terminal
1. Press `` Ctrl+` `` to open terminal
2. Click the **Split** icon (⊞) in terminal toolbar
3. Run different commands in each panel

### Debug in Chrome
Press `F5` to launch Chrome with debugger attached

---

## ❗ Common Issues

### "Module not found"
```bash
npm install
```

### "Supabase command not found"
```bash
npm install -g supabase
```

### Backend errors
- Check `.env` file exists with correct values
- Verify backend is deployed: `supabase functions list`

### Port already in use
- Kill process: `npx kill-port 5173`
- Or change port in `vite.config.ts`

---

## 📚 Next Steps

- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed docs
- Read [README.md](./README.md) for API documentation
- Check [Supabase Docs](https://supabase.com/docs) for advanced features

---

## 🆘 Need Help?

**Check if everything is set up:**
```bash
# Check Node version (should be 18+)
node --version

# Check if Supabase CLI is installed
supabase --version

# Check if dependencies are installed
ls node_modules
```

**Verify Supabase connection:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Check your project is active (green dot)
3. Go to Edge Functions → Should see "server" function

---

**That's it! You're ready to go! 🚀**
