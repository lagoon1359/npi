import { supabase } from '@/lib/supabase'
import { createSupabaseClient } from '@/lib/supabase'

export interface Notification {
  id: string
  user_id: string
  type: 'grade_released' | 'assessment_created' | 'deadline_reminder' | 'general'
  title: string
  message: string
  data?: Record<string, any>
  is_read: boolean
  created_at: string
  expires_at?: string
}

export interface EmailNotification {
  to: string
  subject: string
  html: string
  data?: Record<string, any>
}

export const notificationService = {
  // Create in-app notification
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notification,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Create notifications for multiple users
  async createBulkNotifications(notifications: Array<Omit<Notification, 'id' | 'created_at'>>) {
    try {
      const notificationsWithTimestamp = notifications.map(notification => ({
        ...notification,
        created_at: new Date().toISOString()
      }))

      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationsWithTimestamp)
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Get notifications for a user
  async getUserNotifications(user_id: string, limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error: error as Error }
    }
  },

  // Mark notification as read
  async markAsRead(notification_id: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification_id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Mark all notifications as read for a user
  async markAllAsRead(user_id: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user_id)
        .eq('is_read', false)
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Get unread notification count
  async getUnreadCount(user_id: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user_id)
        .eq('is_read', false)

      if (error) throw error
      return { count: count || 0, error: null }
    } catch (error) {
      return { count: 0, error: error as Error }
    }
  },

  // Subscribe to real-time notifications
  subscribeToNotifications(user_id: string, callback: (notification: Notification) => void) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user_id}`
        },
        (payload) => {
          callback(payload.new as Notification)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },

  // Grade release notifications
  async notifyGradeRelease(assessment_id: string, student_ids: string[]) {
    try {
      // Get assessment details
      const { data: assessmentData } = await supabase
        .from('assessment_definitions')
        .select(`
          *,
          courses!inner(name, code)
        `)
        .eq('id', assessment_id)
        .single()

      if (!assessmentData) {
        throw new Error('Assessment not found')
      }

      // Get student user IDs
      const { data: studentsData } = await supabase
        .from('students')
        .select(`
          user_id,
          users!inner(full_name, email)
        `)
        .in('id', student_ids)

      if (!studentsData) return { error: new Error('Students not found') }

      // Create in-app notifications
      const notifications = studentsData.map(student => ({
        user_id: student.user_id,
        type: 'grade_released' as const,
        title: 'New Grade Available',
        message: `Your grade for "${assessmentData.name}" in ${assessmentData.courses.code} has been released.`,
        data: {
          assessment_id,
          assessment_name: assessmentData.name,
          course_code: assessmentData.courses.code,
          course_name: assessmentData.courses.name
        },
        is_read: false
      }))

      const { error: notificationError } = await this.createBulkNotifications(notifications)
      if (notificationError) throw notificationError

      // Send email notifications (if email service is configured)
      const emailPromises = studentsData.map(student =>
        this.sendGradeReleaseEmail({
          to: student.users.email,
          student_name: student.users.full_name,
          assessment_name: assessmentData.name,
          course_code: assessmentData.courses.code,
          course_name: assessmentData.courses.name
        })
      )

      await Promise.all(emailPromises)

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  },

  // Assessment deadline reminders
  async sendDeadlineReminders() {
    try {
      // Get assessments due in the next 24-48 hours
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dayAfter = new Date()
      dayAfter.setDate(dayAfter.getDate() + 2)

      const { data: upcomingAssessments } = await supabase
        .from('assessment_definitions')
        .select(`
          *,
          courses!inner(
            name,
            code,
            student_enrollments!inner(
              students!inner(
                user_id,
                users!inner(full_name, email)
              )
            )
          )
        `)
        .gte('due_date', tomorrow.toISOString().split('T')[0])
        .lte('due_date', dayAfter.toISOString().split('T')[0])

      if (!upcomingAssessments || upcomingAssessments.length === 0) {
        return { error: null }
      }

      // Create notifications for each student
      for (const assessment of upcomingAssessments) {
        const enrolledStudents = assessment.courses.student_enrollments || []

        const notifications = enrolledStudents.map((enrollment: any) => ({
          user_id: enrollment.students.user_id,
          type: 'deadline_reminder' as const,
          title: 'Assessment Deadline Reminder',
          message: `"${assessment.name}" in ${assessment.courses.code} is due on ${new Date(assessment.due_date).toLocaleDateString()}.`,
          data: {
            assessment_id: assessment.id,
            assessment_name: assessment.name,
            course_code: assessment.courses.code,
            due_date: assessment.due_date
          },
          is_read: false,
          expires_at: assessment.due_date
        }))

        if (notifications.length > 0) {
          await this.createBulkNotifications(notifications)
        }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  },

  // Email notification functions
  async sendGradeReleaseEmail(params: {
    to: string
    student_name: string
    assessment_name: string
    course_code: string
    course_name: string
  }) {
    try {
      // This would integrate with your email service (SendGrid, AWS SES, etc.)
      // For now, we'll just log the email that would be sent
      const emailData: EmailNotification = {
        to: params.to,
        subject: `New Grade Available - ${params.course_code}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Grade Available</h2>
            <p>Dear ${params.student_name},</p>
            <p>Your grade for <strong>"${params.assessment_name}"</strong> in <strong>${params.course_code} - ${params.course_name}</strong> has been released.</p>
            <p>Please log into your student portal to view your grade and feedback.</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
              <p style="margin: 0;"><strong>Assessment:</strong> ${params.assessment_name}</p>
              <p style="margin: 0;"><strong>Course:</strong> ${params.course_code} - ${params.course_name}</p>
            </div>
            <p>Best regards,<br>NPI PNG Academic Team</p>
          </div>
        `,
        data: {
          assessment_name: params.assessment_name,
          course_code: params.course_code,
          course_name: params.course_name
        }
      }

      // Log email for now (replace with actual email service)
      console.log('Grade release email:', emailData)

      // Here you would integrate with your email service:
      // await emailService.send(emailData)

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  },

  async sendAssessmentCreatedEmail(params: {
    to: string[]
    assessment_name: string
    course_code: string
    course_name: string
    due_date: string
    instructor_name: string
  }) {
    try {
      const emailPromises = params.to.map(email => {
        const emailData: EmailNotification = {
          to: email,
          subject: `New Assessment - ${params.course_code}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">New Assessment Available</h2>
              <p>A new assessment has been created for your course.</p>
              <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
                <p style="margin: 0;"><strong>Assessment:</strong> ${params.assessment_name}</p>
                <p style="margin: 0;"><strong>Course:</strong> ${params.course_code} - ${params.course_name}</p>
                <p style="margin: 0;"><strong>Due Date:</strong> ${new Date(params.due_date).toLocaleDateString()}</p>
                <p style="margin: 0;"><strong>Instructor:</strong> ${params.instructor_name}</p>
              </div>
              <p>Please log into your student portal for more details.</p>
              <p>Best regards,<br>NPI PNG Academic Team</p>
            </div>
          `,
          data: {
            assessment_name: params.assessment_name,
            course_code: params.course_code,
            due_date: params.due_date
          }
        }

        // Log email for now (replace with actual email service)
        console.log('Assessment created email:', emailData)
        return Promise.resolve()
      })

      await Promise.all(emailPromises)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }
}

// Notification context/hook for React components
export const useNotifications = (user_id: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user_id) return

    const loadNotifications = async () => {
      setLoading(true)
      const { data } = await notificationService.getUserNotifications(user_id)
      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.is_read).length)
      }
      setLoading(false)
    }

    loadNotifications()

    // Subscribe to real-time updates
    const unsubscribe = notificationService.subscribeToNotifications(user_id, (newNotification) => {
      setNotifications(prev => [newNotification, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return unsubscribe
  }, [user_id])

  const markAsRead = async (notification_id: string) => {
    await notificationService.markAsRead(notification_id)
    setNotifications(prev =>
      prev.map(n => n.id === notification_id ? { ...n, is_read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead(user_id)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead
  }
}
