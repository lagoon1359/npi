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
  TrendingUp,
  Building,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar
} from 'lucide-react'
import type { User } from '@/lib/supabase'

interface DepartmentHeadDashboardProps {
  user: User
}

interface DepartmentStats {
  totalInstructors: number
  totalStudents: number
  totalCourses: number
  averageDepartmentGPA: number
  pendingApprovals: number
  activePrograms: number
}

interface DepartmentCourse {
  id: string
  code: string
  name: string
  instructor: string
  enrolledStudents: number
  averageGrade: number
  status: 'active' | 'pending' | 'completed'
  pendingGrades: number
}

interface PendingApproval {
  id: string
  type: 'course_setup' | 'assessment_plan' | 'grade_modification' | 'instructor_assignment'
  title: string
  submittedBy: string
  submittedDate: string
  priority: 'high' | 'medium' | 'low'
  description: string
}

export default function DepartmentHeadDashboard({ user }: DepartmentHeadDashboardProps) {
  const [stats, setStats] = useState<DepartmentStats>({
    totalInstructors: 0,
    totalStudents: 0,
    totalCourses: 0,
    averageDepartmentGPA: 0,
    pendingApprovals: 0,
    activePrograms: 0,
  })
  const [departmentCourses, setDepartmentCourses] = useState<DepartmentCourse[]>([])
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching department head data
    const fetchDepartmentData = async () => {
      // Simulated data - replace with actual API calls
      setStats({
        totalInstructors: 12,
        totalStudents: 385,
        totalCourses: 18,
        averageDepartmentGPA: 2.85,
        pendingApprovals: 5,
        activePrograms: 3,
      })

      setDepartmentCourses([
        {
          id: '1',
          code: 'ENG201',
          name: 'Advanced Engineering Mathematics',
          instructor: 'Dr. James Wilson',
          enrolledStudents: 45,
          averageGrade: 2.9,
          status: 'active',
          pendingGrades: 8,
        },
        {
          id: '2',
          code: 'ENG301',
          name: 'Structural Analysis',
          instructor: 'Prof. Sarah Johnson',
          enrolledStudents: 38,
          averageGrade: 3.1,
          status: 'active',
          pendingGrades: 0,
        },
        {
          id: '3',
          code: 'ENG401',
          name: 'Engineering Project Management',
          instructor: 'Dr. Michael Chen',
          enrolledStudents: 32,
          averageGrade: 2.7,
          status: 'pending',
          pendingGrades: 15,
        },
        {
          id: '4',
          code: 'ENG101',
          name: 'Foundation Engineering',
          instructor: 'Ms. Emily Davis',
          enrolledStudents: 52,
          averageGrade: 2.5,
          status: 'active',
          pendingGrades: 0,
        },
      ])

      setPendingApprovals([
        {
          id: '1',
          type: 'course_setup',
          title: 'New Course: Advanced Thermodynamics',
          submittedBy: 'Dr. Robert Brown',
          submittedDate: '2024-01-25',
          priority: 'high',
          description: 'Request to create new advanced thermodynamics course for year 3 students',
        },
        {
          id: '2',
          type: 'assessment_plan',
          title: 'Assessment Plan Review - ENG301',
          submittedBy: 'Prof. Sarah Johnson',
          submittedDate: '2024-01-23',
          priority: 'medium',
          description: 'Updated assessment weightings for Structural Analysis course',
        },
        {
          id: '3',
          type: 'grade_modification',
          title: 'Grade Modification Request',
          submittedBy: 'Dr. Michael Chen',
          submittedDate: '2024-01-22',
          priority: 'high',
          description: 'Request to modify grades for 3 students due to assessment error',
        },
        {
          id: '4',
          type: 'instructor_assignment',
          title: 'Instructor Assignment - ENG501',
          submittedBy: 'Admin Office',
          submittedDate: '2024-01-20',
          priority: 'medium',
          description: 'Assign instructor for Advanced Materials Engineering',
        },
      ])

      setLoading(false)
    }

    fetchDepartmentData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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

  const getApprovalIcon = (type: string) => {
    switch (type) {
      case 'course_setup':
        return <BookOpen className="h-4 w-4" />
      case 'assessment_plan':
        return <FileText className="h-4 w-4" />
      case 'grade_modification':
        return <AlertTriangle className="h-4 w-4" />
      case 'instructor_assignment':
        return <UserCheck className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all programs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInstructors}</div>
            <p className="text-xs text-muted-foreground">
              Active teaching staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
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
            <CardTitle className="text-sm font-medium">Department GPA</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageDepartmentGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Average across department
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Require your review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePrograms}</div>
            <p className="text-xs text-muted-foreground">
              Department programs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Department Courses</CardTitle>
            <CardDescription>
              Overview of courses in your department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentCourses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{course.code}</h4>
                      <p className="text-sm text-gray-600">{course.name}</p>
                      <p className="text-xs text-gray-500">Instructor: {course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {course.enrolledStudents} students
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Average Grade: {course.averageGrade.toFixed(1)}</span>
                    {course.pendingGrades > 0 && (
                      <span className="text-orange-600">
                        {course.pendingGrades} pending grades
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link href={`/courses/${course.id}`}>View Details</Link>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link href={`/courses/${course.id}/reports`}>Reports</Link>
                    </Button>
                  </div>
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

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              Items requiring your review and approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start space-x-2">
                      {getApprovalIcon(approval.type)}
                      <div>
                        <h4 className="font-semibold text-sm">{approval.title}</h4>
                        <p className="text-xs text-gray-500">
                          By: {approval.submittedBy} • {approval.submittedDate}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {approval.description}
                        </p>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(approval.priority)}>
                      {approval.priority}
                    </Badge>
                  </div>

                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="default" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/approvals">View All Approvals</Link>
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
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Manage Courses</CardTitle>
                <CardDescription>View and manage courses</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/courses">Manage</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Instructors</CardTitle>
                <CardDescription>Manage teaching staff</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/instructors">View Staff</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-500">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Reports</CardTitle>
                <CardDescription>Generate department reports</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/reports">View Reports</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-orange-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Analytics</CardTitle>
                <CardDescription>Department performance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
