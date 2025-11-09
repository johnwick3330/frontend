import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { 
  Plus, 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  LogOut,
  Star,
  Download
} from 'lucide-react';
import { createAssignment, getAssignments, getSubmissions, gradeSubmission, type Assignment, type Submission } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { CourseManagement } from './CourseManagement';

interface TeacherDashboardProps {
  username: string;
  accessToken: string;
  onLogout: () => void;
}

export function TeacherDashboard({ username, accessToken, onLogout }: TeacherDashboardProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxScore: 100
  });

  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [isGradingDialogOpen, setIsGradingDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments(accessToken);
        setAssignments(data);
      } catch (error) {
        toast.error('Failed to fetch assignments');
      }
    };

    const fetchSubmissions = async () => {
      try {
        const data = await getSubmissions(accessToken);
        setSubmissions(data);
      } catch (error) {
        toast.error('Failed to fetch submissions');
      }
    };

    fetchAssignments();
    fetchSubmissions();
  }, [accessToken]);

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.dueDate) return;
    
    try {
      const assignment: Assignment = {
        id: Date.now().toString(),
        ...newAssignment,
        submissions: 0,
        totalStudents: 25
      };
      
      await createAssignment(accessToken, assignment);
      setAssignments([...assignments, assignment]);
      setNewAssignment({ title: '', description: '', dueDate: '', maxScore: 100 });
      toast.success('Assignment created successfully');
    } catch (error) {
      toast.error('Failed to create assignment');
    }
  };

  const handleGradeSubmission = async () => {
    if (!gradingSubmission || !gradeScore) return;
    
    try {
      const updatedSubmissions = submissions.map(sub => 
        sub.id === gradingSubmission.id 
          ? { 
              ...sub, 
              status: 'graded' as const, 
              score: parseInt(gradeScore), 
              feedback: gradeFeedback 
            }
          : sub
      );
      
      await gradeSubmission(accessToken, gradingSubmission.id, parseInt(gradeScore), gradeFeedback);
      setSubmissions(updatedSubmissions);
      setGradingSubmission(null);
      setGradeScore('');
      setGradeFeedback('');
      setIsGradingDialogOpen(false);
      toast.success('Submission graded successfully');
    } catch (error) {
      toast.error('Failed to grade submission');
    }
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-full p-2">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Teacher Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {username}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{assignments.length}</p>
                  <p className="text-sm text-muted-foreground">Active Assignments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{pendingSubmissions.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{gradedSubmissions.length}</p>
                  <p className="text-sm text-muted-foreground">Graded This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="create">Create Assignment</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <CourseManagement accessToken={accessToken} />
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Assignment Overview</h2>
            </div>
            
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {assignment.submissions}/{assignment.totalStudents} submitted
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Max Score: {assignment.maxScore}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Submission Progress</span>
                            <span>{Math.round((assignment.submissions / assignment.totalStudents) * 100)}%</span>
                          </div>
                          <Progress value={(assignment.submissions / assignment.totalStudents) * 100} />
                        </div>
                      </div>
                      
                      <Badge variant={assignment.submissions === assignment.totalStudents ? "default" : "secondary"}>
                        {assignment.submissions === assignment.totalStudents ? "Complete" : "In Progress"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Student Submissions</h2>
            </div>
            
            <div className="grid gap-4">
              {submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{submission.studentName}</h3>
                          <Badge variant={submission.status === 'graded' ? "default" : "secondary"}>
                            {submission.status === 'graded' ? `${submission.score}/${submission.maxScore}` : 'Pending'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{submission.assignmentTitle}</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Submitted: {submission.submittedAt}
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium mb-2">Submission Content:</p>
                          <p className="text-sm whitespace-pre-wrap">{submission.content}</p>
                        </div>
                        
                        {submission.feedback && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-4">
                            <p className="text-sm font-medium mb-2">Your Feedback:</p>
                            <p className="text-sm">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const blob = new Blob([`Student: ${submission.studentName}\nAssignment: ${submission.assignmentTitle}\nSubmitted: ${submission.submittedAt}\n\n${submission.content}`], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${submission.studentName}-${submission.assignmentTitle}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                            toast.success('Submission downloaded');
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        
                        {submission.status === 'pending' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" onClick={() => { setGradingSubmission(submission); setIsGradingDialogOpen(true); }}>
                                Grade
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Grade Submission</DialogTitle>
                                <DialogDescription>
                                  Grading {submission.studentName}'s submission for {submission.assignmentTitle}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="score">Score (out of {submission.maxScore})</Label>
                                  <Input
                                    id="score"
                                    type="number"
                                    min="0"
                                    max={submission.maxScore}
                                    value={gradeScore}
                                    onChange={(e) => setGradeScore(e.target.value)}
                                    placeholder="Enter score"
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="feedback">Feedback</Label>
                                  <Textarea
                                    id="feedback"
                                    value={gradeFeedback}
                                    onChange={(e) => setGradeFeedback(e.target.value)}
                                    placeholder="Provide feedback to the student..."
                                    rows={4}
                                  />
                                </div>
                                
                                <Button onClick={handleGradeSubmission} className="w-full">
                                  Submit Grade
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Assignment</CardTitle>
                <CardDescription>
                  Create a new assignment for your students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input
                    id="title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    placeholder="Enter assignment title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                    placeholder="Describe the assignment requirements"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxScore">Maximum Score</Label>
                    <Input
                      id="maxScore"
                      type="number"
                      min="1"
                      value={newAssignment.maxScore}
                      onChange={(e) => setNewAssignment({...newAssignment, maxScore: parseInt(e.target.value) || 100})}
                    />
                  </div>
                </div>
                
                <Button onClick={handleCreateAssignment} className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}