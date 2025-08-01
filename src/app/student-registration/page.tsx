'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Upload, User, CreditCard, Home, FileText, Camera, AlertTriangle, CheckCircle, DollarSign, Phone, MapPin } from 'lucide-react'
import { StudentRegistrationService } from '@/lib/services/registration'
import type { RegistrationFormData, FeeStructure } from '@/lib/types'

// Using types from lib/types.ts

export default function StudentRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [registrationData, setRegistrationData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    nationality: '',
    nationalId: '',
    passportNumber: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianRelationship: '',
    programId: '',
    studentType: 'full_time',
    studentCategory: 'day_scholar',
    previousEducation: '',
    permanentAddress: '',
    currentAddress: '',
    emergencyContact: '',
    emergencyPhone: '',
    requiresAccommodation: false,
    roomPreference: 'double',
    selectedFees: [],
    paymentMethod: 'online',
    receiptNumber: '',
    receiptFile: null,
    birthCertificate: null,
    academicTranscripts: null,
    passport: null,
    photo: null
  })

  const [feeStructure, setFeeStructure] = useState<FeeStructure[]>([
    { id: '1', academic_year_id: '2024', program_id: '1', fee_type: 'tuition', amount: 2500, description: 'Tuition Fee', is_mandatory: true, created_at: '2024-01-01' },
    { id: '2', academic_year_id: '2024', program_id: '1', fee_type: 'project', amount: 300, description: 'Project/IT/Lab Fee', is_mandatory: true, created_at: '2024-01-01' },
    { id: '3', academic_year_id: '2024', program_id: '1', fee_type: 'library', amount: 150, description: 'Library Fee', is_mandatory: true, created_at: '2024-01-01' },
    { id: '4', academic_year_id: '2024', program_id: '1', fee_type: 'sports', amount: 100, description: 'Sports/Cultural Fee', is_mandatory: false, created_at: '2024-01-01' },
    { id: '5', academic_year_id: '2024', program_id: '1', fee_type: 'boarding', amount: 1200, description: 'Boarding/Residence Fee', is_mandatory: false, created_at: '2024-01-01' },
  ])

  const [programs] = useState([
    { id: '1', name: 'Diploma in Civil Engineering', code: 'DCE', duration: 3 },
    { id: '2', name: 'Diploma in Electrical Engineering', code: 'DEE', duration: 3 },
    { id: '3', name: 'Diploma in Business Management', code: 'DBM', duration: 2 },
    { id: '4', name: 'Certificate in Industrial Training', code: 'CIT', duration: 1 },
  ])

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // Calculate total fees
  const totalFees = feeStructure.reduce((total, fee) => {
    if (fee.is_mandatory || registrationData.selectedFees.includes(fee.id)) {
      return total + fee.amount
    }
    return total
  }, 0)

  const handleInputChange = (field: keyof RegistrationFormData, value: any) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }))

    // Auto-populate accommodation based on student category
    if (field === 'studentCategory') {
      if (value === 'boarder') {
        setRegistrationData(prev => ({ ...prev, requiresAccommodation: true }))
      } else if (value === 'day_scholar') {
        setRegistrationData(prev => ({ ...prev, requiresAccommodation: false }))
      }
    }
  }

  const handleFileUpload = (field: keyof RegistrationFormData, file: File | null) => {
    setRegistrationData(prev => ({ ...prev, [field]: file }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: string[] = []

    switch (step) {
      case 1: // Personal Information
        if (!registrationData.firstName) newErrors.push('First name is required')
        if (!registrationData.lastName) newErrors.push('Last name is required')
        if (!registrationData.email) newErrors.push('Email is required')
        if (!registrationData.phone) newErrors.push('Phone number is required')
        if (!registrationData.dateOfBirth) newErrors.push('Date of birth is required')
        if (!registrationData.gender) newErrors.push('Gender is required')
        break
      case 2: // Academic Information
        if (!registrationData.programId) newErrors.push('Program selection is required')
        if (!registrationData.studentType) newErrors.push('Student type is required')
        break
      case 3: // Payment Information
        if (!registrationData.paymentMethod) newErrors.push('Payment method is required')
        if (registrationData.paymentMethod === 'online' && !registrationData.receiptFile) {
          newErrors.push('Receipt upload is required for online payments')
        }
        break
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmitRegistration = async () => {
    setLoading(true)
    try {
      // Mock user ID - in real app, get from auth context
      const userId = 'current-user-id'

      const result = await StudentRegistrationService.submitRegistration(registrationData, userId)

      if (result.error) {
        setErrors([result.error])
      } else {
        console.log('Registration successful:', result.data)
        setCurrentStep(6) // Success step
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors(['Registration failed. Please try again.'])
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={registrationData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={registrationData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registrationData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={registrationData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={registrationData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Gender *</Label>
                    <Select value={registrationData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={registrationData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nationalId">National ID</Label>
                    <Input
                      id="nationalId"
                      value={registrationData.nationalId}
                      onChange={(e) => handleInputChange('nationalId', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passportNumber">Passport Number</Label>
                    <Input
                      id="passportNumber"
                      value={registrationData.passportNumber}
                      onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guardian Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guardianName">Guardian Name</Label>
                    <Input
                      id="guardianName"
                      value={registrationData.guardianName}
                      onChange={(e) => handleInputChange('guardianName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianPhone">Guardian Phone</Label>
                    <Input
                      id="guardianPhone"
                      value={registrationData.guardianPhone}
                      onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guardianEmail">Guardian Email</Label>
                    <Input
                      id="guardianEmail"
                      type="email"
                      value={registrationData.guardianEmail}
                      onChange={(e) => handleInputChange('guardianEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Relationship</Label>
                    <Select value={registrationData.guardianRelationship} onValueChange={(value) => handleInputChange('guardianRelationship', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="guardian">Guardian</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Program *</Label>
                  <Select value={registrationData.programId} onValueChange={(value) => handleInputChange('programId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map(program => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name} ({program.duration} years)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Student Type *</Label>
                  <RadioGroup
                    value={registrationData.studentType}
                    onValueChange={(value) => handleInputChange('studentType', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full_time" id="full_time" />
                      <Label htmlFor="full_time">Full-time Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="part_time" id="part_time" />
                      <Label htmlFor="part_time">Part-time Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="certification" id="certification" />
                      <Label htmlFor="certification">Certification/Bridging Course</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="industrial_training" id="industrial_training" />
                      <Label htmlFor="industrial_training">Industrial Training</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Student Category *</Label>
                  <RadioGroup
                    value={registrationData.studentCategory}
                    onValueChange={(value) => handleInputChange('studentCategory', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="day_scholar" id="day_scholar" />
                      <Label htmlFor="day_scholar">Day Scholar (Tuition only)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="boarder" id="boarder" />
                      <Label htmlFor="boarder">Boarder (Tuition + Residence)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="previousEducation">Previous Education</Label>
                  <Textarea
                    id="previousEducation"
                    placeholder="Details about your previous education..."
                    value={registrationData.previousEducation}
                    onChange={(e) => handleInputChange('previousEducation', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>Accommodation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresAccommodation"
                    checked={registrationData.requiresAccommodation}
                    onCheckedChange={(checked) => handleInputChange('requiresAccommodation', checked)}
                  />
                  <Label htmlFor="requiresAccommodation">I require on-campus accommodation</Label>
                </div>

                {registrationData.requiresAccommodation && (
                  <div>
                    <Label>Room Preference</Label>
                    <Select value={registrationData.roomPreference} onValueChange={(value) => handleInputChange('roomPreference', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Room</SelectItem>
                        <SelectItem value="double">Double Room (Shared)</SelectItem>
                        <SelectItem value="dorm">Dormitory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Fee Structure & Payment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Fee Breakdown</h4>
                  {feeStructure.map(fee => (
                    <div key={fee.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={fee.is_mandatory || registrationData.selectedFees.includes(fee.id)}
                          disabled={fee.is_mandatory}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleInputChange('selectedFees', [...registrationData.selectedFees, fee.id])
                            } else {
                              handleInputChange('selectedFees', registrationData.selectedFees.filter(id => id !== fee.id))
                            }
                          }}
                        />
                        <div>
                          <p className="font-medium">{fee.description}</p>
                          {fee.is_mandatory && <Badge variant="secondary">Mandatory</Badge>}
                        </div>
                      </div>
                      <p className="font-bold">K{fee.amount}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>K{totalFees}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Payment Method *</Label>
                    <RadioGroup
                      value={registrationData.paymentMethod}
                      onValueChange={(value) => handleInputChange('paymentMethod', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online">Online Payment (Bank Transfer/Mobile Money)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Cash Payment (Pay at Campus)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {registrationData.paymentMethod === 'online' && (
                    <div className="space-y-4">
                      <Alert>
                        <DollarSign className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Payment Instructions:</strong>
                          <div className="mt-2 space-y-2">
                            <div className="p-3 bg-muted rounded border">
                              <div className="font-semibold">Bank Transfer Details:</div>
                              <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                                <span>Bank:</span><span className="font-mono">ANZ Bank PNG</span>
                                <span>Account Name:</span><span className="font-mono">NPI PNG Student Fees</span>
                                <span>Account Number:</span><span className="font-mono">1234567890</span>
                                <span>BSB:</span><span className="font-mono">016-001</span>
                              </div>
                            </div>
                            <div className="p-3 bg-muted rounded border">
                              <div className="font-semibold">Mobile Money Options:</div>
                              <div className="text-sm mt-1">
                                <div>• <strong>Digicel MiCash:</strong> *858# (Merchant Code: NPI001)</div>
                                <div>• <strong>Vodafone M-PAiSA:</strong> *188# (Merchant Code: NPI002)</div>
                                <div>• <strong>EFTPOS:</strong> Available at campus finance office</div>
                              </div>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>

                      <div>
                        <Label htmlFor="receiptNumber">Receipt/Transaction Number *</Label>
                        <Input
                          id="receiptNumber"
                          placeholder="Enter your transaction reference number"
                          value={registrationData.receiptNumber}
                          onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="receiptFile">Upload Receipt/Screenshot *</Label>
                        <Input
                          id="receiptFile"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload('receiptFile', e.target.files?.[0] || null)}
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          Accepted formats: JPG, PNG, PDF (Max 5MB)
                        </div>
                      </div>
                    </div>
                  )}

                  {registrationData.paymentMethod === 'cash' && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Cash Payment Information:</strong>
                        <div className="mt-2">
                          <p>Visit the Finance Office at NPI PNG campus to complete your payment:</p>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Location: Finance Office, Building A, Ground Floor</li>
                            <li>Office Hours: 8:00 AM - 4:00 PM (Monday to Friday)</li>
                            <li>Bring this registration form (printed copy)</li>
                            <li>Payment must be completed within 7 days of registration</li>
                          </ul>
                          <p className="mt-2 font-medium">
                            Your registration will be confirmed after payment verification.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Document Upload</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="photo">Student Photo *</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('photo', e.target.files?.[0] || null)}
                  />
                </div>

                <div>
                  <Label htmlFor="birthCertificate">Birth Certificate</Label>
                  <Input
                    id="birthCertificate"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload('birthCertificate', e.target.files?.[0] || null)}
                  />
                </div>

                <div>
                  <Label htmlFor="academicTranscripts">Academic Transcripts</Label>
                  <Input
                    id="academicTranscripts"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload('academicTranscripts', e.target.files?.[0] || null)}
                  />
                </div>

                <div>
                  <Label htmlFor="passport">Passport/ID Copy</Label>
                  <Input
                    id="passport"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload('passport', e.target.files?.[0] || null)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Textarea
                    id="permanentAddress"
                    value={registrationData.permanentAddress}
                    onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="currentAddress">Current Address</Label>
                  <Textarea
                    id="currentAddress"
                    value={registrationData.currentAddress}
                    onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={registrationData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={registrationData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
                <CardDescription>Please review your information before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Personal Information</h4>
                    <p>{registrationData.firstName} {registrationData.lastName}</p>
                    <p>{registrationData.email}</p>
                    <p>{registrationData.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Program</h4>
                    <p>{programs.find(p => p.id === registrationData.programId)?.name}</p>
                    <p>Type: {registrationData.studentType.replace('_', ' ')}</p>
                    <p>Category: {registrationData.studentCategory.replace('_', ' ')}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Total Fees: K{totalFees}</h4>
                  <p>Payment Method: {registrationData.paymentMethod}</p>
                  {registrationData.paymentMethod === 'online' && (
                    <p>Receipt: {registrationData.receiptNumber}</p>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSubmitRegistration}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 6:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-green-800">Registration Completed!</h2>
              <p className="text-muted-foreground mt-2 text-lg">
                Welcome to the National Polytechnic Institute of PNG
              </p>
            </div>

            <Card className="text-left max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Your Registration Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Student Number</Label>
                    <div className="font-mono text-lg font-bold">NPI2024{programs.find(p => p.id === registrationData.programId)?.code || 'XXX'}XXX</div>
                  </div>
                  <div>
                    <Label>Program</Label>
                    <div className="font-medium">{programs.find(p => p.id === registrationData.programId)?.name}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Student Type</Label>
                    <div className="capitalize">{registrationData.studentType.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <div className="capitalize">{registrationData.studentCategory.replace('_', ' ')}</div>
                  </div>
                </div>

                <div>
                  <Label>Total Fees</Label>
                  <div className="text-2xl font-bold text-green-600">K{totalFees}</div>
                  <div className="text-sm text-muted-foreground">
                    Payment Method: {registrationData.paymentMethod === 'online' ? 'Online Transfer' : 'Cash Payment'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <Alert>
                <Phone className="h-4 w-4" />
                <AlertDescription>
                  <strong>Next Steps:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Check email for confirmation and payment receipt</li>
                    <li>Wait for payment verification (24-48 hours)</li>
                    <li>Schedule biometric enrollment appointment</li>
                    <li>Collect student ID card and meal card</li>
                    {registrationData.requiresAccommodation && <li>Room allocation notification</li>}
                  </ul>
                </AlertDescription>
              </Alert>

              <Alert>
                <MapPin className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important Information:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Registration office: Building A, Ground Floor</li>
                    <li>Office hours: 8:00 AM - 4:00 PM (Mon-Fri)</li>
                    <li>Contact: registrar@npi.pg | (675) 123-4567</li>
                    <li>Bring printed confirmation email when visiting</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={() => window.print()} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Print Confirmation
              </Button>
              <Button onClick={() => window.location.href = '/dashboard'}>
                <User className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Registration</h1>
        <p className="text-muted-foreground">National Polytechnic Institute of PNG</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[
            { step: 1, icon: User, label: 'Personal' },
            { step: 2, icon: FileText, label: 'Academic' },
            { step: 3, icon: CreditCard, label: 'Payment' },
            { step: 4, icon: Upload, label: 'Documents' },
            { step: 5, icon: CheckCircle, label: 'Review' }
          ].map(({ step, icon: Icon, label }) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step <= currentStep
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-muted'
                }`}
              >
                {step < currentStep ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className="text-xs mt-2 text-center">{label}</span>
            </div>
          ))}
        </div>
        <Progress value={(currentStep / 5) * 100} className="mb-2" />
        <div className="text-center text-sm text-muted-foreground">
          Step {currentStep} of 5
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      {currentStep < 6 && (
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            onClick={nextStep}
            disabled={currentStep === 5}
          >
            {currentStep === 5 ? 'Submit' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  )
}
