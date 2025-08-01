'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  BarChart3,
  Edit
} from 'lucide-react'
import type { User } from '@/lib/supabase'

interface InstructorDashboardProps {
  user: User
}

interface InstructorStats {
  totalCourses: number
  totalStudents: number
  pendingGrades: number
  upcomingDeadlines: number
  completedAssessments: number
  averageClassGPA: number
}

interface MyCourse {
  id: string
  code: string
  name: string
  semester: string
  enrolledStudents: number
  pendingGrades: number
  nextDeadline?: {
    type: string
    date: string
  }
  averageGrade: number
}

interface PendingTask {
  id: string
  type: 'grading' | 'deadline' | 'submission'
  course: string
  description: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  count?: number
}

export default function InstructorDashboard({ user }: InstructorDashboardProps) {
  const [stats, setStats] = useState<InstructorStats>({
    totalCourses: 0,
    totalStudents: 0,
    pendingGrades: 0,
    upcomingDeadlines: 0,
    completedAssessments: 0,
    averageClassGPA: 0,
  })
  const [myCourses, setMyCourses] = useState<MyCourse[]>([])
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching instructor data
    const fetchInstructorData = async () => {
      // Simulated data - replace with actual API calls
      setStats({
        totalCourses: 4,
        totalStudents: 158,
        pendingGrades: 23,
        upcomingDeadlines: 2,
        completedAssessments: 12,
        averageClassGPA: 2.8,
      })

      setMyCourses([
        {
          id: '1',
          code: 'ENG201',
          name: 'Advanced Engineering Mathematics',
          semester: 'Semester 1, 2024',
          enrolledStudents: 45,
          pendingGrades: 8,
          nextDeadline: {
            type: 'Final Grades',
            date: '2024-02-15',
          },
          averageGrade: 2.9,
        },
        {
          id: '2',
          code: 'MATH301',
          name: 'Differential Equations',
          semester: 'Semester 1, 2024',
          enrolledStudents: 38,
          pendingGrades: 12,
          nextDeadline: {
            type: 'Assignment 3',
            date: '2024-02-10',
          },
          averageGrade: 3.1,
        },
        {
          id: '3',
          code: 'ENG401',
          name: 'Engineering Project Management',
          semester: 'Semester 1, 2024',
          enrolledStudents: 32,
          pendingGrades: 3,
          averageGrade: 2.7,
        },
        {
          id: '4',
          code: 'MATH101',
          name: 'Foundation Mathematics',
          semester: 'Semester 1, 2024',
          enrolledStudents: 43,
          pendingGrades: 0,
          nextDeadline: {
            type: 'Midterm Exam',
            date: '2024-02-08',
          },
          averageGrade: 2.5,
        },
      ])

      setPendingTasks([
        {
          id: '1',
          type: 'grading',
          course: 'ENG201',
          description: 'Grade midterm exams',
          dueDate: '2024-02-05',
          priority: 'high',
          count: 8,
        },
        {
          id: '2',
          type: 'deadline',
          course: 'MATH301',
          description: 'Submit final grades',
          dueDate: '2024-02-10',
          priority: 'high',
        },
        {
          id: '3',
          type: 'grading',
          course: 'MATH301',
          description: 'Grade assignment submissions',
          dueDate: '2024-02-07',
          priority: 'medium',
          count: 12,
        },
        {
          id: '4',
          type: 'submission',
          course: 'ENG401',
          description: 'Upload assessment criteria',
          dueDate: '2024-02-12',
          priority: 'low',
        },
      ])

      setLoading(false)
    }

    fetchInstructorData()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'grading':
        return <FileText className="h-4 w-4" />
      case 'deadline':
        return <Clock className="h-4 w-4" />
      case 'submission':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Teaching Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              This semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingGrades}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageClassGPA.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              GPA across courses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>
              Courses you are currently teaching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myCourses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{course.code}</h4>
                      <p className="text-sm text-gray-600">{course.name}</p>
                      <p className="text-xs text-gray-500">{course.semester}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{course.enrolledStudents} students</p>
                      <p className="text-xs text-gray-500">
                        Avg: {course.averageGrade.toFixed(1)} GPA
                      </p>
                    </div>
                  </div>

                  {course.pendingGrades > 0 && (
                    <div className="mb-3 p-2 bg-orange-50 rounded flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-700">
                          {course.pendingGrades} pending grades
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        Grade Now
                      </Button>
                    </div>
                  )}

                  {course.nextDeadline && (
                    <div className="mb-3 p-2 bg-blue-50 rounded flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{course.nextDeadline.type}</p>
                        <p className="text-xs text-gray-500">Due: {course.nextDeadline.date}</p>
                      </div>
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link href={`/courses/${course.id}`}>View Course</Link>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link href={`/grading/${course.id}`}>Grade</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/my-courses">View All Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>
              Tasks that require your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start space-x-2">
                      {getTaskIcon(task.type)}
                      <div>
                        <h4 className="font-semibold text-sm">{task.description}</h4>
                        <p className="text-xs text-gray-500">{task.course}</p>
                        {task.count && (
                          <p className="text-xs text-gray-600">{task.count} items</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {task.dueDate}
                      </p>
                    </div>
                  </div>

                  <Button size="sm" className="w-full">
                    Complete Task
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/tasks">View All Tasks</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Create Assessment</CardTitle>
                <CardDescription>Add new assessment</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/assessments/new">Create</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-500">
                <Edit className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Grade Students</CardTitle>
                <CardDescription>Enter student grades</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/grading">Grade Now</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Student Lists</CardTitle>
                <CardDescription>Manage enrolled students</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/students">View Students</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-orange-500">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Class Reports</CardTitle>
                <CardDescription>Generate class analytics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/reports">View Reports</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
