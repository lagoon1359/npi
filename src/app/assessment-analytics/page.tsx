'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3Icon, TrendingUpIcon, TrendingDownIcon, UsersIcon,
  BookOpenIcon, AlertTriangleIcon, CheckCircleIcon, DownloadIcon,
  GraduationCapIcon, PieChartIcon, FileTextIcon
} from 'lucide-react'
import { cn } from "@/lib/utils"

interface AnalyticsData {
  overview: {
    total_assessments: number
    total_students: number
    average_completion_rate: number
    average_score: number
    pending_grades: number
    courses_with_assessments: number
  }
  performance_distribution: {
    grade: string
    count: number
    percentage: number
  }[]
  course_performance: {
    course_id: string
    course_name: string
    course_code: string
    total_assessments: number
    avg_score: number
    completion_rate: number
    pass_rate: number
    instructor_name: string
  }[]
  assessment_trends: {
    month: string
    avg_score: number
    completion_rate: number
  }[]
  instructor_performance: {
    instructor_id: string
    instructor_name: string
    courses_count: number
    avg_score: number
    grading_efficiency: number
    student_satisfaction: number
  }[]
}

const AssessmentAnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current_semester')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockAnalyticsData: AnalyticsData = {
      overview: {
        total_assessments: 156,
        total_students: 420,
        average_completion_rate: 87.5,
        average_score: 76.3,
        pending_grades: 23,
        courses_with_assessments: 12
      },
      performance_distribution: [
        { grade: 'HD (80-100%)', count: 45, percentage: 25.8 },
        { grade: 'D (70-79%)', count: 52, percentage: 29.9 },
        { grade: 'C (60-69%)', count: 38, percentage: 21.8 },
        { grade: 'P (50-59%)', count: 28, percentage: 16.1 },
        { grade: 'F (0-49%)', count: 11, percentage: 6.3 }
      ],
      course_performance: [
        {
          course_id: '1',
          course_name: 'Engineering Mathematics I',
          course_code: 'MATH101',
          total_assessments: 8,
          avg_score: 78.5,
          completion_rate: 92.3,
          pass_rate: 88.9,
          instructor_name: 'Dr. James Parkop'
        },
        {
          course_id: '2',
          course_name: 'Computer Programming',
          course_code: 'COMP101',
          total_assessments: 12,
          avg_score: 82.1,
          completion_rate: 95.2,
          pass_rate: 91.7,
          instructor_name: 'Ms. Mary Tokala'
        },
        {
          course_id: '3',
          course_name: 'Technical Drawing',
          course_code: 'DRAW101',
          total_assessments: 6,
          avg_score: 71.8,
          completion_rate: 78.6,
          pass_rate: 75.0,
          instructor_name: 'Mr. Peter Namaliu'
        }
      ],
      assessment_trends: [
        { month: 'Jan', avg_score: 74.2, completion_rate: 85.1 },
        { month: 'Feb', avg_score: 76.8, completion_rate: 87.3 },
        { month: 'Mar', avg_score: 78.5, completion_rate: 89.2 },
        { month: 'Apr', avg_score: 75.9, completion_rate: 86.7 },
        { month: 'May', avg_score: 79.1, completion_rate: 91.4 }
      ],
      instructor_performance: [
        {
          instructor_id: '1',
          instructor_name: 'Dr. James Parkop',
          courses_count: 2,
          avg_score: 78.5,
          grading_efficiency: 95.2,
          student_satisfaction: 4.6
        },
        {
          instructor_id: '2',
          instructor_name: 'Ms. Mary Tokala',
          courses_count: 3,
          avg_score: 82.1,
          grading_efficiency: 98.7,
          student_satisfaction: 4.8
        },
        {
          instructor_id: '3',
          instructor_name: 'Mr. Peter Namaliu',
          courses_count: 1,
          avg_score: 71.8,
          grading_efficiency: 87.3,
          student_satisfaction: 4.2
        }
      ]
    }

    setAnalyticsData(mockAnalyticsData)
  }, [selectedPeriod, selectedDepartment])

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGradeColor = (grade: string) => {
    if (grade.includes('HD')) return 'bg-green-100 text-green-800'
    if (grade.includes('D')) return 'bg-blue-100 text-blue-800'
    if (grade.includes('C')) return 'bg-yellow-100 text-yellow-800'
    if (grade.includes('P')) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  if (!analyticsData) {
    return <div>Loading analytics...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assessment Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into student performance and assessment effectiveness</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_semester">Current Semester</SelectItem>
              <SelectItem value="last_semester">Last Semester</SelectItem>
              <SelectItem value="academic_year">Academic Year</SelectItem>
              <SelectItem value="all_time">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="ict">ICT</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.total_assessments}</p>
              </div>
              <FileTextIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.total_students}</p>
              </div>
              <UsersIcon className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className={cn("text-2xl font-bold", getPerformanceColor(analyticsData.overview.average_score))}>
                  {analyticsData.overview.average_score.toFixed(1)}%
                </p>
              </div>
              <TrendingUpIcon className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-600">{analyticsData.overview.average_completion_rate.toFixed(1)}%</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Grades</p>
                <p className="text-2xl font-bold text-orange-600">{analyticsData.overview.pending_grades}</p>
              </div>
              <AlertTriangleIcon className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.courses_with_assessments}</p>
              </div>
              <BookOpenIcon className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Course Performance</TabsTrigger>
          <TabsTrigger value="instructors">Instructor Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Grade Distribution
                </CardTitle>
                <CardDescription>Distribution of final grades across all assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performance_distribution.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge className={getGradeColor(item.grade)}>{item.grade}</Badge>
                        <span className="text-sm font-medium">{item.count} students ({item.percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3Icon className="w-5 h-5" />
                  Performance Insights
                </CardTitle>
                <CardDescription>Key performance indicators and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Strong Performance</h4>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      55.7% of students achieved distinction level or higher (70%+)
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Areas for Improvement</h4>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      6.3% of students are failing. Consider additional support programs.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUpIcon className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-800">Positive Trend</h4>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Average scores have improved by 2.3% compared to last semester
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Performance Analysis</CardTitle>
              <CardDescription>Detailed performance metrics for each course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.course_performance.map((course) => (
                  <div key={course.course_id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{course.course_code} - {course.course_name}</h3>
                        <p className="text-sm text-gray-600">Instructor: {course.instructor_name}</p>
                      </div>
                      <Badge variant="outline">{course.total_assessments} assessments</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Average Score</h4>
                        <p className={cn("text-2xl font-bold", getPerformanceColor(course.avg_score))}>
                          {course.avg_score.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Completion Rate</h4>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-blue-600">{course.completion_rate.toFixed(1)}%</p>
                          <Progress value={course.completion_rate} className="h-2" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Pass Rate</h4>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-green-600">{course.pass_rate.toFixed(1)}%</p>
                          <Progress value={course.pass_rate} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instructor Performance Metrics</CardTitle>
              <CardDescription>Teaching effectiveness and grading efficiency analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.instructor_performance.map((instructor) => (
                  <div key={instructor.instructor_id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{instructor.instructor_name}</h3>
                        <p className="text-sm text-gray-600">{instructor.courses_count} courses</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          ⭐ {instructor.student_satisfaction.toFixed(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Avg Student Score</h4>
                        <p className={cn("text-2xl font-bold", getPerformanceColor(instructor.avg_score))}>
                          {instructor.avg_score.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Grading Efficiency</h4>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-blue-600">{instructor.grading_efficiency.toFixed(1)}%</p>
                          <Progress value={instructor.grading_efficiency} className="h-2" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Student Satisfaction</h4>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-purple-600">{instructor.student_satisfaction.toFixed(1)}/5.0</p>
                          <Progress value={(instructor.student_satisfaction / 5) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Monthly trends in scores and completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Score Trends */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Average Score Trends</h4>
                  <div className="space-y-2">
                    {analyticsData.assessment_trends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">{trend.month}</span>
                        <div className="flex items-center gap-4">
                          <span className={cn("font-bold", getPerformanceColor(trend.avg_score))}>
                            {trend.avg_score.toFixed(1)}%
                          </span>
                          <div className="w-32">
                            <Progress value={trend.avg_score} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Completion Rate Trends */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Completion Rate Trends</h4>
                  <div className="space-y-2">
                    {analyticsData.assessment_trends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">{trend.month}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-blue-600">
                            {trend.completion_rate.toFixed(1)}%
                          </span>
                          <div className="w-32">
                            <Progress value={trend.completion_rate} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AssessmentAnalyticsPage
