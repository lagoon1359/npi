'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  CheckIcon, XIcon, ClockIcon, AlertTriangleIcon, EyeIcon,
  ShieldCheckIcon, UserCheckIcon, GraduationCapIcon, AlertCircleIcon
} from 'lucide-react'
import { cn } from "@/lib/utils"
import { assessmentService } from '@/lib/services/assessments'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface GradeModerationItem {
  id: string
  student_name: string
  student_number: string
  assessment_name: string
  course_code: string
  course_name: string
  instructor_name: string
  score: number
  max_score: number
  percentage: number
  comments: string
  graded_date: string
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  moderation_comments?: string
  flag_reason?: string
}

interface ModerationStats {
  total_pending: number
  total_approved: number
  total_rejected: number
  total_flagged: number
  courses_with_pending: number
  instructors_with_pending: number
}

const GradeModerationPage = () => {
  const { user } = useAuth()
  const [moderationItems, setModerationItems] = useState<GradeModerationItem[]>([])
  const [stats, setStats] = useState<ModerationStats>({
    total_pending: 0,
    total_approved: 0,
    total_rejected: 0,
    total_flagged: 0,
    courses_with_pending: 0,
    instructors_with_pending: 0
  })
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedInstructor, setSelectedInstructor] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<GradeModerationItem | null>(null)
  const [moderationDialog, setModerationDialog] = useState(false)
  const [moderationAction, setModerationAction] = useState<'approve' | 'reject' | 'flag' | null>(null)
  const [moderationComments, setModerationComments] = useState('')
  const [flagReason, setFlagReason] = useState('')
  const [courses, setCourses] = useState<any[]>([])
  const [instructors, setInstructors] = useState<any[]>([])

  useEffect(() => {
    const loadModerationData = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!user || (user.role !== 'admin' && user.role !== 'department_head')) {
          setError('Access denied. Only administrators and department heads can access this page.')
          return
        }

        // Get user's department if they're a department head
        let departmentId: string | null = null
        if (user.role === 'department_head') {
          const { data: deptData } = await supabase
            .from('departments')
            .select('id')
            .eq('head_id', user.id)
            .single()

          if (deptData) {
            departmentId = deptData.id
          }
        }

        // Load grades pending moderation
        let query = supabase
          .from('student_assessments')
          .select(`
            id,
            score,
            comments,
            graded_date,
            is_moderated,
            moderated_by,
            moderated_date,
            students!inner(
              student_number,
              users!inner(full_name)
            ),
            assessment_definitions!inner(
              name,
              max_score,
              courses!inner(
                code,
                name,
                department_id,
                course_instructors!inner(
                  users!inner(full_name)
                )
              )
            )
          `)
          .not('score', 'is', null)

        // Filter by department if user is department head
        if (departmentId) {
          query = query.eq('assessment_definitions.courses.department_id', departmentId)
        }

        const { data: gradesData, error: gradesError } = await query

        if (gradesError) throw gradesError

        // Transform data
        const transformedGrades = (gradesData || []).map((grade: any) => {
          const percentage = (grade.score / grade.assessment_definitions.max_score) * 100
          return {
            id: grade.id,
            student_name: grade.students.users.full_name,
            student_number: grade.students.student_number,
            assessment_name: grade.assessment_definitions.name,
            course_code: grade.assessment_definitions.courses.code,
            course_name: grade.assessment_definitions.courses.name,
            instructor_name: grade.assessment_definitions.courses.course_instructors?.[0]?.users?.full_name || 'Unknown',
            score: grade.score,
            max_score: grade.assessment_definitions.max_score,
            percentage,
            comments: grade.comments || '',
            graded_date: grade.graded_date,
            status: grade.is_moderated ?
              (percentage < 50 ? 'flagged' : 'approved') :
              (percentage < 30 || percentage > 95 ? 'flagged' : 'pending'),
            moderation_comments: '',
            flag_reason: percentage < 30 ? 'Extremely low score' :
                        percentage > 95 ? 'Extremely high score' :
                        percentage < 50 ? 'Below passing grade' : undefined
          }
        })

        setModerationItems(transformedGrades)

        // Calculate stats
        const pending = transformedGrades.filter(g => g.status === 'pending').length
        const approved = transformedGrades.filter(g => g.status === 'approved').length
        const rejected = transformedGrades.filter(g => g.status === 'rejected').length
        const flagged = transformedGrades.filter(g => g.status === 'flagged').length

        const uniqueCourses = new Set(transformedGrades.filter(g => g.status === 'pending').map(g => g.course_code))
        const uniqueInstructors = new Set(transformedGrades.filter(g => g.status === 'pending').map(g => g.instructor_name))

        setStats({
          total_pending: pending,
          total_approved: approved,
          total_rejected: rejected,
          total_flagged: flagged,
          courses_with_pending: uniqueCourses.size,
          instructors_with_pending: uniqueInstructors.size
        })

        // Load courses and instructors for filters
        const allCourses = [...new Set(transformedGrades.map(g => ({ code: g.course_code, name: g.course_name })))]
        const allInstructors = [...new Set(transformedGrades.map(g => g.instructor_name))]

        setCourses(allCourses)
        setInstructors(allInstructors)

      } catch (err) {
        console.error('Error loading moderation data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load moderation data')
      } finally {
        setLoading(false)
      }
    }

    loadModerationData()
  }, [user])

  const filteredItems = moderationItems.filter(item => {
    const matchesSearch = item.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.student_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.assessment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.course_code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCourse = selectedCourse === '' || item.course_code === selectedCourse
    const matchesInstructor = selectedInstructor === '' || item.instructor_name === selectedInstructor
    const matchesStatus = selectedStatus === '' || item.status === selectedStatus

    return matchesSearch && matchesCourse && matchesInstructor && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'flagged': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-4 h-4" />
      case 'approved': return <CheckIcon className="w-4 h-4" />
      case 'rejected': return <XIcon className="w-4 h-4" />
      case 'flagged': return <AlertTriangleIcon className="w-4 h-4" />
      default: return <ClockIcon className="w-4 h-4" />
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 70) return 'text-blue-600'
    if (percentage >= 60) return 'text-yellow-600'
    if (percentage >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const handleModerationAction = async () => {
    if (!selectedItem || !moderationAction || !user) return

    try {
      setError(null)

      const updateData: any = {
        is_moderated: true,
        moderated_by: user.id,
        moderated_date: new Date().toISOString()
      }

      // Update the item in the database
      const { error: updateError } = await supabase
        .from('student_assessments')
        .update(updateData)
        .eq('id', selectedItem.id)

      if (updateError) throw updateError

      // Update local state
      setModerationItems(prev => prev.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              status: moderationAction,
              moderation_comments: moderationComments,
              flag_reason: moderationAction === 'flag' ? flagReason : undefined
            }
          : item
      ))

      // Update stats
      setStats(prev => ({
        ...prev,
        total_pending: prev.total_pending - (selectedItem.status === 'pending' ? 1 : 0),
        [`total_${moderationAction}ed` as keyof ModerationStats]: (prev as any)[`total_${moderationAction}ed`] + 1
      }))

      // Close dialog and reset
      setModerationDialog(false)
      setSelectedItem(null)
      setModerationAction(null)
      setModerationComments('')
      setFlagReason('')

    } catch (err) {
      console.error('Error processing moderation action:', err)
      setError(err instanceof Error ? err.message : 'Failed to process moderation action')
    }
  }

  const openModerationDialog = (item: GradeModerationItem, action: 'approve' | 'reject' | 'flag') => {
    setSelectedItem(item)
    setModerationAction(action)
    setModerationDialog(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading grade moderation data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircleIcon className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Access Error</h2>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grade Moderation</h1>
          <p className="text-gray-600">Review and approve grades submitted by instructors</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <ShieldCheckIcon className="w-4 h-4 mr-1" />
            {user?.role === 'admin' ? 'Administrator' : 'Department Head'}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.total_pending}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.total_approved}</p>
              </div>
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-orange-600">{stats.total_flagged}</p>
              </div>
              <AlertTriangleIcon className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.total_rejected}</p>
              </div>
              <XIcon className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-blue-600">{stats.courses_with_pending}</p>
              </div>
              <GraduationCapIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Instructors</p>
                <p className="text-2xl font-bold text-purple-600">{stats.instructors_with_pending}</p>
              </div>
              <UserCheckIcon className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search students, assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.code} value={course.code}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by instructor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Instructors</SelectItem>
                {instructors.map((instructor) => (
                  <SelectItem key={instructor} value={instructor}>
                    {instructor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Reviews</CardTitle>
          <CardDescription>
            Review and moderate grades submitted by instructors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{item.student_name}</p>
                      <p className="text-sm text-gray-500">{item.student_number}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{item.assessment_name}</p>
                      <p className="text-sm text-gray-500">
                        Graded: {new Date(item.graded_date).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{item.course_code}</p>
                      <p className="text-sm text-gray-600">{item.course_name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900">{item.instructor_name}</TableCell>
                  <TableCell>
                    <div>
                      <p className={cn("font-bold", getScoreColor(item.percentage))}>
                        {item.score}/{item.max_score}
                      </p>
                      <p className={cn("text-sm", getScoreColor(item.percentage))}>
                        {item.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize", getStatusColor(item.status))}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status}</span>
                    </Badge>
                    {item.flag_reason && (
                      <p className="text-xs text-orange-600 mt-1">{item.flag_reason}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedItem(item)}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                      {item.status === 'pending' || item.status === 'flagged' ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => openModerationDialog(item, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => openModerationDialog(item, 'reject')}
                            variant="destructive"
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => openModerationDialog(item, 'flag')}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <AlertTriangleIcon className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {item.status === 'approved' ? 'Approved' :
                           item.status === 'rejected' ? 'Rejected' : 'Flagged'}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Moderation Dialog */}
      <Dialog open={moderationDialog} onOpenChange={setModerationDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {moderationAction === 'approve' ? 'Approve Grade' :
               moderationAction === 'reject' ? 'Reject Grade' : 'Flag Grade'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <>Review grade for {selectedItem.student_name} - {selectedItem.assessment_name}</>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student</Label>
                  <p className="font-medium">{selectedItem.student_name}</p>
                  <p className="text-sm text-gray-600">{selectedItem.student_number}</p>
                </div>
                <div>
                  <Label>Score</Label>
                  <p className={cn("text-lg font-bold", getScoreColor(selectedItem.percentage))}>
                    {selectedItem.score}/{selectedItem.max_score} ({selectedItem.percentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <Label>Instructor Comments</Label>
                <div className="p-3 bg-gray-50 rounded mt-1">
                  <p className="text-sm">{selectedItem.comments || 'No comments provided'}</p>
                </div>
              </div>
              <div>
                <Label>Moderation Comments</Label>
                <Textarea
                  value={moderationComments}
                  onChange={(e) => setModerationComments(e.target.value)}
                  placeholder="Add your review comments..."
                  rows={3}
                />
              </div>
              {moderationAction === 'flag' && (
                <div>
                  <Label>Flag Reason</Label>
                  <Select value={flagReason} onValueChange={setFlagReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason for flagging" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score_too_high">Score unusually high</SelectItem>
                      <SelectItem value="score_too_low">Score unusually low</SelectItem>
                      <SelectItem value="insufficient_justification">Insufficient justification</SelectItem>
                      <SelectItem value="grading_inconsistency">Grading inconsistency</SelectItem>
                      <SelectItem value="requires_review">Requires further review</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setModerationDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleModerationAction}
                  className={
                    moderationAction === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                    moderationAction === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                    'bg-orange-600 hover:bg-orange-700'
                  }
                >
                  {moderationAction === 'approve' ? 'Approve Grade' :
                   moderationAction === 'reject' ? 'Reject Grade' : 'Flag for Review'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GradeModerationPage
