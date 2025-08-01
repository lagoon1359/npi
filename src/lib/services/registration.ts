import { supabase } from '../supabase'
import type {
  RegistrationFormData,
  StudentExtended,
  StudentPayment,
  FeeStructure,
  Room,
  RoomAllocation,
  StudentIdCard,
  MealCard,
  BiometricRecord,
  StudentRegistrationLog,
  ApiResponse
} from '../types'

// Student Registration Service
export class StudentRegistrationService {

  /**
   * Submit student registration
   */
  static async submitRegistration(formData: RegistrationFormData, userId: string): Promise<ApiResponse<StudentExtended>> {
    try {
      // Start transaction-like operations

      // 1. Generate student number
      const studentNumber = await this.generateStudentNumber(formData.programId, new Date().getFullYear())

      // 2. Create student record
      const studentData = {
        user_id: userId,
        student_number: studentNumber,
        program_id: formData.programId,
        student_type: formData.studentType,
        student_category: formData.studentCategory,
        year_level: 1, // Default for new students
        enrollment_year: new Date().getFullYear(),
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth,
        guardian_name: formData.guardianName,
        guardian_phone: formData.guardianPhone,
        guardian_email: formData.guardianEmail,
        address: `${formData.permanentAddress}\n\nCurrent: ${formData.currentAddress}`,
        national_id: formData.nationalId,
        passport_number: formData.passportNumber,
        biometric_enrolled: false,
        registration_date: new Date().toISOString().split('T')[0]
      }

      const { data: student, error: studentError } = await supabase
        .from('students_extended')
        .insert(studentData)
        .select()
        .single()

      if (studentError) throw studentError

      // 3. Process payments
      await this.processPayments(student.id, formData)

      // 4. Handle accommodation if required
      if (formData.requiresAccommodation) {
        await this.allocateRoom(student.id, formData.roomPreference, formData.gender)
      }

      // 5. Generate student ID and meal card
      await this.generateStudentId(student.id)
      await this.generateMealCard(student.id)

      // 6. Log registration
      await this.logRegistrationAction(student.id, 'registration_completed', userId, {
        student_number: studentNumber,
        program_id: formData.programId,
        payment_method: formData.paymentMethod
      })

      return { data: student, error: null, message: 'Registration completed successfully' }

    } catch (error) {
      console.error('Registration error:', error)
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Registration failed',
        message: 'An error occurred during registration'
      }
    }
  }

  /**
   * Generate unique student number
   */
  static async generateStudentNumber(programId: string, enrollmentYear: number): Promise<string> {
    // Get program code
    const { data: program } = await supabase
      .from('programs')
      .select('code')
      .eq('id', programId)
      .single()

    if (!program) throw new Error('Program not found')

    // Get next sequence number
    const { data: students } = await supabase
      .from('students_extended')
      .select('student_number')
      .like('student_number', `NPI${enrollmentYear}${program.code}%`)
      .order('student_number', { ascending: false })
      .limit(1)

    let sequence = 1
    if (students && students.length > 0) {
      const lastNumber = students[0].student_number
      const lastSequence = parseInt(lastNumber.slice(-3))
      sequence = lastSequence + 1
    }

    return `NPI${enrollmentYear}${program.code}${sequence.toString().padStart(3, '0')}`
  }

  /**
   * Process student payments
   */
  static async processPayments(studentId: string, formData: RegistrationFormData): Promise<void> {
    // Get fee structure for selected fees
    const { data: fees } = await supabase
      .from('fee_structure')
      .select('*')
      .eq('program_id', formData.programId)

    if (!fees) return

    const mandatoryFees = fees.filter((fee: any) => fee.is_mandatory)
    const selectedOptionalFees = fees.filter((fee: any) =>
      !fee.is_mandatory && formData.selectedFees.includes(fee.id)
    )

    const allFeesToPay = [...mandatoryFees, ...selectedOptionalFees]

    for (const fee of allFeesToPay) {
      const paymentData = {
        student_id: studentId,
        fee_structure_id: fee.id,
        amount_paid: fee.amount,
        payment_method: formData.paymentMethod,
        receipt_number: formData.receiptNumber,
        payment_date: new Date().toISOString().split('T')[0],
        verification_status: formData.paymentMethod === 'cash' ? 'pending' : 'pending',
        manual_entry_flag: formData.paymentMethod === 'cash'
      }

      await supabase
        .from('student_payments')
        .insert(paymentData)
    }
  }

  /**
   * Allocate room to student
   */
  static async allocateRoom(studentId: string, roomPreference: string, gender: string): Promise<void> {
    // Find available room matching preference and gender
    const { data: rooms } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_type', roomPreference)
      .eq('is_available', true)
      .lt('current_occupancy', 'capacity')
      .or(`gender_restriction.is.null,gender_restriction.eq.${gender}`)
      .order('current_occupancy', { ascending: true })
      .limit(1)

    if (rooms && rooms.length > 0) {
      const room = rooms[0]

      // Allocate room
      await supabase
        .from('room_allocations')
        .insert({
          student_id: studentId,
          room_id: room.id,
          allocated_date: new Date().toISOString().split('T')[0],
          is_active: true,
          allocation_fee_paid: false
        })
    }
  }

  /**
   * Generate student ID card
   */
  static async generateStudentId(studentId: string): Promise<void> {
    const cardNumber = `ID${Date.now().toString().slice(-8)}`

    await supabase
      .from('student_id_cards')
      .insert({
        student_id: studentId,
        card_number: cardNumber,
        issue_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 years
        is_active: true,
        qr_code_data: JSON.stringify({ student_id: studentId, card_number: cardNumber }),
        barcode_data: cardNumber
      })
  }

  /**
   * Generate meal card
   */
  static async generateMealCard(studentId: string): Promise<void> {
    const cardNumber = `MEAL${Date.now().toString().slice(-8)}`

    await supabase
      .from('meal_cards')
      .insert({
        student_id: studentId,
        card_number: cardNumber,
        balance: 0,
        is_active: true,
        issued_date: new Date().toISOString().split('T')[0]
      })
  }

  /**
   * Log registration action
   */
  static async logRegistrationAction(
    studentId: string,
    action: string,
    performedBy: string,
    details: Record<string, any>
  ): Promise<void> {
    await supabase
      .from('student_registration_logs')
      .insert({
        student_id: studentId,
        action,
        performed_by: performedBy,
        details,
        timestamp: new Date().toISOString()
      })
  }

  /**
   * Get fee structure for a program
   */
  static async getFeeStructure(programId: string): Promise<FeeStructure[]> {
    const { data, error } = await supabase
      .from('fee_structure')
      .select('*')
      .eq('program_id', programId)
      .order('is_mandatory', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * Upload document and get URL
   */
  static async uploadDocument(file: File, studentId: string, documentType: string): Promise<string> {
    const fileName = `${studentId}/${documentType}_${Date.now()}.${file.name.split('.').pop()}`

    const { data, error } = await supabase.storage
      .from('student-documents')
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('student-documents')
      .getPublicUrl(fileName)

    return publicUrl
  }

  /**
   * Verify payment
   */
  static async verifyPayment(paymentId: string, verifiedBy: string, status: 'verified' | 'rejected'): Promise<ApiResponse<StudentPayment>> {
    try {
      const { data, error } = await supabase
        .from('student_payments')
        .update({
          verification_status: status,
          verified_by: verifiedBy,
          verified_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', paymentId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null, message: `Payment ${status} successfully` }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Verification failed'
      }
    }
  }

  /**
   * Get student by ID with all related data
   */
  static async getStudentWithDetails(studentId: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('students_extended')
        .select(`
          *,
          users(full_name, email),
          programs(name, code),
          student_payments(*, fee_structure(*)),
          room_allocations(*, rooms(*)),
          student_id_cards(*),
          meal_cards(*)
        `)
        .eq('id', studentId)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch student'
      }
    }
  }

  /**
   * Get pending registrations for admin review
   */
  static async getPendingRegistrations(): Promise<ApiResponse<StudentExtended[]>> {
    try {
      const { data, error } = await supabase
        .from('students_extended')
        .select(`
          *,
          users(full_name, email),
          programs(name, code),
          student_payments!inner(verification_status)
        `)
        .eq('student_payments.verification_status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data: data || [], error: null }
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch registrations'
      }
    }
  }
}
