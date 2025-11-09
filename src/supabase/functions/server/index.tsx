import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  
  return user;
}

// ============ AUTH ROUTES ============

// Signup
app.post('/make-server-eddc1f0e/signup', async (c) => {
  try {
    const { username, password, role } = await c.req.json();
    
    if (!username || !password || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    if (role !== 'teacher' && role !== 'student') {
      return c.json({ error: 'Invalid role' }, 400);
    }
    
    // Check if username already exists
    const existingUser = await kv.get(`user:${username}`);
    if (existingUser) {
      return c.json({ error: 'Username already exists' }, 400);
    }
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: `${username}@assignment-portal.local`,
      password: password,
      email_confirm: true, // Auto-confirm since we don't have email server
      user_metadata: { username, role }
    });
    
    if (error) {
      console.log('Supabase auth error during signup:', error);
      return c.json({ error: 'Failed to create user' }, 500);
    }
    
    // Store user data in KV
    await kv.set(`user:${username}`, {
      id: data.user.id,
      username,
      role,
      createdAt: new Date().toISOString()
    });
    
    await kv.set(`userid:${data.user.id}`, username);
    
    // If student, add to students list
    if (role === 'student') {
      const allStudents = await kv.get('all_students') || [];
      allStudents.push({ id: data.user.id, username });
      await kv.set('all_students', allStudents);
    }
    
    return c.json({ 
      success: true,
      user: { username, role, id: data.user.id }
    });
  } catch (error) {
    console.log('Error in signup:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Signin
app.post('/make-server-eddc1f0e/signin', async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    if (!username || !password) {
      return c.json({ error: 'Missing credentials' }, 400);
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@assignment-portal.local`,
      password: password
    });
    
    if (error) {
      console.log('Supabase auth error during signin:', error);
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    const userData = await kv.get(`user:${username}`);
    
    return c.json({
      success: true,
      accessToken: data.session.access_token,
      user: userData
    });
  } catch (error) {
    console.log('Error in signin:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============ COURSE ROUTES ============

// Get all students (Teacher only)
app.get('/make-server-eddc1f0e/students', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const username = await kv.get(`userid:${user.id}`);
    const userData = await kv.get(`user:${username}`);
    
    if (userData.role !== 'teacher') {
      return c.json({ error: 'Only teachers can view students' }, 403);
    }
    
    const students = await kv.get('all_students') || [];
    return c.json({ students });
  } catch (error) {
    console.log('Error fetching students:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create course (Teacher only)
app.post('/make-server-eddc1f0e/courses', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const username = await kv.get(`userid:${user.id}`);
    const userData = await kv.get(`user:${username}`);
    
    if (userData.role !== 'teacher') {
      return c.json({ error: 'Only teachers can create courses' }, 403);
    }
    
    const { name, description, enrolledStudents } = await c.req.json();
    
    const courseId = `course:${Date.now()}`;
    const course = {
      id: courseId,
      name,
      description,
      enrolledStudents: enrolledStudents || [],
      createdBy: username,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(courseId, course);
    
    // Add to teacher's courses list
    const teacherCourses = await kv.get(`teacher_courses:${username}`) || [];
    teacherCourses.push(courseId);
    await kv.set(`teacher_courses:${username}`, teacherCourses);
    
    // Add to each student's enrolled courses
    for (const studentUsername of enrolledStudents) {
      const studentCourses = await kv.get(`student_courses:${studentUsername}`) || [];
      studentCourses.push(courseId);
      await kv.set(`student_courses:${studentUsername}`, studentCourses);
    }
    
    return c.json({ success: true, course });
  } catch (error) {
    console.log('Error creating course:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get courses
app.get('/make-server-eddc1f0e/courses', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const username = await kv.get(`userid:${user.id}`);
    const userData = await kv.get(`user:${username}`);
    
    let courseIds = [];
    
    if (userData.role === 'teacher') {
      courseIds = await kv.get(`teacher_courses:${username}`) || [];
    } else {
      courseIds = await kv.get(`student_courses:${username}`) || [];
    }
    
    const courses = [];
    for (const id of courseIds) {
      const course = await kv.get(id);
      if (course) {
        courses.push(course);
      }
    }
    
    return c.json({ courses });
  } catch (error) {
    console.log('Error fetching courses:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete course (Teacher only)
app.delete('/make-server-eddc1f0e/courses/:courseId', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const username = await kv.get(`userid:${user.id}`);
    const userData = await kv.get(`user:${username}`);
    
    if (userData.role !== 'teacher') {
      return c.json({ error: 'Only teachers can delete courses' }, 403);
    }
    
    const courseId = c.req.param('courseId');
    const course = await kv.get(courseId);
    
    if (!course) {
      return c.json({ error: 'Course not found' }, 404);
    }
    
    if (course.createdBy !== username) {
      return c.json({ error: 'You can only delete your own courses' }, 403);
    }
    
    // Remove from teacher's courses
    const teacherCourses = await kv.get(`teacher_courses:${username}`) || [];
    const updatedTeacherCourses = teacherCourses.filter((id: string) => id !== courseId);
    await kv.set(`teacher_courses:${username}`, updatedTeacherCourses);
    
    // Remove from students' enrolled courses
    for (const studentUsername of course.enrolledStudents) {
      const studentCourses = await kv.get(`student_courses:${studentUsername}`) || [];
      const updatedStudentCourses = studentCourses.filter((id: string) => id !== courseId);
      await kv.set(`student_courses:${studentUsername}`, updatedStudentCourses);
    }
    
    // Delete the course
    await kv.del(courseId);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting course:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============ ASSIGNMENT ROUTES ============

// Create assignment (Teacher only)
app.post('/make-server-eddc1f0e/assignments', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const username = await kv.get(`userid:${user.id}`);
    const userData = await kv.get(`user:${username}`);
    
    if (userData.role !== 'teacher') {
      return c.json({ error: 'Only teachers can create assignments' }, 403);
    }
    
    const { title, description, dueDate, maxScore } = await c.req.json();
    
    const assignmentId = `assignment:${Date.now()}`;
    const assignment = {
      id: assignmentId,
      title,
      description,
      dueDate,
      maxScore,
      createdBy: username,
      createdAt: new Date().toISOString(),
      submissions: 0,
      totalStudents: 25 // Mock value for demo
    };
    
    await kv.set(assignmentId, assignment);
    
    // Add to teacher's assignments list
    const teacherAssignments = await kv.get(`teacher_assignments:${username}`) || [];
    teacherAssignments.push(assignmentId);
    await kv.set(`teacher_assignments:${username}`, teacherAssignments);
    
    return c.json({ success: true, assignment });
  } catch (error) {
    console.log('Error creating assignment:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all assignments
app.get('/make-server-eddc1f0e/assignments', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const username = await kv.get(`userid:${user.id}`);
    const userData = await kv.get(`user:${username}`);
    
    if (userData.role === 'teacher') {
      // Get teacher's assignments
      const assignmentIds = await kv.get(`teacher_assignments:${username}`) || [];
      const assignments = [];
      
      for (const id of assignmentIds) {
        const assignment = await kv.get(id);
        if (assignment) {
          // Count submissions for this assignment
          const submissionsData = await kv.getByPrefix(`submission:${id}:`);
          assignment.submissions = submissionsData.length;
          assignments.push(assignment);
        }
      }
      
      return c.json({ assignments });
    } else {
      // Students see all assignments
      const allAssignments = await kv.getByPrefix('assignment:');
      const assignments = [];
      
      for (const assignment of allAssignments) {
        // Check if student has submitted
        const submission = await kv.get(`submission:${assignment.id}:${username}`);
        
        assignments.push({
          ...assignment,
          status: submission ? (submission.status === 'graded' ? 'graded' : 'submitted') : 'not_started',
          score: submission?.score,
          feedback: submission?.feedback,
          submittedAt: submission?.submittedAt
        });
      }
      
      return c.json({ assignments });
    }
  } catch (error) {
    console.log('Error fetching assignments:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============ SUBMISSION ROUTES ============

// Submit assignment (Student only)
app.post('/make-server-eddc1f0e/submissions', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const username = await kv.get(`userid:${user.id}`);
    const userData = await kv.get(`user:${username}`);
    
    if (userData.role !== 'student') {
      return c.json({ error: 'Only students can submit assignments' }, 403);
    }
    
    const { assignmentId, content } = await c.req.json();
    
    const assignment = await kv.get(assignmentId);
    if (!assignment) {
      return c.json({ error: 'Assignment not found' }, 404);
    }
    
    const submissionId = `submission:${assignmentId}:${username}`;
    const submission = {
      id: submissionId,
      assignmentId,
      assignmentTitle: assignment.title,
      studentName: username,
      studentId: user.id,
      content,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      maxScore: assignment.maxScore
    };
    
    await kv.set(submissionId, submission);
    
    return c.json({ success: true, submission });
  } catch (error) {
    console.log('Error submitting assignment:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get submissions (Teacher: all submissions, Student: their own)
app.get('/make-server-eddc1f0e/submissions', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const username = await kv.get(`userid:${user.id}`);
    const userData = await kv.get(`user:${username}`);
    
    if (userData.role === 'teacher') {
      // Get all submissions for teacher's assignments
      const assignmentIds = await kv.get(`teacher_assignments:${username}`) || [];
      const submissions = [];
      
      for (const assignmentId of assignmentIds) {
        const assignmentSubmissions = await kv.getByPrefix(`submission:${assignmentId}:`);
        submissions.push(...assignmentSubmissions);
      }
      
      return c.json({ submissions });
    } else {
      // Get student's own submissions
      const allSubmissions = await kv.getByPrefix('submission:');
      const studentSubmissions = allSubmissions.filter(sub => sub.studentName === username);
      
      return c.json({ submissions: studentSubmissions });
    }
  } catch (error) {
    console.log('Error fetching submissions:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Grade submission (Teacher only)
app.post('/make-server-eddc1f0e/grade', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const username = await kv.get(`userid:${user.id}`);
    const userData = await kv.get(`user:${username}`);
    
    if (userData.role !== 'teacher') {
      return c.json({ error: 'Only teachers can grade submissions' }, 403);
    }
    
    const { submissionId, score, feedback } = await c.req.json();
    
    const submission = await kv.get(submissionId);
    if (!submission) {
      return c.json({ error: 'Submission not found' }, 404);
    }
    
    submission.status = 'graded';
    submission.score = score;
    submission.feedback = feedback;
    submission.gradedAt = new Date().toISOString();
    submission.gradedBy = username;
    
    await kv.set(submissionId, submission);
    
    return c.json({ success: true, submission });
  } catch (error) {
    console.log('Error grading submission:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health check
app.get('/make-server-eddc1f0e/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);