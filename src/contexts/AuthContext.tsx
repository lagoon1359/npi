'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as SupabaseUser, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { User, UserRole } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        setSession(initialSession)
        setSupabaseUser(initialSession?.user ?? null)

        if (initialSession?.user) {
          await fetchUserProfile(initialSession.user.id, initialSession.user.email || '')
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
        setSupabaseUser(session?.user ?? null)

        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email || '')
        } else {
          setUser(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.warn('User profile not found, creating basic profile:', error.message)
        // Create a basic user profile if it doesn't exist
        await createBasicUserProfile(userId, email)
        return
      }

      setUser(data)
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      // Create fallback user for demo purposes
      await createBasicUserProfile(userId, email)
    }
  }

  const createBasicUserProfile = async (userId: string, email: string) => {
    try {
      // Determine role based on email for demo accounts
      let role: UserRole = 'student'
      let fullName = 'Demo User'

      if (email === 'admin@npi.pg') {
        role = 'admin'
        fullName = 'System Administrator'
      } else if (email === 'instructor@npi.pg') {
        role = 'instructor'
        fullName = 'Dr. John Instructor'
      } else if (email === 'student@npi.pg') {
        role = 'student'
        fullName = 'Mary Student'
      }

      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          full_name: fullName,
          role: role,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.warn('Could not create user profile, using fallback:', error.message)
        // Use fallback user object
        setUser({
          id: userId,
          email: email,
          full_name: fullName,
          role: role,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      } else {
        setUser(data)
      }
    } catch (error) {
      console.error('Error creating basic user profile:', error)
      // Use fallback user object even if database operation fails
      setUser({
        id: userId,
        email: email,
        full_name: 'Demo User',
        role: 'student',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSupabaseUser(null)
      setSession(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    supabaseUser,
    session,
    loading,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
