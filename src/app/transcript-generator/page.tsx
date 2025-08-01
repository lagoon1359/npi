'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  GraduationCap,
  Search,
  Info,
  Download,
  FileText,
  AlertTriangle,
  User,
  Clock,
  Shield
} from 'lucide-react'
import TranscriptGeneratorComponent from '@/components/transcripts/TranscriptGeneratorComponent'
import type { StudentExtended, TranscriptType } from '@/lib/types'

export default function TranscriptGeneratorPage() {
  const [studentNumber, setStudentNumber] = useState('')
  const [studentFound, setStudentFound] = useState<(StudentExtended & {
    users?: { full_name: string; email: string }
    programs?: { name: string; code: string; duration_years: number }
    departments?: { name: string; code: string }
  }) | null>(null)
  const [searching, setSearching] = useState(false)
  const [requestType, setRequestType] = useState<'self' | 'admin'>('self')

  // Mock student data for demonstration
  const mockStudents: Array<StudentExtended & {
    users?: { full_name: string; email: string }
    programs?: { name: string; code: string; duration_years: number }
    departments?: { name: string; code: string }
  }> = [
    {
      id: 'student1',
      user_id: 'user1',
      student_number: 'NPI2024DCE001',
      program_id: 'prog1',
      student_type: 'full_time',
      student_category: 'day_scholar',
      year_level: 2,
      enrollment_year: 2024,
      gender: 'male',
      date_of_birth: '2000-05-15',
      biometric_enrolled: true,
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
        code: 'DCE',
        duration_years: 3
      },
      departments: {
        name: 'Department of Engineering',
        code: 'ENG'
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
      biometric_enrolled: true,
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
        code: 'DEE',
        duration_years: 3
      },
      departments: {
        name: 'Department of Engineering',
        code: 'ENG'
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

  const resetProcess = () => {
    setStudentNumber('')
    setStudentFound(null)
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <GraduationCap className="h-8 w-8" />
          <span>Academic Transcript Generator</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate official academic transcripts for students
        </p>
      </div>

      {!studentFound && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Request Type</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to access transcript generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer border-2 transition-colors ${requestType === 'self' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                  onClick={() => setRequestType('self')}
                >
                  <CardContent className="p-4 text-center">
                    <User className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium">Student Self-Service</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Request your own transcript using your student number
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer border-2 transition-colors ${requestType === 'admin' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                  onClick={() => setRequestType('admin')}
                >
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-medium">Administrative Access</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generate transcripts for any student (staff only)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Student Lookup</span>
              </CardTitle>
              <CardDescription>
                {requestType === 'self'
                  ? 'Enter your student number to access your transcript'
                  : 'Enter the student number to generate their transcript'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Official Transcripts:</strong> Generated transcripts are official documents
                  suitable for employment applications, further education, and other official purposes.
                  {requestType === 'admin' && (
                    <span className="block mt-1">
                      <strong>Admin Note:</strong> Only authorized personnel should generate transcripts for other students.
                    </span>
                  )}
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
                    Student number not found. Please check the student number or contact the registrar's office.
                    <br />
                    <strong>Try these demo numbers:</strong> NPI2024DCE001, NPI2024DEE002
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Available Transcript Types:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Semester Transcript</p>
                    <p className="text-muted-foreground">Shows grades for a specific semester</p>
                  </div>
                  <div>
                    <p className="font-medium">Yearly Transcript</p>
                    <p className="text-muted-foreground">Shows cumulative result for academic year</p>
                  </div>
                  <div>
                    <p className="font-medium">Complete Academic Record</p>
                    <p className="text-muted-foreground">All courses in program (full transcript)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {studentFound && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Student Record Found</span>
                </div>
                <Button variant="outline" size="sm" onClick={resetProcess}>
                  Search Another Student
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    <p className="text-sm text-muted-foreground">{studentFound.departments?.name}</p>
                    <Badge variant="outline" className="text-xs">
                      Year {studentFound.year_level}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Academic Status</Label>
                  <div className="mt-2 space-y-1">
                    <p className="font-medium capitalize">{studentFound.student_type.replace('_', ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      Enrolled: {studentFound.enrollment_year}
                    </p>
                    <Badge variant={studentFound.is_active ? "default" : "destructive"} className="text-xs">
                      {studentFound.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Registration</Label>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      {new Date(studentFound.registration_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID Generated: {studentFound.biometric_enrolled ? 'Yes' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <TranscriptGeneratorComponent
            studentData={{
              student: studentFound,
              courses: [
                { code: 'MATH101', title: 'Engineering Mathematics I', credits: 4, grade: 'HD', semester: 'Semester 1', year: 2024 },
                { code: 'PHYS101', title: 'Engineering Physics', credits: 3, grade: 'D', semester: 'Semester 1', year: 2024 },
                { code: 'DRAW101', title: 'Engineering Drawing', credits: 3, grade: 'D', semester: 'Semester 1', year: 2024 },
                { code: 'COMP101', title: 'Computer Applications', credits: 2, grade: 'C', semester: 'Semester 1', year: 2024 },
                { code: 'COMM101', title: 'Communication Skills', credits: 2, grade: 'D', semester: 'Semester 1', year: 2024 },
                { code: 'MATH102', title: 'Engineering Mathematics II', credits: 4, grade: 'D', semester: 'Semester 2', year: 2024 },
                { code: 'MECH101', title: 'Mechanics of Materials', credits: 4, grade: 'C', semester: 'Semester 2', year: 2024 },
                { code: 'SURV101', title: 'Surveying I', credits: 3, grade: 'D', semester: 'Semester 2', year: 2024 },
                { code: 'SOIL101', title: 'Soil Mechanics', credits: 3, grade: 'C', semester: 'Semester 2', year: 2024 },
                { code: 'HYDR101', title: 'Hydraulics', credits: 3, grade: 'D', semester: 'Semester 2', year: 2024 }
              ],
              semesterGPA: 3.2,
              cumulativeGPA: 3.1,
              totalCreditsAttempted: 31,
              totalCreditsEarned: 31,
              academicStanding: 'Good Standing',
              transcriptType: 'yearly',
              generatedDate: new Date().toLocaleDateString(),
              academicYear: '2024'
            }}
            onTranscriptGenerated={(transcriptData) => {
              console.log('Transcript generated:', transcriptData)
            }}
          />
        </div>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Processing Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Official transcripts are generated instantly. Allow 1-2 business days for official verification and digital signature.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Document Format</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Transcripts are generated in PDF format with official formatting, NPI PNG letterhead, and registrar signature.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Usage Rights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Generated transcripts are official documents suitable for employment, university applications, and visa processing.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
