'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Calendar, Clock, AlertTriangle } from 'lucide-react'

interface GradingDeadline {
  id: string
  course_name: string
  course_code: string
  assessment_type: string
  due_date: string
  grading_deadline: string
  status: 'upcoming' | 'due' | 'overdue'
  submitted: number
  total: number
}

export default function GradingDeadlinesPage() {
  const [deadlines, setDeadlines] = useState<GradingDeadline[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sampleDeadlines: GradingDeadline[] = [
      {
        id: '1',
        course_name: 'Advanced Engineering Mathematics',
        course_code: 'ENG201',
        assessment_type: 'Assignment 1',
        due_date: '2024-02-15',
        grading_deadline: '2024-02-22',
        status: 'upcoming',
        submitted: 28,
        total: 32
      },
      {
        id: '2',
        course_name: 'Structural Analysis',
        course_code: 'ENG301',
        assessment_type: 'Midterm Exam',
        due_date: '2024-02-10',
        grading_deadline: '2024-02-17',
        status: 'due',
        submitted: 24,
        total: 30
      },
      {
        id: '3',
        course_name: 'Business Fundamentals',
        course_code: 'BUS101',
        assessment_type: 'Project',
        due_date: '2024-02-05',
        grading_deadline: '2024-02-12',
        status: 'overdue',
        submitted: 18,
        total: 25
      }
    ]
    setDeadlines(sampleDeadlines)
    setLoading(false)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>
      case 'due':
        return <Badge variant="default">Due Soon</Badge>
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'due':
        return <Calendar className="h-4 w-4 text-yellow-500" />
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const handleAddDeadline = () => {
    setIsAddDialogOpen(false)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Grading Deadlines</h1>
          <p className="text-muted-foreground">Manage assessment and grading deadlines</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Deadline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Grading Deadline</DialogTitle>
              <DialogDescription>Set a new grading deadline for an assessment</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="course">Course</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eng201">ENG201 - Advanced Engineering Mathematics</SelectItem>
                    <SelectItem value="eng301">ENG301 - Structural Analysis</SelectItem>
                    <SelectItem value="bus101">BUS101 - Business Fundamentals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assessment">Assessment Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due-date">Assessment Due Date</Label>
                <Input id="due-date" type="date" />
              </div>
              <div>
                <Label htmlFor="grading-deadline">Grading Deadline</Label>
                <Input id="grading-deadline" type="date" />
              </div>
              <Button onClick={handleAddDeadline} className="w-full">Add Deadline</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deadlines.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deadlines.filter(d => d.status === 'due').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{deadlines.filter(d => d.status === 'overdue').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grading Deadlines</CardTitle>
          <CardDescription>Track assessment submission and grading deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Grading Deadline</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deadlines.map((deadline) => (
                <TableRow key={deadline.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{deadline.course_name}</div>
                      <div className="text-sm text-gray-500">{deadline.course_code}</div>
                    </div>
                  </TableCell>
                  <TableCell>{deadline.assessment_type}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(deadline.due_date).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(deadline.status)}
                      <span>{new Date(deadline.grading_deadline).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{deadline.submitted}/{deadline.total} submitted</div>
                      <div className="text-gray-500">
                        {Math.round((deadline.submitted / deadline.total) * 100)}% complete
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(deadline.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
