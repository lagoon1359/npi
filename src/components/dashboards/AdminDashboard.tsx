'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Building,
  BookOpen,
  GraduationCap,
  FileText,
  TrendingUp,
  Calendar,
  Settings,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import type { User } from '@/lib/supabase'

interface AdminDashboardProps {
  user: User
}

interface DashboardStats {
  totalStudents: number
  totalInstructors: number
  totalDepartments: number
  totalCourses: number
  activeEnrollments: number
  pendingGrades: number
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalInstructors: 0,
    totalDepartments: 0,
    totalCourses: 0,
    activeEnrollments: 0,
    pendingGrades: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching dashboard statistics
    // In a real app, this would fetch from Supabase
    const fetchStats = async () => {
      // Simulated data - replace with actual API calls
      setStats({
        totalStudents: 1250,
        totalInstructors: 85,
        totalDepartments: 3,
        totalCourses: 45,
        activeEnrollments: 3200,
        pendingGrades: 127,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  const quickActions = [
    {
      title: 'Manage Departments',
      description: 'Create and manage academic departments',
      href: '/departments',
      icon: Building,
      color: 'bg-blue-500',
    },
    {
      title: 'Manage Users',
      description: 'Add and manage system users',
      href: '/users',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Academic Years',
      description: 'Set up academic years and semesters',
      href: '/academic-years',
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      title: 'System Reports',
      description: 'Generate comprehensive reports',
      href: '/reports',
      icon: FileText,
      color: 'bg-orange-500',
    },
    {
      title: 'System Settings',
      description: 'Configure system parameters',
      href: '/settings',
      icon: Settings,
      color: 'bg-gray-500',
    },
  ]

  const systemAlerts = [
    {
      type: 'warning',
      message: 'Semester grades deadline is in 5 days',
      action: 'View Details',
      href: '/grading-deadlines',
    },
    {
      type: 'info',
      message: 'New academic year setup required',
      action: 'Set Up',
      href: '/academic-years/new',
    },
    {
      type: 'success',
      message: 'Database backup completed successfully',
      action: 'View Logs',
      href: '/system-logs',
    },
  ]

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
      {/* System Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInstructors}</div>
            <p className="text-xs text-muted-foreground">
              +3 new this semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDepartments}</div>
            <p className="text-xs text-muted-foreground">
              Engineering, Business, Sciences
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
              Across all departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEnrollments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingGrades}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>
            Important notifications and system status updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {alert.type === 'warning' && (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  {alert.type === 'info' && (
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                  )}
                  {alert.type === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <span className="text-sm">{alert.message}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={alert.href}>{alert.action}</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={action.href}>Access</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
