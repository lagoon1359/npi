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
  const [profileFetching, setProfileFetching] = useState(false)

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
        console.log('Auth state change:', event, session?.user?.email)

        setSession(session)
        setSupabaseUser(session?.user ?? null)

        if (session?.user && !profileFetching) {
          await fetchUserProfile(session.user.id, session.user.email || '')
        } else if (!session?.user) {
          setUser(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [profileFetching])

  const fetchUserProfile = async (userId: string, email: string) => {
    if (profileFetching) {
      console.log('Profile fetch already in progress, skipping...')
      return
    }

    setProfileFetching(true)

    try {
      console.log('Fetching user profile for:', email)

      // Add timeout for the database query
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      })

      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.warn('Database error fetching user profile:', error.message)
        await createBasicUserProfile(userId, email)
        return
      }

      if (!data) {
        console.log('User profile not found, creating basic profile')
        await createBasicUserProfile(userId, email)
        return
      }

      console.log('User profile found:', data)
      setUser(data)
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      await createBasicUserProfile(userId, email)
    } finally {
      setProfileFetching(false)
    }
  }

  const createBasicUserProfile = async (userId: string, email: string) => {
    try {
      console.log('Creating basic user profile for:', email)

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

      const userProfile = {
        id: userId,
        email: email,
        full_name: fullName,
        role: role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .insert(userProfile)
          .select()
          .single()

        if (error) {
          console.warn('Could not create user profile in database:', error.message)
          console.log('Using fallback user profile')
          setUser(userProfile)
        } else {
          console.log('User profile created successfully:', data)
          setUser(data)
        }
      } catch (dbError) {
        console.warn('Database insert failed, using fallback profile:', dbError)
        setUser(userProfile)
      }
    } catch (error) {
      console.error('Error creating basic user profile:', error)
      // Use fallback user object even if everything fails
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
      console.log('Attempting sign in for:', email)
      setProfileFetching(false) // Reset any stuck state

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error.message)
        return { error: error.message }
      }

      console.log('Sign in successful for:', email)
      return {}
    } catch (error) {
      console.error('Unexpected sign in error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out...')
      setProfileFetching(false)
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
