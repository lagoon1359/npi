'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Users,
  UserCheck,
  DollarSign,
  Building,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  FileText,
  CreditCard,
  Home,
  UserPlus
} from 'lucide-react'
import PaymentVerificationComponent from '@/components/registration/PaymentVerificationComponent'
import RoomAllocationComponent from '@/components/registration/RoomAllocationComponent'
import BiometricEnrollmentComponent from '@/components/biometric/BiometricEnrollmentComponent'
import TranscriptGeneratorComponent from '@/components/transcripts/TranscriptGeneratorComponent'
import type { StudentDashboardStats, PaymentSummary, StudentExtended } from '@/lib/types'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StudentDashboardStats>({
    totalStudents: 0,
    pendingRegistrations: 0,
    pendingPayments: 0,
    availableRooms: 0,
    activeStudents: 0,
    recentRegistrations: []
  })
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({
    totalCollected: 0,
    totalPending: 0,
    verifiedPayments: 0,
    pendingVerification: 0,
    rejectedPayments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Mock data for demonstration - replace with actual API calls
      const mockStats: StudentDashboardStats = {
        totalStudents: 1247,
        pendingRegistrations: 23,
        pendingPayments: 12,
        availableRooms: 45,
        activeStudents: 1183,
        recentRegistrations: [
          {
            id: 'student1',
            user_id: 'user1',
            student_number: 'NPI2024DCE001',
            program_id: 'prog1',
            student_type: 'full_time',
            student_category: 'day_scholar',
            year_level: 1,
            enrollment_year: 2024,
            gender: 'male',
            date_of_birth: '2000-05-15',
            biometric_enrolled: false,
            registration_date: '2024-01-15',
            is_active: true,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          }
        ]
      }

      const mockPaymentSummary: PaymentSummary = {
        totalCollected: 2840750,
        totalPending: 125400,
        verifiedPayments: 1156,
        pendingVerification: 12,
        rejectedPayments: 3
      }

      setStats(mockStats)
      setPaymentSummary(mockPaymentSummary)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDataUpdate = () => {
    fetchDashboardData()
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading dashboard data...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Registration Management</h1>
        <p className="text-muted-foreground">Comprehensive admin dashboard for NPI PNG</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.recentRegistrations.length}</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Registrations</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Verification</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentSummary.pendingVerification}</div>
            <p className="text-xs text-muted-foreground">
              Receipts to review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableRooms}</div>
            <p className="text-xs text-muted-foreground">
              Accommodation capacity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Financial Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Collected</span>
              <span className="text-lg font-bold text-green-600">
                K{paymentSummary.totalCollected.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pending Collection</span>
              <span className="text-lg font-bold text-yellow-600">
                K{paymentSummary.totalPending.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Verified Payments</span>
              <span className="text-sm">{paymentSummary.verifiedPayments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Rejected Payments</span>
              <span className="text-sm text-red-600">{paymentSummary.rejectedPayments}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Registration Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Students</span>
              <span className="text-lg font-bold">{stats.activeStudents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Full-time Students</span>
              <span className="text-sm">{Math.round(stats.activeStudents * 0.85)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Part-time Students</span>
              <span className="text-sm">{Math.round(stats.activeStudents * 0.15)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Boarders</span>
              <span className="text-sm">{Math.round(stats.activeStudents * 0.4)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Action Items</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.pendingRegistrations > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-center">
                    <span>{stats.pendingRegistrations} students pending registration completion</span>
                    <Button variant="outline" size="sm">Review Registrations</Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {paymentSummary.pendingVerification > 0 && (
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-center">
                    <span>{paymentSummary.pendingVerification} payment receipts require verification</span>
                    <Button variant="outline" size="sm">Verify Payments</Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {stats.availableRooms < 20 && (
              <Alert>
                <Building className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-center">
                    <span>Low room availability: Only {stats.availableRooms} rooms remaining</span>
                    <Button variant="outline" size="sm">Manage Rooms</Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="payments">Payment Verification</TabsTrigger>
          <TabsTrigger value="rooms">Room Allocation</TabsTrigger>
          <TabsTrigger value="biometric">Biometric Enrollment</TabsTrigger>
          <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <PaymentVerificationComponent onPaymentVerified={handleDataUpdate} />
        </TabsContent>

        <TabsContent value="rooms">
          <RoomAllocationComponent onAllocationUpdate={handleDataUpdate} />
        </TabsContent>

        <TabsContent value="biometric" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Biometric Enrollment Management</span>
              </CardTitle>
              <CardDescription>
                Manage student biometric enrollment and ID card generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <UserCheck className="h-4 w-4" />
                  <AlertDescription>
                    Demo biometric enrollment for student John Michael Doe (NPI2024DCE001).
                    In production, this would integrate with actual biometric hardware.
                  </AlertDescription>
                </Alert>

                <BiometricEnrollmentComponent
                  student={{
                    id: 'student1',
                    user_id: 'user1',
                    student_number: 'NPI2024DCE001',
                    program_id: 'prog1',
                    student_type: 'full_time',
                    student_category: 'day_scholar',
                    year_level: 1,
                    enrollment_year: 2024,
                    gender: 'male',
                    date_of_birth: '2000-05-15',
                    biometric_enrolled: false,
                    registration_date: '2024-01-15',
                    is_active: true,
                    created_at: '2024-01-15T00:00:00Z',
                    updated_at: '2024-01-15T00:00:00Z',
                    users: {
                      full_name: 'John Michael Doe',
                      email: 'john.doe@email.com'
                    },
                    programs: {
                      name: 'Diploma in Civil Engineering',
                      code: 'DCE'
                    }
                  }}
                  onEnrollmentComplete={(biometricData) => {
                    console.log('Biometric enrollment completed:', biometricData)
                    handleDataUpdate()
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcripts" className="space-y-4">
          <TranscriptGeneratorComponent
            onTranscriptGenerated={(transcriptData) => {
              console.log('Transcript generated:', transcriptData)
              handleDataUpdate()
            }}
          />
        </TabsContent>

        <TabsContent value="registrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5" />
                <span>Registration Management</span>
              </CardTitle>
              <CardDescription>
                Manage student registrations and enrollment status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Manual Registration Entry</h3>
                    <p className="text-sm text-muted-foreground">
                      Register students who applied offline or at campus
                    </p>
                  </div>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-1" />
                    New Registration
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Biometric Enrollment</h3>
                    <p className="text-sm text-muted-foreground">
                      Schedule and manage biometric data collection
                    </p>
                  </div>
                  <Button variant="outline">
                    <UserCheck className="w-4 h-4 mr-1" />
                    Manage Biometrics
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Student ID Cards</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate and manage student identification cards
                    </p>
                  </div>
                  <Button variant="outline">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Generate IDs
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Meal Cards</h3>
                    <p className="text-sm text-muted-foreground">
                      Issue and manage campus meal cards
                    </p>
                  </div>
                  <Button variant="outline">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Manage Meal Cards
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Reports & Analytics</span>
              </CardTitle>
              <CardDescription>
                Generate reports and view analytics for student registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Daily Registration Report</div>
                    <div className="text-sm text-muted-foreground">
                      Summary of today's registrations and payments
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Payment Reconciliation</div>
                    <div className="text-sm text-muted-foreground">
                      Reconcile online and manual payments
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Room Occupancy Report</div>
                    <div className="text-sm text-muted-foreground">
                      Current accommodation status and availability
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Enrollment Statistics</div>
                    <div className="text-sm text-muted-foreground">
                      Program-wise enrollment and demographics
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Outstanding Fees Report</div>
                    <div className="text-sm text-muted-foreground">
                      Students with pending fee payments
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Transcript Requests</div>
                    <div className="text-sm text-muted-foreground">
                      Generate and manage academic transcripts
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
