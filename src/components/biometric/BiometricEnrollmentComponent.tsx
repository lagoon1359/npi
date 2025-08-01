'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Camera,
  Fingerprint,
  CheckCircle,
  X,
  RotateCcw,
  Download,
  User,
  Shield,
  AlertTriangle,
  Scan
} from 'lucide-react'
import type { BiometricRecord, StudentExtended } from '@/lib/types'

interface BiometricEnrollmentProps {
  student: StudentExtended & {
    users?: { full_name: string; email: string }
    programs?: { name: string; code: string }
  }
  onEnrollmentComplete?: (biometricData: Partial<BiometricRecord>) => void
}

export default function BiometricEnrollmentComponent({
  student,
  onEnrollmentComplete
}: BiometricEnrollmentProps) {
  const webcamRef = useRef<Webcam>(null)
  const [photoCapture, setPhotoCapture] = useState({
    captured: false,
    imageData: '',
    retakeCount: 0
  })
  const [fingerprintScan, setFingerprintScan] = useState({
    scanning: false,
    scanned: false,
    quality: 0,
    attempts: 0
  })
  const [enrollmentStep, setEnrollmentStep] = useState<'photo' | 'fingerprint' | 'complete'>('photo')
  const [processing, setProcessing] = useState(false)

  // Simulate fingerprint scanning
  useEffect(() => {
    if (fingerprintScan.scanning) {
      const interval = setInterval(() => {
        setFingerprintScan(prev => {
          const newQuality = Math.min(prev.quality + Math.random() * 20, 100)

          if (newQuality >= 85) {
            setTimeout(() => {
              setFingerprintScan(current => ({
                ...current,
                scanning: false,
                scanned: true,
                quality: newQuality
              }))
            }, 1000)
          }

          return { ...prev, quality: newQuality }
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [fingerprintScan.scanning])

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setPhotoCapture({
        captured: true,
        imageData: imageSrc,
        retakeCount: photoCapture.retakeCount + 1
      })
    }
  }, [photoCapture.retakeCount])

  const retakePhoto = () => {
    setPhotoCapture(prev => ({
      captured: false,
      imageData: '',
      retakeCount: prev.retakeCount
    }))
  }

  const startFingerprintScan = () => {
    setFingerprintScan({
      scanning: true,
      scanned: false,
      quality: 0,
      attempts: fingerprintScan.attempts + 1
    })
  }

  const retryFingerprintScan = () => {
    setFingerprintScan(prev => ({
      scanning: false,
      scanned: false,
      quality: 0,
      attempts: prev.attempts
    }))
  }

  const completeEnrollment = async () => {
    setProcessing(true)

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))

      const biometricData: Partial<BiometricRecord> = {
        student_id: student.id,
        fingerprint_data: fingerprintScan.scanned ? 'encrypted_fingerprint_hash_' + Date.now() : undefined,
        face_scan_data: photoCapture.captured ? 'encrypted_face_data_' + Date.now() : undefined,
        enrollment_date: new Date().toISOString().split('T')[0],
        last_updated: new Date().toISOString().split('T')[0],
        quality_score: Math.round(fingerprintScan.quality),
        created_at: new Date().toISOString()
      }

      setEnrollmentStep('complete')
      onEnrollmentComplete?.(biometricData)
    } catch (error) {
      console.error('Enrollment error:', error)
    } finally {
      setProcessing(false)
    }
  }

  const canProceedToFingerprint = photoCapture.captured
  const canCompleteEnrollment = photoCapture.captured && fingerprintScan.scanned

  if (enrollmentStep === 'complete') {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-800">Biometric Enrollment Complete!</h2>
          <p className="text-muted-foreground mt-2">
            Your biometric data has been successfully enrolled in the system.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Enrollment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Student</p>
                <p className="text-lg">{student.users?.full_name}</p>
                <p className="text-sm text-muted-foreground">{student.student_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Program</p>
                <p className="text-lg">{student.programs?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-green-600" />
                <span>Photo Captured</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center space-x-2">
                <Fingerprint className="h-5 w-5 text-green-600" />
                <span>Fingerprint Enrolled</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Quality Score</p>
              <div className="flex items-center space-x-2 mt-1">
                <Progress value={fingerprintScan.quality} className="flex-1" />
                <span className="text-sm font-bold">{Math.round(fingerprintScan.quality)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Next Steps:</strong> Your student ID card and meal card will be generated automatically.
            Visit the student services office to collect your physical cards within 2-3 business days.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scan className="h-5 w-5" />
            <span>Biometric Enrollment</span>
          </CardTitle>
          <CardDescription>
            Complete your biometric enrollment for {student.users?.full_name} ({student.student_number})
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={enrollmentStep} onValueChange={(value) => setEnrollmentStep(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="photo" disabled={!photoCapture.captured && enrollmentStep !== 'photo'}>
            <Camera className="h-4 w-4 mr-2" />
            Photo Capture
          </TabsTrigger>
          <TabsTrigger value="fingerprint" disabled={!canProceedToFingerprint}>
            <Fingerprint className="h-4 w-4 mr-2" />
            Fingerprint Scan
          </TabsTrigger>
          <TabsTrigger value="complete" disabled={!canCompleteEnrollment}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Photo Capture</CardTitle>
              <CardDescription>
                Take a clear photo for your student ID card. Make sure you're in a well-lit area.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!photoCapture.captured ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="relative">
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        width={320}
                        height={240}
                        className="border rounded-lg"
                      />
                      <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg pointer-events-none opacity-50" />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Position yourself in the center of the camera view
                    </p>
                    <Button onClick={capturePhoto} size="lg">
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={photoCapture.imageData}
                      alt="Captured photo"
                      className="w-80 h-60 object-cover border rounded-lg"
                    />
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" onClick={retakePhoto}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake Photo
                    </Button>
                    <Button onClick={() => setEnrollmentStep('fingerprint')}>
                      Continue to Fingerprint
                    </Button>
                  </div>

                  {photoCapture.retakeCount > 1 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Photo quality is important for ID card generation. Ensure good lighting and clear visibility.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fingerprint" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fingerprint Enrollment</CardTitle>
              <CardDescription>
                Place your finger on the scanner and hold steady for best results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center relative">
                  <Fingerprint className={`h-16 w-16 ${fingerprintScan.scanning ? 'text-blue-600 animate-pulse' : fingerprintScan.scanned ? 'text-green-600' : 'text-gray-400'}`} />

                  {fingerprintScan.scanning && (
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping" />
                  )}

                  {fingerprintScan.scanned && (
                    <div className="absolute -top-2 -right-2">
                      <CheckCircle className="h-8 w-8 text-green-600 bg-white rounded-full" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {fingerprintScan.scanning ? 'Scanning...' :
                     fingerprintScan.scanned ? 'Scan Complete!' :
                     'Ready to Scan'}
                  </p>

                  {fingerprintScan.scanning && (
                    <div className="space-y-2">
                      <Progress value={fingerprintScan.quality} className="w-64 mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Quality: {Math.round(fingerprintScan.quality)}%
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-x-4">
                  {!fingerprintScan.scanning && !fingerprintScan.scanned && (
                    <Button onClick={startFingerprintScan} size="lg">
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Start Scan
                    </Button>
                  )}

                  {fingerprintScan.scanned && (
                    <>
                      <Button variant="outline" onClick={retryFingerprintScan}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retry Scan
                      </Button>
                      <Button onClick={completeEnrollment} disabled={processing}>
                        {processing ? 'Processing...' : 'Complete Enrollment'}
                      </Button>
                    </>
                  )}
                </div>

                {fingerprintScan.attempts > 2 && !fingerprintScan.scanned && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Having trouble? Make sure your finger is clean and dry, and press firmly on the scanner.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
