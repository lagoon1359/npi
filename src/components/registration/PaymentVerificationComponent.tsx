'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, CheckCircle, XCircle, Clock, DollarSign, Receipt, User } from 'lucide-react'
import type { StudentPayment, StudentExtended } from '@/lib/types'

interface PaymentVerificationComponentProps {
  onPaymentVerified?: () => void
}

interface PaymentWithDetails extends StudentPayment {
  student?: StudentExtended & {
    users?: { full_name: string; email: string }
    programs?: { name: string; code: string }
  }
  fee_structure?: {
    fee_type: string
    description: string
    amount: number
  }
}

export default function PaymentVerificationComponent({ onPaymentVerified }: PaymentVerificationComponentProps) {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithDetails | null>(null)
  const [verificationNotes, setVerificationNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchPendingPayments()
  }, [])

  const fetchPendingPayments = async () => {
    try {
      setLoading(true)

      // Mock data for demonstration - replace with actual API call
      const mockPayments: PaymentWithDetails[] = [
        {
          id: '1',
          student_id: 'student1',
          fee_structure_id: 'fee1',
          amount_paid: 2500,
          payment_method: 'online',
          receipt_number: 'RCP001234',
          receipt_url: '/receipts/receipt1.pdf',
          payment_date: '2024-01-15',
          verification_status: 'pending',
          manual_entry_flag: false,
          notes: 'Bank transfer receipt uploaded',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          student: {
            id: 'student1',
            user_id: 'user1',
            student_number: 'NPI2024DCE001',
            program_id: 'prog1',
            student_type: 'full_time',
            student_category: 'day_scholar',
            year_level: 1,
            enrollment_year: 2024,
            gender: 'male',
            date_of_birth: '2000-05-15',
            biometric_enrolled: false,
            registration_date: '2024-01-15',
            is_active: true,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
            users: {
              full_name: 'John Doe',
              email: 'john.doe@email.com'
            },
            programs: {
              name: 'Diploma in Civil Engineering',
              code: 'DCE'
            }
          },
          fee_structure: {
            fee_type: 'tuition',
            description: 'Tuition Fee',
            amount: 2500
          }
        },
        {
          id: '2',
          student_id: 'student2',
          fee_structure_id: 'fee2',
          amount_paid: 1200,
          payment_method: 'online',
          receipt_number: 'RCP001235',
          receipt_url: '/receipts/receipt2.pdf',
          payment_date: '2024-01-16',
          verification_status: 'pending',
          manual_entry_flag: false,
          notes: 'Mobile money payment',
          created_at: '2024-01-16T14:20:00Z',
          updated_at: '2024-01-16T14:20:00Z',
          student: {
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
            created_at: '2024-01-16T14:00:00Z',
            updated_at: '2024-01-16T14:00:00Z',
            users: {
              full_name: 'Jane Smith',
              email: 'jane.smith@email.com'
            },
            programs: {
              name: 'Diploma in Electrical Engineering',
              code: 'DEE'
            }
          },
          fee_structure: {
            fee_type: 'boarding',
            description: 'Boarding/Residence Fee',
            amount: 1200
          }
        }
      ]

      setPayments(mockPayments)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPayment = async (paymentId: string, status: 'verified' | 'rejected') => {
    try {
      setProcessing(true)

      // Mock API call - replace with actual verification
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update payment status locally
      setPayments(prev => prev.map(payment =>
        payment.id === paymentId
          ? {
              ...payment,
              verification_status: status,
              notes: verificationNotes || payment.notes
            }
          : payment
      ))

      setSelectedPayment(null)
      setVerificationNotes('')
      onPaymentVerified?.()

    } catch (error) {
      console.error('Error verifying payment:', error)
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'verified':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>
      case 'rejected':
        return <Badge variant="outline" className="text-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Loading payment verification data...</div>
        </CardContent>
      </Card>
    )
  }

  const pendingPayments = payments.filter(p => p.verification_status === 'pending')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Payment Verification</span>
          </CardTitle>
          <CardDescription>
            Review and verify student payment receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingPayments.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                No pending payments require verification at this time.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.student?.users?.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.student?.student_number}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.student?.programs?.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.fee_structure?.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.fee_structure?.fee_type}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        K{payment.amount_paid}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{payment.payment_method}</TableCell>
                    <TableCell>
                      {payment.receipt_number && (
                        <div>
                          <div className="font-mono text-sm">{payment.receipt_number}</div>
                          {payment.receipt_url && (
                            <Button variant="link" size="sm" className="p-0 h-auto">
                              View Receipt
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.verification_status)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Payment Verification</DialogTitle>
                            <DialogDescription>
                              Review payment details and verify or reject this payment
                            </DialogDescription>
                          </DialogHeader>

                          {selectedPayment && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Student</Label>
                                  <div className="text-sm">
                                    <div className="font-medium">{selectedPayment.student?.users?.full_name}</div>
                                    <div className="text-muted-foreground">{selectedPayment.student?.student_number}</div>
                                    <div className="text-muted-foreground">{selectedPayment.student?.users?.email}</div>
                                  </div>
                                </div>
                                <div>
                                  <Label>Program</Label>
                                  <div className="text-sm">
                                    <div className="font-medium">{selectedPayment.student?.programs?.name}</div>
                                    <div className="text-muted-foreground">{selectedPayment.student?.programs?.code}</div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Fee Details</Label>
                                  <div className="text-sm">
                                    <div className="font-medium">{selectedPayment.fee_structure?.description}</div>
                                    <div className="text-muted-foreground">Amount: K{selectedPayment.fee_structure?.amount}</div>
                                  </div>
                                </div>
                                <div>
                                  <Label>Payment Details</Label>
                                  <div className="text-sm">
                                    <div className="font-medium">K{selectedPayment.amount_paid}</div>
                                    <div className="text-muted-foreground">{selectedPayment.payment_method}</div>
                                    <div className="text-muted-foreground">{selectedPayment.payment_date}</div>
                                  </div>
                                </div>
                              </div>

                              {selectedPayment.receipt_number && (
                                <div>
                                  <Label>Receipt Information</Label>
                                  <div className="text-sm">
                                    <div className="font-mono">{selectedPayment.receipt_number}</div>
                                    {selectedPayment.receipt_url && (
                                      <Button variant="link" size="sm" className="p-0 h-auto">
                                        View Receipt Document
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}

                              {selectedPayment.notes && (
                                <div>
                                  <Label>Notes</Label>
                                  <div className="text-sm p-2 bg-muted rounded">
                                    {selectedPayment.notes}
                                  </div>
                                </div>
                              )}

                              <div>
                                <Label htmlFor="verificationNotes">Verification Notes</Label>
                                <Textarea
                                  id="verificationNotes"
                                  placeholder="Add notes about the verification..."
                                  value={verificationNotes}
                                  onChange={(e) => setVerificationNotes(e.target.value)}
                                />
                              </div>

                              <div className="flex space-x-2 pt-4">
                                <Button
                                  onClick={() => handleVerifyPayment(selectedPayment.id, 'verified')}
                                  disabled={processing}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Verify Payment
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleVerifyPayment(selectedPayment.id, 'rejected')}
                                  disabled={processing}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject Payment
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
