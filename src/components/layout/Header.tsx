'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  User,
  Building,
  Calendar,
  BarChart3
} from 'lucide-react'
import type { UserRole } from '@/lib/supabase'

interface HeaderProps {
  user?: {
    id: string
    email: string
    full_name: string
    role: UserRole
    profile_picture_url?: string
  } | null
  onLogout?: () => void
}

const roleColors = {
  admin: 'bg-red-100 text-red-800',
  department_head: 'bg-blue-100 text-blue-800',
  instructor: 'bg-green-100 text-green-800',
  tutor: 'bg-yellow-100 text-yellow-800',
  student: 'bg-gray-100 text-gray-800',
}

const roleDisplayNames = {
  admin: 'Administrator',
  department_head: 'Department Head',
  instructor: 'Instructor',
  tutor: 'Tutor',
  student: 'Student',
}

export default function Header({ user, onLogout }: HeaderProps) {
  const router = useRouter()

  const getNavigationItems = (role: UserRole) => {
    const baseItems = [
      { href: '/dashboard', label: 'Dashboard', icon: BarChart3 }
    ]

    switch (role) {
      case 'admin':
        return [
          ...baseItems,
          { href: '/departments', label: 'Departments', icon: Building },
          { href: '/programs', label: 'Programs', icon: BookOpen },
          { href: '/users', label: 'Users', icon: Users },
          { href: '/academic-years', label: 'Academic Years', icon: Calendar },
          { href: '/reports', label: 'Reports', icon: FileText },
          { href: '/settings', label: 'Settings', icon: Settings },
        ]

      case 'department_head':
        return [
          ...baseItems,
          { href: '/courses', label: 'Courses', icon: BookOpen },
          { href: '/instructors', label: 'Instructors', icon: Users },
          { href: '/assessments', label: 'Assessments', icon: FileText },
          { href: '/reports', label: 'Reports', icon: FileText },
        ]

      case 'instructor':
      case 'tutor':
        return [
          ...baseItems,
          { href: '/my-courses', label: 'My Courses', icon: BookOpen },
          { href: '/assessments', label: 'Assessments', icon: FileText },
          { href: '/students', label: 'Students', icon: Users },
          { href: '/grading', label: 'Grading', icon: FileText },
        ]

      case 'student':
        return [
          ...baseItems,
          { href: '/courses', label: 'My Courses', icon: BookOpen },
          { href: '/results', label: 'Results', icon: FileText },
          { href: '/transcript', label: 'Transcript', icon: GraduationCap },
        ]

      default:
        return baseItems
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    router.push('/login')
  }

  if (!user) {
    return (
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">NPI PNG</h1>
                <p className="text-xs text-gray-500">Assessment System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const navigationItems = getNavigationItems(user.role)

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">NPI PNG</h1>
                <p className="text-xs text-gray-500">Assessment System</p>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className={roleColors[user.role]}>
              {roleDisplayNames[user.role]}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profile_picture_url} alt={user.full_name} />
                    <AvatarFallback>
                      {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
