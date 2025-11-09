#!/usr/bin/env node

/**
 * Setup Verification Script
 * Run: node check-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking Assignment Portal Setup...\n');

let allGood = true;

// Helper function to check file existence
function checkFile(filePath, description) {
  const exists = fs.existsSync(path.join(__dirname, filePath));
  console.log(exists ? '✅' : '❌', description);
  if (!exists) allGood = false;
  return exists;
}

// Helper function to check file content
function checkFileContent(filePath, pattern, description) {
  try {
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    const hasPattern = pattern.test(content);
    console.log(hasPattern ? '✅' : '⚠️ ', description);
    if (!hasPattern) allGood = false;
    return hasPattern;
  } catch (e) {
    console.log('❌', description, '(file not found)');
    allGood = false;
    return false;
  }
}

console.log('📁 Required Files:');
checkFile('package.json', 'package.json exists');
checkFile('index.html', 'index.html exists');
checkFile('main.tsx', 'main.tsx exists');
checkFile('App.tsx', 'App.tsx exists');
checkFile('vite.config.ts', 'vite.config.ts exists');
checkFile('tsconfig.json', 'tsconfig.json exists');

console.log('\n🔧 Configuration Files:');
const hasEnv = checkFile('.env', '.env file exists');
const hasInfo = checkFile('utils/supabase/info.tsx', 'utils/supabase/info.tsx exists');

if (hasEnv) {
  checkFileContent('.env', /SUPABASE_URL=/, '.env contains SUPABASE_URL');
  checkFileContent('.env', /SUPABASE_ANON_KEY=/, '.env contains SUPABASE_ANON_KEY');
  checkFileContent('.env', /SUPABASE_SERVICE_ROLE_KEY=/, '.env contains SUPABASE_SERVICE_ROLE_KEY');
  checkFileContent('.env', /SUPABASE_DB_URL=/, '.env contains SUPABASE_DB_URL');
} else {
  console.log('⚠️  Create .env file (see .env.example)');
}

if (hasInfo) {
  checkFileContent('utils/supabase/info.tsx', /export const projectId/, 'info.tsx contains projectId');
  checkFileContent('utils/supabase/info.tsx', /export const publicAnonKey/, 'info.tsx contains publicAnonKey');
} else {
  console.log('⚠️  Create utils/supabase/info.tsx (see QUICKSTART.md)');
}

console.log('\n📦 Components:');
checkFile('components/LoginPage.tsx', 'LoginPage component exists');
checkFile('components/TeacherDashboard.tsx', 'TeacherDashboard component exists');
checkFile('components/StudentDashboard.tsx', 'StudentDashboard component exists');
checkFile('components/CourseManagement.tsx', 'CourseManagement component exists');

console.log('\n🌐 Backend:');
checkFile('supabase/functions/server/index.tsx', 'Backend server file exists');
checkFile('utils/api.ts', 'API utilities exist');

console.log('\n📦 Dependencies:');
const hasNodeModules = checkFile('node_modules', 'node_modules folder exists');
if (!hasNodeModules) {
  console.log('⚠️  Run: npm install');
}

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('✅ All checks passed! Your project is ready.');
  console.log('\n📚 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Deploy backend: supabase functions deploy server');
  console.log('   3. Open: http://localhost:5173');
  console.log('\n💡 Need help? Check QUICKSTART.md\n');
} else {
  console.log('⚠️  Some issues found. Please fix them before running.');
  console.log('\n📚 Setup guides:');
  console.log('   • QUICKSTART.md - Fast 5-minute setup');
  console.log('   • SETUP_GUIDE.md - Detailed instructions');
  console.log('   • SETUP_CHECKLIST.md - Step-by-step checklist');
  console.log('\n💡 Common fixes:');
  console.log('   • Missing .env? Copy .env.example and fill in values');
  console.log('   • Missing node_modules? Run: npm install');
  console.log('   • Missing info.tsx? See QUICKSTART.md Step 2C\n');
}

console.log('='.repeat(50) + '\n');
