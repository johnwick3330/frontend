# ✅ Setup Checklist

Use this checklist to ensure everything is configured correctly.

## Prerequisites

- [ ] Node.js installed (v18+) - Run: `node --version`
- [ ] npm installed - Run: `npm --version`
- [ ] Supabase CLI installed - Run: `supabase --version`
  - If not: `npm install -g supabase`
- [ ] VS Code installed

## Supabase Setup

- [ ] Created Supabase account at [supabase.com](https://supabase.com)
- [ ] Created new Supabase project
- [ ] Project is fully initialized (no loading spinner)
- [ ] Copied Project URL from Settings > API
- [ ] Copied Project ID (from URL)
- [ ] Copied anon public key from Settings > API
- [ ] Copied service_role key from Settings > API (clicked "Reveal")

## Project Configuration

- [ ] Created `/utils/supabase/info.tsx` with:
  ```typescript
  export const projectId = 'your-project-id';
  export const publicAnonKey = 'your-anon-key';
  ```

- [ ] Created `.env` file in project root with:
  ```env
  SUPABASE_URL=https://xxxxx.supabase.co
  SUPABASE_ANON_KEY=eyJhb...
  SUPABASE_SERVICE_ROLE_KEY=eyJhb...
  SUPABASE_DB_URL=postgresql://...
  ```

- [ ] Verified `.env` file is in `.gitignore` (should be!)

## Dependencies

- [ ] Ran `npm install` successfully
- [ ] No errors in terminal
- [ ] `node_modules` folder exists

## Backend Deployment

- [ ] Ran `supabase login` (browser opened and logged in)
- [ ] Ran `supabase link --project-ref YOUR_ID` successfully
- [ ] Ran `supabase functions deploy server` successfully
- [ ] Set all 4 secrets with `supabase secrets set`:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] SUPABASE_DB_URL
- [ ] Verified function deployed in Supabase Dashboard > Edge Functions

## Frontend

- [ ] Ran `npm run dev`
- [ ] Terminal shows "Local: http://localhost:5173"
- [ ] Browser opens automatically to login page
- [ ] No errors in browser console (F12)

## Testing

- [ ] Created a teacher account
- [ ] Logged in as teacher successfully
- [ ] Teacher dashboard loads
- [ ] Created a student account (after logging out)
- [ ] Logged in as student successfully
- [ ] Student dashboard loads

## Full Feature Test

- [ ] Teacher can create a course
- [ ] Teacher can see list of students
- [ ] Teacher can enroll students in course
- [ ] Teacher can create an assignment
- [ ] Student can see the assignment
- [ ] Student can submit the assignment
- [ ] Teacher can see the submission
- [ ] Teacher can download the submission
- [ ] Teacher can grade with feedback
- [ ] Student can see grade and feedback

## Troubleshooting

If any checkbox above is not checked, refer to:

### Node.js not installed?
- Download from [nodejs.org](https://nodejs.org/)
- Install LTS version (18 or higher)
- Restart VS Code after installation

### Supabase CLI not working?
```bash
npm install -g supabase
# or
brew install supabase/tap/supabase  # macOS
```

### npm install fails?
```bash
# Clear cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Backend deployment fails?
- Check internet connection
- Verify you're logged into Supabase: `supabase login`
- Check project is linked: `supabase projects list`
- Try re-linking: `supabase link --project-ref YOUR_ID`

### Frontend won't start?
```bash
# Check if port 5173 is in use
npx kill-port 5173

# Try again
npm run dev
```

### Login not working?
- Check browser console (F12) for errors
- Verify `/utils/supabase/info.tsx` has correct values
- Check backend is deployed in Supabase dashboard
- Verify secrets are set: `supabase secrets list`

### Data not persisting?
- Check `.env` file exists and has correct values
- Verify backend secrets are set correctly
- Check Supabase dashboard > Database > Tables for `kv_store_eddc1f0e`

## Success! 🎉

If all checkboxes are ticked, your system is fully operational!

### Next Steps:
1. Read the [README.md](./README.md) for feature documentation
2. Explore the code in `/components` and `/supabase/functions/server`
3. Customize the UI in Tailwind CSS
4. Add more features!

---

**Questions?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.
