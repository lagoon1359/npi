'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Scan,
  Search,
  Info,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  CreditCard
} from 'lucide-react'
import BiometricEnrollmentComponent from '@/components/biometric/BiometricEnrollmentComponent'
import type { StudentExtended } from '@/lib/types'

export default function BiometricEnrollmentPage() {
  const [studentNumber, setStudentNumber] = useState('')
  const [studentFound, setStudentFound] = useState<(StudentExtended & {
    users?: { full_name: string; email: string }
    programs?: { name: string; code: string }
  }) | null>(null)
  const [searching, setSearching] = useState(false)
  const [enrollmentComplete, setEnrollmentComplete] = useState(false)

  // Mock student data for demonstration
  const mockStudents: Array<StudentExtended & {
    users?: { full_name: string; email: string }
    programs?: { name: string; code: string }
  }> = [
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
    },
    {
      id: 'student2',
      user_id: 'user2',
      student_number: 'NPI2024DEE002',
      program_id: 'prog2',
      student_type: 'full_time',
      student_category: 'boarder',
      year_level: 1,
      enrollment_year: 2024,
      gender: 'female',
      date_of_birth: '1999-12-10',
      biometric_enrolled: false,
      registration_date: '2024-01-16',
      is_active: true,
      created_at: '2024-01-16T00:00:00Z',
      updated_at: '2024-01-16T00:00:00Z',
      users: {
        full_name: 'Jane Smith',
        email: 'jane.smith@email.com'
      },
      programs: {
        name: 'Diploma in Electrical Engineering',
        code: 'DEE'
      }
    }
  ]

  const searchStudent = async () => {
    setSearching(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const found = mockStudents.find(s => s.student_number === studentNumber)
      setStudentFound(found || null)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleEnrollmentComplete = (biometricData: any) => {
    setEnrollmentComplete(true)
    console.log('Biometric enrollment completed:', biometricData)
  }

  const resetProcess = () => {
    setStudentNumber('')
    setStudentFound(null)
    setEnrollmentComplete(false)
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <Scan className="h-8 w-8" />
          <span>Biometric Enrollment</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Complete your biometric enrollment for student ID and campus access
        </p>
      </div>

      {!studentFound && !enrollmentComplete && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Student Lookup</span>
            </CardTitle>
            <CardDescription>
              Enter your student number to begin biometric enrollment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Before You Begin:</strong> Ensure you have completed your registration and payment verification.
                You will need your student number and a valid photo ID.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="studentNumber">Student Number</Label>
                <Input
                  id="studentNumber"
                  placeholder="e.g., NPI2024DCE001"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchStudent()}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={searchStudent} disabled={!studentNumber || searching}>
                  <Search className="h-4 w-4 mr-2" />
                  {searching ? 'Searching...' : 'Find Student'}
                </Button>
              </div>
            </div>

            {studentFound === null && studentNumber && !searching && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Student number not found. Please check your student number or contact the registrar's office.
                  <br />
                  <strong>Try these demo numbers:</strong> NPI2024DCE001, NPI2024DEE002
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Enrollment Requirements:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Completed student registration with verified payment</li>
                <li>• Valid student number (provided after registration approval)</li>
                <li>• Access to a device with camera for photo capture</li>
                <li>• Clean, dry fingers for fingerprint scanning</li>
                <li>• Quiet, well-lit environment for best results</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {studentFound && !enrollmentComplete && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Student Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Student Information</Label>
                  <div className="mt-2 space-y-1">
                    <p className="font-bold text-lg">{studentFound.users?.full_name}</p>
                    <p className="text-muted-foreground">{studentFound.student_number}</p>
                    <p className="text-sm">{studentFound.users?.email}</p>
                  </div>
                </div>

                <div>
                  <Label>Program Details</Label>
                  <div className="mt-2 space-y-1">
                    <p className="font-medium">{studentFound.programs?.name}</p>
                    <p className="text-sm text-muted-foreground">Year {studentFound.year_level}</p>
                    <Badge variant="outline" className="text-xs">
                      {studentFound.student_type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Enrollment Status</Label>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      {studentFound.biometric_enrolled ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="text-sm">
                        {studentFound.biometric_enrolled ? 'Already Enrolled' : 'Pending Enrollment'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Registered: {new Date(studentFound.registration_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {studentFound.biometric_enrolled && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    This student has already completed biometric enrollment. If you need to re-enroll,
                    please contact the student services office.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {!studentFound.biometric_enrolled && (
            <BiometricEnrollmentComponent
              student={studentFound}
              onEnrollmentComplete={handleEnrollmentComplete}
            />
          )}
        </div>
      )}

      {enrollmentComplete && (
        <div className="text-center space-y-6">
          <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-800">Enrollment Process Complete!</h2>
            <p className="text-muted-foreground mt-2">
              Your biometric data has been successfully enrolled in the NPI PNG system.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <CreditCard className="h-12 w-12 mx-auto text-blue-600 mb-3" />
                  <h3 className="font-medium">Student ID Card</h3>
                  <p className="text-sm text-muted-foreground">
                    Your student ID card will be printed and available for collection within 2-3 business days.
                  </p>
                </div>

                <div className="text-center">
                  <CreditCard className="h-12 w-12 mx-auto text-green-600 mb-3" />
                  <h3 className="font-medium">Meal Card</h3>
                  <p className="text-sm text-muted-foreground">
                    Your campus meal card will be activated and ready for use at the cafeteria.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              <strong>Collection Instructions:</strong>
              <br />
              Visit the Student Services Office (Building A, Ground Floor) during office hours (8:00 AM - 4:00 PM)
              to collect your physical student ID and meal cards. Bring a valid photo ID for verification.
            </AlertDescription>
          </Alert>

          <Button onClick={resetProcess} variant="outline">
            Enroll Another Student
          </Button>
        </div>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Campus Access</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Your biometric data enables secure access to campus facilities including libraries, labs, and dormitories.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Meal Plan</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Use your meal card at the campus cafeteria. Add credit at the finance office or through mobile money.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Support</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Need help? Contact Student Services at services@npi.pg or visit us during office hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
