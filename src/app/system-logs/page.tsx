'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Download, Filter, RefreshCw } from 'lucide-react'

interface SystemLog {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  action: string
  user: string
  ip_address: string
  details: string
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sampleLogs: SystemLog[] = [
      {
        id: '1',
        timestamp: '2024-08-01 14:30:25',
        level: 'info',
        action: 'User Login',
        user: 'admin@npi.pg',
        ip_address: '192.168.1.100',
        details: 'Successful login from admin panel'
      },
      {
        id: '2',
        timestamp: '2024-08-01 14:25:15',
        level: 'success',
        action: 'Course Created',
        user: 'instructor@npi.pg',
        ip_address: '192.168.1.105',
        details: 'New course "Advanced Mathematics" created in Engineering Department'
      },
      {
        id: '3',
        timestamp: '2024-08-01 14:20:42',
        level: 'warning',
        action: 'Failed Login Attempt',
        user: 'unknown',
        ip_address: '192.168.1.200',
        details: 'Failed login attempt with email: test@example.com'
      },
      {
        id: '4',
        timestamp: '2024-08-01 14:15:33',
        level: 'info',
        action: 'Grade Updated',
        user: 'instructor@npi.pg',
        ip_address: '192.168.1.105',
        details: 'Grade updated for student ID: NPI2024001 in course ENG201'
      },
      {
        id: '5',
        timestamp: '2024-08-01 14:10:18',
        level: 'error',
        action: 'Database Connection Error',
        user: 'system',
        ip_address: '127.0.0.1',
        details: 'Temporary database connection timeout - automatically resolved'
      },
      {
        id: '6',
        timestamp: '2024-08-01 14:05:56',
        level: 'info',
        action: 'Student Enrolled',
        user: 'admin@npi.pg',
        ip_address: '192.168.1.100',
        details: 'Student NPI2024002 enrolled in Diploma in Civil Engineering'
      },
      {
        id: '7',
        timestamp: '2024-08-01 14:00:12',
        level: 'success',
        action: 'System Backup',
        user: 'system',
        ip_address: '127.0.0.1',
        details: 'Daily database backup completed successfully'
      },
      {
        id: '8',
        timestamp: '2024-08-01 13:55:47',
        level: 'warning',
        action: 'Multiple Login Attempts',
        user: 'student@npi.pg',
        ip_address: '192.168.1.150',
        details: '5 failed login attempts in 10 minutes - account temporarily locked'
      }
    ]
    setLogs(sampleLogs)
    setFilteredLogs(sampleLogs)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = logs

    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter)
    }

    setFilteredLogs(filtered)
  }, [logs, searchQuery, levelFilter])

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'info':
        return <Badge variant="secondary">Info</Badge>
      case 'success':
        return <Badge variant="default">Success</Badge>
      case 'warning':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Warning</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  const handleExport = () => {
    console.log('Exporting logs...')
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Logs</h1>
          <p className="text-muted-foreground">Monitor system activities and audit trails</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{logs.filter(l => l.level === 'error').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{logs.filter(l => l.level === 'warning').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{logs.filter(l => l.level === 'success').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>System activities and user actions</CardDescription>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 opacity-50" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 opacity-50" />
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    {getLevelBadge(log.level)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {log.action}
                  </TableCell>
                  <TableCell>
                    {log.user}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.ip_address}
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No logs found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
