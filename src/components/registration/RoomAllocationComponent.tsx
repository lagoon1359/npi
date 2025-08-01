'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Building,
  Users,
  Bed,
  UserPlus,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react'
import type { Room, RoomAllocation, StudentExtended } from '@/lib/types'

interface RoomAllocationComponentProps {
  onAllocationUpdate?: () => void
}

interface RoomWithAllocations extends Room {
  allocations?: (RoomAllocation & {
    student?: StudentExtended & {
      users?: { full_name: string; email: string }
      programs?: { name: string; code: string }
    }
  })[]
}

interface StudentNeedingAccommodation extends StudentExtended {
  users?: { full_name: string; email: string }
  programs?: { name: string; code: string }
  room_preference?: string
}

export default function RoomAllocationComponent({ onAllocationUpdate }: RoomAllocationComponentProps) {
  const [rooms, setRooms] = useState<RoomWithAllocations[]>([])
  const [studentsNeedingRooms, setStudentsNeedingRooms] = useState<StudentNeedingAccommodation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<RoomWithAllocations | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentNeedingAccommodation | null>(null)
  const [allocationNotes, setAllocationNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [filters, setFilters] = useState({
    roomType: '',
    gender: '',
    building: '',
    availability: ''
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRoomsAndStudents()
  }, [])

  const fetchRoomsAndStudents = async () => {
    try {
      setLoading(true)

      // Mock data for demonstration - replace with actual API calls
      const mockRooms: RoomWithAllocations[] = [
        {
          id: 'room1',
          room_number: 'A101',
          room_type: 'double',
          capacity: 2,
          current_occupancy: 1,
          gender_restriction: 'male',
          floor_number: 1,
          building_name: 'Building A',
          amenities: ['WiFi', 'Study Desk', 'Wardrobe', 'Shared Bathroom'],
          is_available: true,
          monthly_fee: 400,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          allocations: [
            {
              id: 'alloc1',
              student_id: 'student1',
              room_id: 'room1',
              allocated_date: '2024-01-15',
              is_active: true,
              allocation_fee_paid: true,
              created_at: '2024-01-15T00:00:00Z',
              updated_at: '2024-01-15T00:00:00Z',
              student: {
                id: 'student1',
                user_id: 'user1',
                student_number: 'NPI2024DCE001',
                program_id: 'prog1',
                student_type: 'full_time',
                student_category: 'boarder',
                year_level: 1,
                enrollment_year: 2024,
                gender: 'male',
                date_of_birth: '2000-05-15',
                biometric_enrolled: false,
                registration_date: '2024-01-15',
                is_active: true,
                created_at: '2024-01-15T00:00:00Z',
                updated_at: '2024-01-15T00:00:00Z',
                users: {
                  full_name: 'John Doe',
                  email: 'john.doe@email.com'
                },
                programs: {
                  name: 'Diploma in Civil Engineering',
                  code: 'DCE'
                }
              }
            }
          ]
        },
        {
          id: 'room2',
          room_number: 'A102',
          room_type: 'double',
          capacity: 2,
          current_occupancy: 0,
          gender_restriction: 'male',
          floor_number: 1,
          building_name: 'Building A',
          amenities: ['WiFi', 'Study Desk', 'Wardrobe', 'Shared Bathroom'],
          is_available: true,
          monthly_fee: 400,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          allocations: []
        },
        {
          id: 'room3',
          room_number: 'B201',
          room_type: 'single',
          capacity: 1,
          current_occupancy: 0,
          gender_restriction: 'female',
          floor_number: 2,
          building_name: 'Building B',
          amenities: ['WiFi', 'Study Desk', 'Wardrobe', 'Private Bathroom'],
          is_available: true,
          monthly_fee: 600,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          allocations: []
        }
      ]

      const mockStudentsNeedingRooms: StudentNeedingAccommodation[] = [
        {
          id: 'student2',
          user_id: 'user2',
          student_number: 'NPI2024DEE002',
          program_id: 'prog2',
          student_type: 'full_time',
          student_category: 'boarder',
          year_level: 1,
          enrollment_year: 2024,
          gender: 'female',
          date_of_birth: '1999-12-10',
          biometric_enrolled: false,
          registration_date: '2024-01-16',
          is_active: true,
          created_at: '2024-01-16T00:00:00Z',
          updated_at: '2024-01-16T00:00:00Z',
          room_preference: 'single',
          users: {
            full_name: 'Jane Smith',
            email: 'jane.smith@email.com'
          },
          programs: {
            name: 'Diploma in Electrical Engineering',
            code: 'DEE'
          }
        },
        {
          id: 'student3',
          user_id: 'user3',
          student_number: 'NPI2024DCE003',
          program_id: 'prog1',
          student_type: 'full_time',
          student_category: 'boarder',
          year_level: 1,
          enrollment_year: 2024,
          gender: 'male',
          date_of_birth: '2001-03-20',
          biometric_enrolled: false,
          registration_date: '2024-01-17',
          is_active: true,
          created_at: '2024-01-17T00:00:00Z',
          updated_at: '2024-01-17T00:00:00Z',
          room_preference: 'double',
          users: {
            full_name: 'Mike Johnson',
            email: 'mike.johnson@email.com'
          },
          programs: {
            name: 'Diploma in Civil Engineering',
            code: 'DCE'
          }
        }
      ]

      setRooms(mockRooms)
      setStudentsNeedingRooms(mockStudentsNeedingRooms)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAllocateRoom = async (roomId: string, studentId: string) => {
    try {
      setProcessing(true)

      // Mock API call - replace with actual allocation
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update room occupancy and allocations locally
      setRooms(prev => prev.map(room => {
        if (room.id === roomId) {
          const student = studentsNeedingRooms.find(s => s.id === studentId)
          const newAllocation: RoomAllocation & { student?: StudentNeedingAccommodation } = {
            id: `alloc_${Date.now()}`,
            student_id: studentId,
            room_id: roomId,
            allocated_date: new Date().toISOString().split('T')[0],
            is_active: true,
            allocation_fee_paid: false,
            notes: allocationNotes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            student
          }

          return {
            ...room,
            current_occupancy: room.current_occupancy + 1,
            allocations: [...(room.allocations || []), newAllocation]
          }
        }
        return room
      }))

      // Remove student from needing accommodation list
      setStudentsNeedingRooms(prev => prev.filter(s => s.id !== studentId))

      setSelectedRoom(null)
      setSelectedStudent(null)
      setAllocationNotes('')
      onAllocationUpdate?.()

    } catch (error) {
      console.error('Error allocating room:', error)
    } finally {
      setProcessing(false)
    }
  }

  const getAvailabilityBadge = (room: Room) => {
    const available = room.capacity - room.current_occupancy
    if (available === 0) {
      return <Badge variant="destructive">Full</Badge>
    } else if (available === room.capacity) {
      return <Badge variant="outline" className="text-green-600">Empty</Badge>
    } else {
      return <Badge variant="outline" className="text-blue-600">{available} Available</Badge>
    }
  }

  const getGenderBadge = (gender?: string) => {
    if (!gender) return <Badge variant="outline">Any</Badge>
    return <Badge variant="outline" className={
      gender === 'male' ? 'text-blue-600' :
      gender === 'female' ? 'text-pink-600' :
      'text-purple-600'
    }>
      {gender.charAt(0).toUpperCase() + gender.slice(1)}
    </Badge>
  }

  const filteredRooms = rooms.filter(room => {
    if (filters.roomType && room.room_type !== filters.roomType) return false
    if (filters.gender && room.gender_restriction !== filters.gender) return false
    if (filters.building && room.building_name !== filters.building) return false
    if (filters.availability === 'available' && room.current_occupancy >= room.capacity) return false
    if (filters.availability === 'full' && room.current_occupancy < room.capacity) return false
    if (searchTerm && !room.room_number.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Loading room allocation data...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Room Allocation Management</span>
          </CardTitle>
          <CardDescription>
            Manage student accommodation and room assignments
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="rooms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rooms">Rooms Overview</TabsTrigger>
          <TabsTrigger value="students">Students Needing Rooms</TabsTrigger>
          <TabsTrigger value="allocations">Current Allocations</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Filters</CardTitle>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search room number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                </div>
                <Select value={filters.roomType} onValueChange={(value) => setFilters(prev => ({ ...prev, roomType: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="dorm">Dorm</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.gender} onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.availability} onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Monthly Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{room.room_number}</div>
                          <div className="text-sm text-muted-foreground">
                            {room.building_name}, Floor {room.floor_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{room.room_type}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{room.current_occupancy}/{room.capacity}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getGenderBadge(room.gender_restriction)}</TableCell>
                      <TableCell>K{room.monthly_fee}</TableCell>
                      <TableCell>{getAvailabilityBadge(room)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRoom(room)}
                            >
                              <Bed className="w-4 h-4 mr-1" />
                              Manage
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Room {room.room_number} - {room.building_name}</DialogTitle>
                              <DialogDescription>
                                Manage occupancy and allocate students to this room
                              </DialogDescription>
                            </DialogHeader>

                            {selectedRoom && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Room Details</Label>
                                    <div className="text-sm space-y-1">
                                      <div>Type: {selectedRoom.room_type}</div>
                                      <div>Capacity: {selectedRoom.capacity}</div>
                                      <div>Current Occupancy: {selectedRoom.current_occupancy}</div>
                                      <div>Monthly Fee: K{selectedRoom.monthly_fee}</div>
                                      <div>Gender: {selectedRoom.gender_restriction || 'Any'}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Amenities</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {selectedRoom.amenities.map((amenity, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {amenity}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label>Current Occupants</Label>
                                  {selectedRoom.allocations && selectedRoom.allocations.length > 0 ? (
                                    <div className="space-y-2 mt-2">
                                      {selectedRoom.allocations.map((allocation) => (
                                        <div key={allocation.id} className="flex items-center justify-between p-2 border rounded">
                                          <div>
                                            <div className="font-medium">{allocation.student?.users?.full_name}</div>
                                            <div className="text-sm text-muted-foreground">
                                              {allocation.student?.student_number} • {allocation.student?.programs?.name}
                                            </div>
                                          </div>
                                          <Badge variant={allocation.allocation_fee_paid ? "outline" : "destructive"}>
                                            {allocation.allocation_fee_paid ? "Paid" : "Fee Pending"}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-muted-foreground mt-2">No current occupants</div>
                                  )}
                                </div>

                                {selectedRoom.current_occupancy < selectedRoom.capacity && (
                                  <div>
                                    <Label>Allocate New Student</Label>
                                    <Select onValueChange={(value) => setSelectedStudent(studentsNeedingRooms.find(s => s.id === value) || null)}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select student..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {studentsNeedingRooms
                                          .filter(student =>
                                            !selectedRoom.gender_restriction ||
                                            student.gender === selectedRoom.gender_restriction
                                          )
                                          .map((student) => (
                                          <SelectItem key={student.id} value={student.id}>
                                            {student.users?.full_name} ({student.student_number})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>

                                    {selectedStudent && (
                                      <div className="mt-4 space-y-3">
                                        <div className="p-3 border rounded">
                                          <div className="font-medium">{selectedStudent.users?.full_name}</div>
                                          <div className="text-sm text-muted-foreground">
                                            {selectedStudent.student_number} • {selectedStudent.programs?.name}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            Preferred: {selectedStudent.room_preference} room
                                          </div>
                                        </div>

                                        <div>
                                          <Label htmlFor="allocationNotes">Allocation Notes</Label>
                                          <Textarea
                                            id="allocationNotes"
                                            placeholder="Add notes about this allocation..."
                                            value={allocationNotes}
                                            onChange={(e) => setAllocationNotes(e.target.value)}
                                          />
                                        </div>

                                        <Button
                                          onClick={() => handleAllocateRoom(selectedRoom.id, selectedStudent.id)}
                                          disabled={processing}
                                          className="w-full"
                                        >
                                          <UserPlus className="w-4 h-4 mr-1" />
                                          Allocate Room
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Students Requiring Accommodation</CardTitle>
              <CardDescription>
                Students who have paid residence fees but haven't been allocated rooms yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studentsNeedingRooms.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All students requiring accommodation have been allocated rooms.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Preference</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsNeedingRooms.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.users?.full_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {student.student_number}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {student.users?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.programs?.name}</div>
                            <div className="text-sm text-muted-foreground">{student.programs?.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getGenderBadge(student.gender)}</TableCell>
                        <TableCell className="capitalize">{student.room_preference}</TableCell>
                        <TableCell>{student.registration_date}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            Find Room
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Current Allocations</CardTitle>
              <CardDescription>
                Overview of all active room allocations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Allocation Date</TableHead>
                    <TableHead>Fee Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.flatMap(room =>
                    (room.allocations || []).map(allocation => (
                      <TableRow key={allocation.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{room.room_number}</div>
                            <div className="text-sm text-muted-foreground">{room.building_name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{allocation.student?.users?.full_name}</div>
                            <div className="text-sm text-muted-foreground">{allocation.student?.student_number}</div>
                          </div>
                        </TableCell>
                        <TableCell>{allocation.student?.programs?.name}</TableCell>
                        <TableCell>{allocation.allocated_date}</TableCell>
                        <TableCell>
                          <Badge variant={allocation.allocation_fee_paid ? "outline" : "destructive"}>
                            {allocation.allocation_fee_paid ? "Paid" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
