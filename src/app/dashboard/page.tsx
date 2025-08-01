'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminDashboard from '@/components/dashboards/AdminDashboard'
import DepartmentHeadDashboard from '@/components/dashboards/DepartmentHeadDashboard'
import InstructorDashboard from '@/components/dashboards/InstructorDashboard'
import StudentDashboard from '@/components/dashboards/StudentDashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard user={user} />
      case 'department_head':
        return <DepartmentHeadDashboard user={user} />
      case 'instructor':
      case 'tutor':
        return <InstructorDashboard user={user} />
      case 'student':
        return <StudentDashboard user={user} />
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                Your account role is not recognized. Please contact the administrator.
              </CardDescription>
            </CardHeader>
          </Card>
        )
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.full_name}
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your dashboard
        </p>
      </div>

      {renderDashboard()}
    </div>
  )
}
