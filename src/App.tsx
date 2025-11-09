import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { Toaster } from './components/ui/sonner';

interface User {
  username: string;
  role: 'teacher' | 'student';
  accessToken: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (username: string, role: 'teacher' | 'student', accessToken: string) => {
    setUser({ username, role, accessToken });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : user.role === 'teacher' ? (
        <TeacherDashboard username={user.username} accessToken={user.accessToken} onLogout={handleLogout} />
      ) : (
        <StudentDashboard username={user.username} accessToken={user.accessToken} onLogout={handleLogout} />
      )}
      <Toaster />
    </>
  );
}