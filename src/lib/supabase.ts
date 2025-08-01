import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Real Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Client component Supabase client
export const createSupabaseClient = () => {
  return createClientComponentClient()
}

// Type definitions
export type UserRole = 'admin' | 'department_head' | 'instructor' | 'tutor' | 'student'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  date_of_birth?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: string
  code: string
  description?: string
  head_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  name: string
  code: string
  description?: string
  department_id: string
  credits: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Extended types for application use
export interface UserWithDetails extends User {
  department?: Department
}

export interface DepartmentWithStats extends Department {
  total_instructors: number
  total_students: number
  total_courses: number
  head?: User
}

export interface CourseWithDetails extends Course {
  department: Department
  instructor?: User
  student_count: number
}
