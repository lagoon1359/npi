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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  BarChart3,
  UserPlus,
  Shield,
  CreditCard,
  Home,
  ClipboardCheck,
  TrendingUp,
  Award,
  ShieldCheck,
  Database,
  UserCheck,
  FolderOpen,
  Clipboard,
  ChevronDown,
  Menu,
  X,
  ChevronRight
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

interface NavItem {
  href: string
  label: string
  icon: any
  description?: string
}

interface NavCategory {
  label: string
  icon: any
  items: NavItem[]
}

export default function Header({ user, onLogout }: HeaderProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openCategories, setOpenCategories] = useState<string[]>([])

  const toggleCategory = (categoryLabel: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryLabel)
        ? prev.filter(label => label !== categoryLabel)
        : [...prev, categoryLabel]
    )
  }

  const getNavigationCategories = (role: UserRole): NavCategory[] => {
    const dashboardItems: NavItem[] = [
      { href: '/dashboard', label: 'Main Dashboard', icon: BarChart3, description: 'Overview and key metrics' }
    ]

    const registrationItems: NavItem[] = []
    const academicItems: NavItem[] = []
    const reportItems: NavItem[] = []
    const setupItems: NavItem[] = []

    switch (role) {
      case 'admin':
        // Dashboard System
        dashboardItems.push(
          { href: '/admin-dashboard', label: 'Admin Dashboard', icon: Shield, description: 'Administrative overview' },
          { href: '/assessment-analytics', label: 'Assessment Analytics', icon: TrendingUp, description: 'Performance insights' }
        )

        // Student Registration System
        registrationItems.push(
          { href: '/student-registration', label: 'New Registration', icon: UserPlus, description: 'Register new students' },
          { href: '/biometric-enrollment', label: 'Biometric Enrollment', icon: UserCheck, description: 'Biometric data capture' }
        )

        // Academic Management System
        academicItems.push(
          { href: '/assessments', label: 'Assessment Management', icon: ClipboardCheck, description: 'Manage assessments' },
          { href: '/grade-moderation', label: 'Grade Moderation', icon: ShieldCheck, description: 'Review and approve grades' },
          { href: '/departments', label: 'Departments', icon: Building, description: 'Manage departments' },
          { href: '/programs', label: 'Programs', icon: BookOpen, description: 'Academic programs' },
          { href: '/courses', label: 'Courses', icon: FolderOpen, description: 'Course management' },
          { href: '/academic-years', label: 'Academic Years', icon: Calendar, description: 'Academic calendar' },
          { href: '/grading-deadlines', label: 'Grading Deadlines', icon: Clipboard, description: 'Deadline management' }
        )

        // Reports
        reportItems.push(
          { href: '/reports', label: 'System Reports', icon: FileText, description: 'Administrative reports' },
          { href: '/transcript-generator', label: 'Generate Transcripts', icon: Award, description: 'Student transcripts' },
          { href: '/system-logs', label: 'System Logs', icon: Database, description: 'System activity logs' }
        )

        // Setup
        setupItems.push(
          { href: '/users', label: 'User Management', icon: Users, description: 'Manage system users' },
          { href: '/settings', label: 'System Settings', icon: Settings, description: 'System configuration' }
        )
        break

      case 'department_head':
        // Dashboard System
        dashboardItems.push(
          { href: '/assessment-analytics', label: 'Assessment Analytics', icon: TrendingUp, description: 'Department performance' }
        )

        // Academic Management System
        academicItems.push(
          { href: '/courses', label: 'Department Courses', icon: BookOpen, description: 'Manage department courses' },
          { href: '/assessments', label: 'Assessment Management', icon: ClipboardCheck, description: 'Oversee assessments' },
          { href: '/grade-moderation', label: 'Grade Moderation', icon: ShieldCheck, description: 'Review grades' },
          { href: '/users', label: 'Department Staff', icon: Users, description: 'Manage instructors' }
        )

        // Reports
        reportItems.push(
          { href: '/reports', label: 'Department Reports', icon: FileText, description: 'Department analytics' }
        )
        break

      case 'instructor':
      case 'tutor':
        // Academic Management System
        academicItems.push(
          { href: '/courses', label: 'My Courses', icon: BookOpen, description: 'Courses you teach' },
          { href: '/assessments', label: 'Assessment Management', icon: ClipboardCheck, description: 'Create and manage assessments' },
          { href: '/users', label: 'My Students', icon: Users, description: 'View your students' }
        )
        break

      case 'student':
        // Student Registration System
        registrationItems.push(
          { href: '/student-registration', label: 'Registration Portal', icon: UserPlus, description: 'Course registration' },
          { href: '/biometric-enrollment', label: 'Biometric Enrollment', icon: UserCheck, description: 'Update biometric data' }
        )

        // Academic Management System
        academicItems.push(
          { href: '/courses', label: 'My Courses', icon: BookOpen, description: 'Enrolled courses' },
          { href: '/student-grades', label: 'My Grades', icon: Award, description: 'View your grades' }
        )

        // Reports
        reportItems.push(
          { href: '/transcript-generator', label: 'My Transcript', icon: GraduationCap, description: 'Download transcripts' }
        )
        break
    }

    const categories: NavCategory[] = [
      {
        label: 'Dashboard',
        icon: BarChart3,
        items: dashboardItems
      }
    ]

    if (registrationItems.length > 0) {
      categories.push({
        label: 'Registration',
        icon: UserPlus,
        items: registrationItems
      })
    }

    if (academicItems.length > 0) {
      categories.push({
        label: 'Academic',
        icon: BookOpen,
        items: academicItems
      })
    }

    if (reportItems.length > 0) {
      categories.push({
        label: 'Reports',
        icon: FileText,
        items: reportItems
      })
    }

    if (setupItems.length > 0) {
      categories.push({
        label: 'Setup',
        icon: Settings,
        items: setupItems
      })
    }

    return categories
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    router.push('/login')
  }

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false)
    router.push(href)
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
                <Link href="/student-registration">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Link>
              </Button>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const navigationCategories = getNavigationCategories(user.role)

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationCategories.map((category) => {
                  const CategoryIcon = category.icon

                  // If only one item, make it a direct link
                  if (category.items.length === 1) {
                    const item = category.items[0]
                    const ItemIcon = item.icon
                    return (
                      <NavigationMenuItem key={category.label}>
                        <Link href={item.href} legacyBehavior passHref>
                          <NavigationMenuLink className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                            <ItemIcon className="h-4 w-4" />
                            <span>{category.label}</span>
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    )
                  }

                  // Multiple items - create dropdown
                  return (
                    <NavigationMenuItem key={category.label}>
                      <NavigationMenuTrigger className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                        <CategoryIcon className="h-4 w-4" />
                        <span>{category.label}</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-80 gap-3 p-4">
                          {category.items.map((item) => {
                            const ItemIcon = item.icon
                            return (
                              <Link key={item.href} href={item.href} legacyBehavior passHref>
                                <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                  <div className="flex items-center space-x-2">
                                    <ItemIcon className="h-4 w-4" />
                                    <div className="text-sm font-medium leading-none">{item.label}</div>
                                  </div>
                                  {item.description && (
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                      {item.description}
                                    </p>
                                  )}
                                </NavigationMenuLink>
                              </Link>
                            )
                          })}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className={roleColors[user.role]}>
              {roleDisplayNames[user.role]}
            </Badge>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SheetHeader className="border-b p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profile_picture_url} alt={user.full_name} />
                      <AvatarFallback>
                        {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <SheetTitle className="text-base">{user.full_name}</SheetTitle>
                      <SheetDescription className="text-sm">{user.email}</SheetDescription>
                      <Badge variant="secondary" className={`${roleColors[user.role]} mt-1 text-xs`}>
                        {roleDisplayNames[user.role]}
                      </Badge>
                    </div>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4">
                  <nav className="space-y-2 px-4">
                    {navigationCategories.map((category) => {
                      const CategoryIcon = category.icon
                      const isOpen = openCategories.includes(category.label)

                      // If only one item, make it a direct link
                      if (category.items.length === 1) {
                        const item = category.items[0]
                        const ItemIcon = item.icon
                        return (
                          <Button
                            key={category.label}
                            variant="ghost"
                            className="w-full justify-start h-auto p-3"
                            onClick={() => handleMobileNavClick(item.href)}
                          >
                            <ItemIcon className="mr-3 h-5 w-5" />
                            <div className="text-left">
                              <div className="font-medium">{category.label}</div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </Button>
                        )
                      }

                      // Multiple items - create collapsible section
                      return (
                        <Collapsible key={category.label} open={isOpen} onOpenChange={() => toggleCategory(category.label)}>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between h-auto p-3">
                              <div className="flex items-center">
                                <CategoryIcon className="mr-3 h-5 w-5" />
                                <span className="font-medium">{category.label}</span>
                              </div>
                              <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-1 pl-4 mt-2">
                            {category.items.map((item) => {
                              const ItemIcon = item.icon
                              return (
                                <Button
                                  key={item.href}
                                  variant="ghost"
                                  className="w-full justify-start h-auto p-3 pl-8"
                                  onClick={() => handleMobileNavClick(item.href)}
                                >
                                  <ItemIcon className="mr-3 h-4 w-4" />
                                  <div className="text-left">
                                    <div className="text-sm font-medium">{item.label}</div>
                                    {item.description && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {item.description}
                                      </div>
                                    )}
                                  </div>
                                </Button>
                              )
                            })}
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    })}
                  </nav>

                  <Separator className="my-4" />

                  <div className="px-4 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-3"
                      onClick={() => handleMobileNavClick('/settings')}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hidden md:flex">
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
                  <Link href="/settings" className="flex items-center">
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
