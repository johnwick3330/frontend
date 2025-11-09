import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { BookOpen, Plus, Trash2, Users } from 'lucide-react';
import { createCourse, getCourses, deleteCourse, getStudents, type Course, type Student } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface CourseManagementProps {
  accessToken: string;
}

export function CourseManagement({ accessToken }: CourseManagementProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
  });
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses(accessToken);
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await getStudents(accessToken);
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourse.name.trim()) {
      toast.error('Course name is required');
      return;
    }

    try {
      await createCourse(accessToken, {
        ...newCourse,
        enrolledStudents: selectedStudents
      });
      
      toast.success('Course created successfully!');
      setNewCourse({ name: '', description: '' });
      setSelectedStudents([]);
      setIsCreateDialogOpen(false);
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create course');
    }
  };

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (!confirm(`Are you sure you want to delete "${courseName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCourse(accessToken, courseId);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete course');
    }
  };

  const toggleStudentSelection = (username: string) => {
    setSelectedStudents(prev =>
      prev.includes(username)
        ? prev.filter(s => s !== username)
        : [...prev, username]
    );
  };

  return (
    <div className="space-y-6">
      {/* Create Course Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg">Courses</h3>
          <p className="text-sm text-muted-foreground">
            Manage your courses and student enrollments
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Create a course and enroll students
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  placeholder="e.g., Introduction to Computer Science"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="courseDescription">Description</Label>
                <Textarea
                  id="courseDescription"
                  placeholder="Course description..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Enroll Students ({selectedStudents.length} selected)</Label>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-2">
                  {students.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No students available. Students need to sign up first.
                    </p>
                  ) : (
                    students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={selectedStudents.includes(student.username)}
                          onCheckedChange={() => toggleStudentSelection(student.username)}
                        />
                        <Label
                          htmlFor={`student-${student.id}`}
                          className="cursor-pointer flex-1"
                        >
                          {student.username}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCourse}>
                  Create Course
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No courses yet</p>
              <p className="text-sm">Create your first course to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {course.description || 'No description'}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id, course.name)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>
                    {course.enrolledStudents.length} student{course.enrolledStudents.length !== 1 ? 's' : ''} enrolled
                  </span>
                </div>
                
                {course.enrolledStudents.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {course.enrolledStudents.map((studentUsername) => (
                      <Badge key={studentUsername} variant="secondary">
                        {studentUsername}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
