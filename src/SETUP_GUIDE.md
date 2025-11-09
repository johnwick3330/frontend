# Assignment Portal - Setup & Run Guide

## Prerequisites

Before running this project, make sure you have the following installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Deno** (for backend) - [Installation guide](https://deno.land/manual/getting_started/installation)
3. **Supabase CLI** - Install via npm:
   ```bash
   npm install -g supabase
   ```
4. **VS Code** - [Download here](https://code.visualstudio.com/)

## Project Structure

```
/
├── supabase/functions/server/  # Backend (Deno/Hono server)
├── components/                 # React components
├── utils/                      # Utility functions
├── App.tsx                     # Main React app
└── package.json                # Frontend dependencies
```

---

## Step 1: Install Frontend Dependencies

Open VS Code terminal (`` Ctrl+` `` or `View > Terminal`) and run:

```bash
npm install
```

This will install all React, TypeScript, and UI library dependencies.

---

## Step 2: Set Up Supabase

### Option A: Use Supabase Cloud (Recommended)

1. **Create a Supabase Project:**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up/Login
   - Click "New Project"
   - Fill in project details and wait for it to initialize

2. **Get Your Project Credentials:**
   - Go to Project Settings > API
   - Copy:
     - `Project URL` (looks like: `https://xxxxx.supabase.co`)
     - `anon public` key
     - `service_role` key (keep this secret!)

3. **Update Your Project Files:**

   Create/Update `/utils/supabase/info.tsx`:
   ```typescript
   export const projectId = 'YOUR_PROJECT_ID'; // Extract from URL: xxxxx.supabase.co
   export const publicAnonKey = 'YOUR_ANON_KEY';
   ```

4. **Set Environment Variables for Backend:**
   
   Create a `.env` file in the project root:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   SUPABASE_DB_URL=your_db_url_here
   ```

### Option B: Use Supabase Locally

1. **Initialize Supabase:**
   ```bash
   supabase init
   ```

2. **Start Supabase:**
   ```bash
   supabase start
   ```

3. **Copy the credentials** that appear in the terminal to your `.env` file

---

## Step 3: Run the Backend (Supabase Edge Function)

### Option A: Deploy to Supabase Cloud

1. **Login to Supabase CLI:**
   ```bash
   supabase login
   ```

2. **Link Your Project:**
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   ```

3. **Deploy the Edge Function:**
   ```bash
   supabase functions deploy server
   ```

4. **Set Environment Variables in Supabase:**
   ```bash
   supabase secrets set SUPABASE_URL=https://xxxxx.supabase.co
   supabase secrets set SUPABASE_ANON_KEY=your_anon_key
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   supabase secrets set SUPABASE_DB_URL=your_db_url
   ```

### Option B: Run Locally with Deno

Open a **new terminal** in VS Code and run:

```bash
cd supabase/functions/server
deno run --allow-net --allow-env --allow-read index.tsx
```

**Note:** Make sure your `.env` file is in the project root with all the required variables.

---

## Step 4: Run the Frontend

In a **separate terminal**, run:

```bash
npm run dev
```

This will start the Vite development server, usually at `http://localhost:5173`

---

## Step 5: Open in Browser

1. Open your browser
2. Go to `http://localhost:5173`
3. You should see the login page!

---

## Running Both Frontend & Backend Together

### Recommended VS Code Setup:

1. **Open Terminal Panel:** `` Ctrl+` ``
2. **Split Terminal:** Click the split icon or press `Ctrl+Shift+5`
3. **Terminal 1:** Run frontend
   ```bash
   npm run dev
   ```
4. **Terminal 2:** Run backend (if running locally)
   ```bash
   cd supabase/functions/server
   deno run --allow-net --allow-env --allow-read index.tsx
   ```

### Using VS Code Tasks (Advanced)

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run Frontend",
      "type": "shell",
      "command": "npm run dev",
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Run Backend",
      "type": "shell",
      "command": "cd supabase/functions/server && deno run --allow-net --allow-env --allow-read index.tsx",
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Run All",
      "dependsOn": ["Run Frontend", "Run Backend"],
      "problemMatcher": []
    }
  ]
}
```

Then press `Ctrl+Shift+P` > `Tasks: Run Task` > `Run All`

---

## Common Issues & Solutions

### Issue 1: "Module not found" errors
**Solution:** Run `npm install` again

### Issue 2: Backend not connecting
**Solution:** 
- Check if `.env` file exists with correct credentials
- Verify SUPABASE_URL and keys are correct
- Make sure Deno is installed: `deno --version`

### Issue 3: CORS errors
**Solution:** The backend already has CORS enabled. Make sure you're using the correct API endpoint.

### Issue 4: "Cannot find Supabase project"
**Solution:**
- Check your `projectId` in `/utils/supabase/info.tsx`
- Verify your Supabase project is active

### Issue 5: Port already in use
**Solution:**
- Frontend: Change port in `vite.config.ts` or kill the process using port 5173
- Backend: The edge function port is managed by Supabase

---

## Development Workflow

1. **Start Development:**
   ```bash
   # Terminal 1
   npm run dev
   
   # Terminal 2 (if running backend locally)
   cd supabase/functions/server
   deno run --allow-net --allow-env --allow-read index.tsx
   ```

2. **Make Changes:**
   - Edit React components in `/components`
   - Edit backend logic in `/supabase/functions/server/index.tsx`
   - Changes auto-reload in frontend (Vite HMR)
   - Backend requires restart after changes

3. **Test the App:**
   - Sign up as a teacher
   - Sign up as a student
   - Create courses and assignments
   - Test submissions and grading

---

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variables in the platform settings

### Backend
Already deployed via Supabase Edge Functions (see Step 3)

---

## Useful VS Code Extensions

1. **ES7+ React/Redux/React-Native snippets** - Quick React snippets
2. **Tailwind CSS IntelliSense** - Tailwind autocomplete
3. **Deno** - Deno language support
4. **TypeScript Vue Plugin (Volar)** - Better TS support

---

## Need Help?

- Check Supabase docs: https://supabase.com/docs
- Check Deno docs: https://deno.land/manual
- Check React docs: https://react.dev

---

## Quick Start (TL;DR)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your Supabase credentials

# 3. Run frontend
npm run dev

# 4. Deploy backend to Supabase
supabase functions deploy server

# 5. Open http://localhost:5173
```

Happy coding! 🚀
