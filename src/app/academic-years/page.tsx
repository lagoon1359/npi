'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react'

interface AcademicYear {
  id: string
  year_name: string
  start_date: string
  end_date: string
  is_current: boolean
  total_students: number
  total_semesters: number
}

export default function AcademicYearsPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sampleYears: AcademicYear[] = [
      {
        id: '1',
        year_name: '2024',
        start_date: '2024-02-01',
        end_date: '2024-12-15',
        is_current: true,
        total_students: 164,
        total_semesters: 2
      },
      {
        id: '2',
        year_name: '2023',
        start_date: '2023-02-01',
        end_date: '2023-12-15',
        is_current: false,
        total_students: 142,
        total_semesters: 2
      },
      {
        id: '3',
        year_name: '2022',
        start_date: '2022-02-01',
        end_date: '2022-12-15',
        is_current: false,
        total_students: 138,
        total_semesters: 2
      }
    ]
    setAcademicYears(sampleYears)
    setLoading(false)
  }, [])

  const handleAddYear = () => {
    setIsAddDialogOpen(false)
  }

  const handleSetCurrent = (yearId: string) => {
    setAcademicYears(years => years.map(year => ({
      ...year,
      is_current: year.id === yearId
    })))
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Academic Years</h1>
          <p className="text-muted-foreground">Manage academic years and semesters</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Academic Year
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Academic Year</DialogTitle>
              <DialogDescription>Create a new academic year</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="year-name">Year Name</Label>
                <Input id="year-name" placeholder="e.g., 2025" />
              </div>
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
              <Button onClick={handleAddYear} className="w-full">Add Academic Year</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Academic Years</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{academicYears.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {academicYears.find(y => y.is_current)?.year_name || 'None'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {academicYears.find(y => y.is_current)?.total_students || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Years</CardTitle>
          <CardDescription>Manage academic years and their periods</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {academicYears.map((year) => (
                <TableRow key={year.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{year.year_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(year.start_date).toLocaleDateString()} - {new Date(year.end_date).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {Math.round((new Date(year.end_date).getTime() - new Date(year.start_date).getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{year.total_students} Students</div>
                      <div className="text-gray-500">{year.total_semesters} Semesters</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={year.is_current ? "default" : "secondary"}>
                      {year.is_current ? 'Current' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {!year.is_current && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetCurrent(year.id)}
                        >
                          Set Current
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
