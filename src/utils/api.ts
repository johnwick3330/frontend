import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-eddc1f0e`;

export interface User {
  id: string;
  username: string;
  role: 'teacher' | 'student';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submissions?: number;
  totalStudents?: number;
  status?: 'not_started' | 'submitted' | 'graded';
  score?: number;
  feedback?: string;
  submittedAt?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentName: string;
  studentId: string;
  content: string;
  submittedAt: string;
  status: 'pending' | 'graded';
  maxScore: number;
  score?: number;
  feedback?: string;
}

export interface Student {
  id: string;
  username: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  enrolledStudents: string[];
  createdBy: string;
  createdAt: string;
}

// Auth APIs
export async function signup(username: string, password: string, role: 'teacher' | 'student') {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({ username, password, role })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Signup failed');
  }
  
  return data;
}

export async function signin(username: string, password: string) {
  const response = await fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Signin failed');
  }
  
  return data;
}

// Assignment APIs
export async function createAssignment(
  accessToken: string,
  assignment: {
    title: string;
    description: string;
    dueDate: string;
    maxScore: number;
  }
) {
  const response = await fetch(`${BASE_URL}/assignments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(assignment)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create assignment');
  }
  
  return data;
}

export async function getAssignments(accessToken: string): Promise<Assignment[]> {
  const response = await fetch(`${BASE_URL}/assignments`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch assignments');
  }
  
  return data.assignments;
}

// Submission APIs
export async function submitAssignment(
  accessToken: string,
  assignmentId: string,
  content: string
) {
  const response = await fetch(`${BASE_URL}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ assignmentId, content })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit assignment');
  }
  
  return data;
}

export async function getSubmissions(accessToken: string): Promise<Submission[]> {
  const response = await fetch(`${BASE_URL}/submissions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch submissions');
  }
  
  return data.submissions;
}

export async function gradeSubmission(
  accessToken: string,
  submissionId: string,
  score: number,
  feedback: string
) {
  const response = await fetch(`${BASE_URL}/grade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ submissionId, score, feedback })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to grade submission');
  }
  
  return data;
}

// Course APIs
export async function getStudents(accessToken: string): Promise<Student[]> {
  const response = await fetch(`${BASE_URL}/students`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch students');
  }
  
  return data.students;
}

export async function createCourse(
  accessToken: string,
  course: {
    name: string;
    description: string;
    enrolledStudents: string[];
  }
) {
  const response = await fetch(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(course)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create course');
  }
  
  return data;
}

export async function getCourses(accessToken: string): Promise<Course[]> {
  const response = await fetch(`${BASE_URL}/courses`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch courses');
  }
  
  return data.courses;
}

export async function deleteCourse(accessToken: string, courseId: string) {
  const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete course');
  }
  
  return data;
}