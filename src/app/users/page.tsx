'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Plus, Edit, Trash2, Users, UserCheck, GraduationCap, Loader2, Search } from 'lucide-react'
import type { User, UserRole } from '@/lib/supabase'

interface UserWithDetails extends User {
  department?: string
  studentNumber?: string
  lastLogin?: string
}

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserWithDetails[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserWithDetails | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'student' as UserRole,
    phone: '',
    date_of_birth: '',
    is_active: true,
  })

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers()
    }
  }, [user])

  useEffect(() => {
    filterUsers()
  }, [users, activeTab, searchQuery])

  const fetchUsers = async () => {
    // Simulated data - replace with actual Supabase calls
    const mockUsers: UserWithDetails[] = [
      {
        id: '1',
        email: 'admin@npi.pg',
        full_name: 'John Administrator',
        role: 'admin',
        phone: '+675-123-4567',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        lastLogin: '2024-01-29T10:30:00Z',
      },
      {
        id: '2',
        email: 'eng.head@npi.pg',
        full_name: 'Dr. Mary Engineering',
        role: 'department_head',
        phone: '+675-234-5678',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        department: 'Engineering',
        lastLogin: '2024-01-29T09:15:00Z',
      },
      {
        id: '3',
        email: 'instructor@npi.pg',
        full_name: 'Dr. James Wilson',
        role: 'instructor',
        phone: '+675-567-8901',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        department: 'Engineering',
        lastLogin: '2024-01-29T08:45:00Z',
      },
      {
        id: '4',
        email: 'sarah.johnson@npi.pg',
        full_name: 'Prof. Sarah Johnson',
        role: 'instructor',
        phone: '+675-678-9012',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        department: 'Engineering',
        lastLogin: '2024-01-28T16:20:00Z',
      },
      {
        id: '5',
        email: 'student@npi.pg',
        full_name: 'Alice Student',
        role: 'student',
        phone: '+675-111-2222',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        department: 'Engineering',
        studentNumber: 'NPI2024001',
        lastLogin: '2024-01-29T07:30:00Z',
      },
      {
        id: '6',
        email: 'bob.student@npi.pg',
        full_name: 'Bob Johnson',
        role: 'student',
        phone: '+675-222-3333',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        department: 'Engineering',
        studentNumber: 'NPI2024002',
        lastLogin: '2024-01-28T19:45:00Z',
      },
    ]

    setUsers(mockUsers)
    setLoading(false)
  }

  const filterUsers = () => {
    let filtered = users

    // Filter by role tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(u => u.role === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(u =>
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.studentNumber && u.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredUsers(filtered)
  }

  const getRoleStats = () => {
    return {
      all: users.length,
      admin: users.filter(u => u.role === 'admin').length,
      department_head: users.filter(u => u.role === 'department_head').length,
      instructor: users.filter(u => u.role === 'instructor').length,
      tutor: users.filter(u => u.role === 'tutor').length,
      student: users.filter(u => u.role === 'student').length,
    }
  }

  const handleCreateUser = () => {
    setEditingUser(null)
    setFormData({
      email: '',
      full_name: '',
      role: 'student',
      phone: '',
      date_of_birth: '',
      is_active: true,
    })
    setDialogOpen(true)
  }

  const handleEditUser = (user: UserWithDetails) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone || '',
      date_of_birth: user.date_of_birth || '',
      is_active: user.is_active,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate API call
    if (editingUser) {
      console.log('Updating user:', formData)
    } else {
      console.log('Creating user:', formData)
    }

    setDialogOpen(false)
    await fetchUsers()
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    console.log('Toggling user status:', userId, !currentStatus)
    // Simulate API call
    await fetchUsers()
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      console.log('Deleting user:', userId)
      await fetchUsers()
    }
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'department_head':
        return 'default'
      case 'instructor':
      case 'tutor':
        return 'secondary'
      case 'student':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const roleStats = getRoleStats()

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage system users and their roles</p>
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name, email, or student number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Tabs and Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            Overview of all system users by role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All ({roleStats.all})</TabsTrigger>
              <TabsTrigger value="admin">Admin ({roleStats.admin})</TabsTrigger>
              <TabsTrigger value="department_head">Heads ({roleStats.department_head})</TabsTrigger>
              <TabsTrigger value="instructor">Instructors ({roleStats.instructor})</TabsTrigger>
              <TabsTrigger value="tutor">Tutors ({roleStats.tutor})</TabsTrigger>
              <TabsTrigger value="student">Students ({roleStats.student})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Student #</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.phone && (
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell>{user.studentNumber || '-'}</TableCell>
                      <TableCell>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.is_active ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === user.id} // Prevent admin from deleting themselves
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create/Edit User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Create User'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Update the user information below.'
                : 'Add a new user to the system.'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@npi.pg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="department_head">Department Head</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="tutor">Tutor</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+675-123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingUser ? 'Update' : 'Create'} User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
