'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  FileText,
  Download,
  Printer,
  GraduationCap,
  CheckCircle,
  Calendar,
  User,
  Building,
  Award,
  Stamp
} from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { StudentExtended, TranscriptExtended, TranscriptType } from '@/lib/types'

interface Course {
  code: string
  title: string
  credits: number
  grade: string
  semester: string
  year: number
}

interface TranscriptData {
  student: StudentExtended & {
    users?: { full_name: string; email: string }
    programs?: { name: string; code: string; duration_years: number }
    departments?: { name: string; code: string }
  }
  courses: Course[]
  semesterGPA: number
  cumulativeGPA: number
  totalCreditsAttempted: number
  totalCreditsEarned: number
  academicStanding: string
  transcriptType: TranscriptType
  generatedDate: string
  academicYear: string
}

interface TranscriptGeneratorProps {
  studentData?: TranscriptData
  onTranscriptGenerated?: (transcriptData: TranscriptExtended) => void
}

export default function TranscriptGeneratorComponent({
  studentData,
  onTranscriptGenerated
}: TranscriptGeneratorProps) {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedType, setSelectedType] = useState<TranscriptType>('semester')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [generating, setGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const transcriptRef = useRef<HTMLDivElement>(null)

  // Mock data for demonstration
  const mockTranscriptData: TranscriptData = {
    student: {
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
  }

  const gradePoints: Record<string, number> = {
    'HD': 4.0,
    'D': 3.0,
    'C': 2.0,
    'P': 1.0,
    'F': 0.0,
    'W': 0.0,
    'I': 0.0
  }

  const calculateGPA = (courses: Course[]) => {
    const totalGradePoints = courses.reduce((sum, course) => {
      return sum + (gradePoints[course.grade] || 0) * course.credits
    }, 0)
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
    return totalCredits > 0 ? (totalGradePoints / totalCredits) : 0
  }

  const generatePDF = async () => {
    if (!transcriptRef.current) return

    setGenerating(true)
    try {
      const canvas = await html2canvas(transcriptRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const transcriptData = studentData || mockTranscriptData
      const fileName = `${transcriptData.student.student_number}_${transcriptData.transcriptType}_transcript_${transcriptData.generatedDate.replace(/\//g, '-')}.pdf`

      pdf.save(fileName)

      // Simulate saving to database
      const transcriptRecord: Partial<TranscriptExtended> = {
        student_id: transcriptData.student.id,
        transcript_type: transcriptData.transcriptType,
        courses_data: transcriptData.courses,
        semester_gpa: transcriptData.semesterGPA,
        cumulative_gpa: transcriptData.cumulativeGPA,
        total_credits_attempted: transcriptData.totalCreditsAttempted,
        total_credits_earned: transcriptData.totalCreditsEarned,
        academic_standing: transcriptData.academicStanding,
        generated_by: 'current-user-id', // Replace with actual user ID
        generated_date: new Date().toISOString().split('T')[0],
        is_official: true,
        created_at: new Date().toISOString()
      }

      onTranscriptGenerated?.(transcriptRecord as TranscriptExtended)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setGenerating(false)
    }
  }

  const printTranscript = () => {
    window.print()
  }

  const currentData = studentData || mockTranscriptData

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>Academic Transcript Generator</span>
          </CardTitle>
          <CardDescription>
            Generate official academic transcripts for students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!studentData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="student">Select Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose student..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student1">John Michael Doe (NPI2024DCE001)</SelectItem>
                    <SelectItem value="student2">Jane Smith (NPI2024DEE002)</SelectItem>
                    <SelectItem value="student3">Michael Johnson (NPI2024DCE003)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Transcript Type</Label>
                <Select value={selectedType} onValueChange={(value) => setSelectedType(value as TranscriptType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semester">Semester Transcript</SelectItem>
                    <SelectItem value="yearly">Yearly Transcript</SelectItem>
                    <SelectItem value="full">Complete Academic Record</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="period">Academic Period</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">Academic Year 2024</SelectItem>
                    <SelectItem value="2023">Academic Year 2023</SelectItem>
                    <SelectItem value="2024-1">2024 Semester 1</SelectItem>
                    <SelectItem value="2024-2">2024 Semester 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button onClick={() => setPreviewMode(!previewMode)} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              {previewMode ? 'Hide Preview' : 'Preview Transcript'}
            </Button>
            <Button onClick={generatePDF} disabled={generating}>
              <Download className="h-4 w-4 mr-2" />
              {generating ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button onClick={printTranscript} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </CardContent>
      </Card>

      {previewMode && (
        <Card>
          <CardContent className="p-0">
            <div ref={transcriptRef} className="bg-white p-8 min-h-[800px]" style={{ fontFamily: 'Times New Roman, serif' }}>
              {/* Official Header */}
              <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
                <div className="flex justify-center mb-4">
                  <GraduationCap className="h-16 w-16 text-gray-800" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  NATIONAL POLYTECHNIC INSTITUTE OF PAPUA NEW GUINEA
                </h1>
                <p className="text-lg text-gray-600 mb-2">Technical and Vocational Education Training System</p>
                <p className="text-gray-600">P.O. Box 793, Lae 411, Morobe Province, Papua New Guinea</p>
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-gray-800">OFFICIAL ACADEMIC TRANSCRIPT</h2>
                  <p className="text-sm text-gray-600 capitalize">{currentData.transcriptType} Record</p>
                </div>
              </div>

              {/* Student Information */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">STUDENT INFORMATION</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Name:</span>
                      <span className="col-span-2 font-bold">{currentData.student.users?.full_name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Student ID:</span>
                      <span className="col-span-2">{currentData.student.student_number}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Date of Birth:</span>
                      <span className="col-span-2">{new Date(currentData.student.date_of_birth).toLocaleDateString()}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Gender:</span>
                      <span className="col-span-2 capitalize">{currentData.student.gender}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">PROGRAM INFORMATION</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Program:</span>
                      <span className="col-span-2 font-bold">{currentData.student.programs?.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Department:</span>
                      <span className="col-span-2">{currentData.student.departments?.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Enrollment:</span>
                      <span className="col-span-2">{currentData.student.enrollment_year}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-medium">Status:</span>
                      <span className="col-span-2 capitalize">{currentData.student.student_type.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Record */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">ACADEMIC RECORD - {currentData.academicYear}</h3>

                <table className="w-full border-collapse border border-gray-400 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 px-2 py-1 text-left">Course Code</th>
                      <th className="border border-gray-400 px-2 py-1 text-left">Course Title</th>
                      <th className="border border-gray-400 px-2 py-1 text-center">Credits</th>
                      <th className="border border-gray-400 px-2 py-1 text-center">Grade</th>
                      <th className="border border-gray-400 px-2 py-1 text-center">Points</th>
                      <th className="border border-gray-400 px-2 py-1 text-left">Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.courses.map((course, index) => (
                      <tr key={index}>
                        <td className="border border-gray-400 px-2 py-1">{course.code}</td>
                        <td className="border border-gray-400 px-2 py-1">{course.title}</td>
                        <td className="border border-gray-400 px-2 py-1 text-center">{course.credits}</td>
                        <td className="border border-gray-400 px-2 py-1 text-center font-bold">{course.grade}</td>
                        <td className="border border-gray-400 px-2 py-1 text-center">
                          {(gradePoints[course.grade] * course.credits).toFixed(1)}
                        </td>
                        <td className="border border-gray-400 px-2 py-1">{course.semester} {course.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* GPA Summary */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">GRADE POINT AVERAGE</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Semester GPA:</span>
                      <span className="font-bold">{currentData.semesterGPA.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Cumulative GPA:</span>
                      <span className="font-bold">{currentData.cumulativeGPA.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Academic Standing:</span>
                      <span className="font-bold">{currentData.academicStanding}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">CREDIT SUMMARY</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Credits Attempted:</span>
                      <span className="font-bold">{currentData.totalCreditsAttempted}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Credits Earned:</span>
                      <span className="font-bold">{currentData.totalCreditsEarned}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Year Level:</span>
                      <span className="font-bold">Year {currentData.student.year_level}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grading Scale */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">GRADING SCALE</h3>
                <div className="grid grid-cols-6 gap-4 text-xs">
                  <div><strong>HD (4.0):</strong> High Distinction (85-100%)</div>
                  <div><strong>D (3.0):</strong> Distinction (75-84%)</div>
                  <div><strong>C (2.0):</strong> Credit (65-74%)</div>
                  <div><strong>P (1.0):</strong> Pass (50-64%)</div>
                  <div><strong>F (0.0):</strong> Fail (0-49%)</div>
                  <div><strong>W/I:</strong> Withdrawn/Incomplete</div>
                </div>
              </div>

              {/* Official Footer */}
              <div className="border-t-2 border-gray-800 pt-6 mt-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      This is an official transcript issued by the National Polytechnic Institute of Papua New Guinea.
                      This document contains a true and complete record of the student's academic achievement.
                    </p>
                    <div className="text-xs text-gray-500">
                      <p>Generated: {currentData.generatedDate}</p>
                      <p>Transcript Type: {currentData.transcriptType.charAt(0).toUpperCase() + currentData.transcriptType.slice(1)}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="border border-gray-400 p-4 mb-2">
                      <Stamp className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-600">OFFICIAL SEAL</p>
                    </div>
                    <div className="border-t border-gray-400 pt-2">
                      <p className="text-xs font-bold">REGISTRAR</p>
                      <p className="text-xs">National Polytechnic Institute of PNG</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <Award className="h-4 w-4" />
        <AlertDescription>
          <strong>Official Document:</strong> This transcript is generated with official formatting and can be used for
          employment, further education applications, and other official purposes.
        </AlertDescription>
      </Alert>
    </div>
  )
}
