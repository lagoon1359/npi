'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  GraduationCap,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Award,
  AlertTriangle
} from 'lucide-react'
import type { User } from '@/lib/supabase'

interface StudentDashboardProps {
  user: User
}

interface StudentStats {
  currentGPA: number
  totalCredits: number
  completedCredits: number
  currentEnrollments: number
  upcomingAssessments: number
  latestGrades: Array<{
    course: string
    assessment: string
    grade: string
    score: number
    maxScore: number
    date: string
  }>
}

interface EnrolledCourse {
  id: string
  code: string
  name: string
  instructor: string
  creditHours: number
  currentGrade: string
  progress: number
  nextAssessment?: {
    name: string
    type: string
    dueDate: string
  }
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const [stats, setStats] = useState<StudentStats>({
    currentGPA: 0,
    totalCredits: 0,
    completedCredits: 0,
    currentEnrollments: 0,
    upcomingAssessments: 0,
    latestGrades: [],
  })
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching student data
    const fetchStudentData = async () => {
      // Simulated data - replace with actual API calls
      setStats({
        currentGPA: 3.45,
        totalCredits: 120,
        completedCredits: 85,
        currentEnrollments: 5,
        upcomingAssessments: 3,
        latestGrades: [
          {
            course: 'ENG201',
            assessment: 'Midterm Exam',
            grade: 'B+',
            score: 78,
            maxScore: 100,
            date: '2024-01-15',
          },
          {
            course: 'MATH301',
            assessment: 'Assignment 2',
            grade: 'A',
            score: 92,
            maxScore: 100,
            date: '2024-01-12',
          },
          {
            course: 'PHYS201',
            assessment: 'Lab Report 3',
            grade: 'B',
            score: 74,
            maxScore: 100,
            date: '2024-01-10',
          },
        ],
      })

      setEnrolledCourses([
        {
          id: '1',
          code: 'ENG201',
          name: 'Advanced Engineering Mathematics',
          instructor: 'Dr. James Wilson',
          creditHours: 4,
          currentGrade: 'B+',
          progress: 65,
          nextAssessment: {
            name: 'Final Exam',
            type: 'Final',
            dueDate: '2024-02-15',
          },
        },
        {
          id: '2',
          code: 'MATH301',
          name: 'Differential Equations',
          instructor: 'Prof. Sarah Johnson',
          creditHours: 3,
          currentGrade: 'A',
          progress: 70,
          nextAssessment: {
            name: 'Project Presentation',
            type: 'Project',
            dueDate: '2024-02-10',
          },
        },
        {
          id: '3',
          code: 'PHYS201',
          name: 'Physics for Engineers',
          instructor: 'Dr. Michael Chen',
          creditHours: 4,
          currentGrade: 'B',
          progress: 60,
          nextAssessment: {
            name: 'Practical Exam',
            type: 'Practical',
            dueDate: '2024-02-08',
          },
        },
        {
          id: '4',
          code: 'CS101',
          name: 'Introduction to Programming',
          instructor: 'Ms. Emily Davis',
          creditHours: 3,
          currentGrade: 'A-',
          progress: 75,
        },
        {
          id: '5',
          code: 'ENG101',
          name: 'Technical Communication',
          instructor: 'Dr. Robert Brown',
          creditHours: 2,
          currentGrade: 'B+',
          progress: 80,
        },
      ])

      setLoading(false)
    }

    fetchStudentData()
  }, [])

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
      case 'A+':
        return 'bg-green-100 text-green-800'
      case 'A-':
      case 'B+':
        return 'bg-blue-100 text-blue-800'
      case 'B':
      case 'B-':
        return 'bg-yellow-100 text-yellow-800'
      case 'C':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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

  const progressPercentage = (stats.completedCredits / stats.totalCredits) * 100

  return (
    <div className="space-y-8">
      {/* Academic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Out of 4.00
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedCredits} of {stats.totalCredits} credits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              This semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Assessments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAssessments}</div>
            <p className="text-xs text-muted-foreground">
              Next 2 weeks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Progress</CardTitle>
          <CardDescription>
            Your progress towards graduation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Credits Completed</span>
              <span>{stats.completedCredits} / {stats.totalCredits}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats.totalCredits - stats.completedCredits} credits remaining to graduate
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Current Courses</CardTitle>
            <CardDescription>
              Your enrolled courses this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{course.code}</h4>
                      <p className="text-sm text-gray-600">{course.name}</p>
                      <p className="text-xs text-gray-500">{course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getGradeColor(course.currentGrade)}>
                        {course.currentGrade}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {course.creditHours} credits
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-1" />
                  </div>

                  {course.nextAssessment && (
                    <div className="mt-3 p-2 bg-gray-50 rounded flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{course.nextAssessment.name}</p>
                        <p className="text-xs text-gray-500">{course.nextAssessment.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Due</p>
                        <p className="text-sm font-medium">{course.nextAssessment.dueDate}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/courses">View All Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
            <CardDescription>
              Your latest assessment results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.latestGrades.map((grade, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{grade.course}</h4>
                      <p className="text-sm text-gray-600">{grade.assessment}</p>
                      <p className="text-xs text-gray-500">{grade.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getGradeColor(grade.grade)}>
                        {grade.grade}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {grade.score}/{grade.maxScore}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/results">View All Results</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/transcript">Download Transcript</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">View Results</CardTitle>
                <CardDescription>Check your grades and feedback</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/results">View Results</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-500">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Transcript</CardTitle>
                <CardDescription>Download official transcript</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/transcript">Get Transcript</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-500">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Schedule</CardTitle>
                <CardDescription>View class and exam schedule</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/schedule">View Schedule</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
