'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  BarChart3,
  Building,
  Calendar,
  Settings,
  ArrowRight,
  CheckCircle,
  UserPlus,
  Shield,
  CreditCard,
  Home,
  Smartphone,
  Globe,
  Info,
  User
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: UserPlus,
      title: 'Student Registration',
      description: 'Complete online registration with payment verification and room allocation'
    },
    {
      icon: CreditCard,
      title: 'Payment Management',
      description: 'Online payments, mobile money, and cash payment verification'
    },
    {
      icon: Home,
      title: 'Accommodation System',
      description: 'Room allocation and boarding management for residential students'
    },
    {
      icon: Users,
      title: 'Biometric Integration',
      description: 'Fingerprint and face recognition for student identification'
    },
    {
      icon: FileText,
      title: 'Transcript Generation',
      description: 'Automated academic transcript generation and official documentation'
    },
    {
      icon: Shield,
      title: 'Admin Dashboard',
      description: 'Comprehensive management tools for administrators and staff'
    }
  ]

  const registrationFeatures = [
    'Full-time and Part-time student registration',
    'Bridging course and industrial training enrollment',
    'PNG-specific payment methods (ANZ Bank, Mobile Money)',
    'Automatic student ID and meal card generation',
    'Room allocation for boarding students',
    'Document upload and verification'
  ]

  const quickActions = [
    {
      href: '/student-registration',
      title: 'Student Registration',
      description: 'Apply for admission online',
      icon: UserPlus,
      variant: 'default' as const,
      highlight: true
    },
    {
      href: '/biometric-enrollment',
      title: 'Biometric Enrollment',
      description: 'Complete your enrollment',
      icon: User,
      variant: 'outline' as const
    },
    {
      href: '/transcript-generator',
      title: 'Generate Transcript',
      description: 'Official academic records',
      icon: FileText,
      variant: 'outline' as const
    },
    {
      href: '/admin-dashboard',
      title: 'Admin Portal',
      description: 'Management dashboard',
      icon: BarChart3,
      variant: 'outline' as const
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            NPI PNG Student Registration
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete student registration and academic management system for the National Polytechnic Institute of Papua New Guinea
          </p>

          <Alert className="max-w-2xl mx-auto mb-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>New Student Registration Now Open!</strong> Apply online with support for PNG banking and mobile money payments.
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap justify-center gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.href}
                  variant={action.variant}
                  size="lg"
                  asChild
                  className={`flex items-center space-x-2 ${action.highlight ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  <Link href={action.href}>
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div>{action.title}</div>
                      <div className="text-xs opacity-80">{action.description}</div>
                    </div>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Registration Features Section */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Student Registration Features
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our comprehensive registration system is designed specifically for Papua New Guinea students with local payment methods and accommodation management.
              </p>
              <div className="space-y-3">
                {registrationFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <span>Mobile Payments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Pay registration fees using Digicel MiCash, Vodafone M-PAiSA, or traditional bank transfer.</p>
                </CardContent>
              </Card>
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Home className="h-5 w-5 text-green-600" />
                    <span>Accommodation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Automatic room allocation for boarding students with preference-based matching.</p>
                </CardContent>
              </Card>
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    <span>24/7 Access</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Register anytime, anywhere with our online portal accessible from any device.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            System Features
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need for comprehensive student management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="relative hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Supported Payment Methods
            </h2>
            <p className="text-lg text-gray-600">
              Multiple payment options for student convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Bank Transfer</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <CreditCard className="h-12 w-12 mx-auto text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">ANZ Bank PNG and other major banks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Mobile Money</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <Smartphone className="h-12 w-12 mx-auto text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Digicel MiCash & Vodafone M-PAiSA</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Campus Payment</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <Building className="h-12 w-12 mx-auto text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">Cash payments at finance office</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-lg text-gray-600">
              Secure, reliable, and scalable platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              'Next.js 15.3.2',
              'TypeScript',
              'Tailwind CSS',
              'shadcn/ui',
              'PostgreSQL',
              'Supabase',
              'Row Level Security',
              'Biometric Integration'
            ].map((tech) => (
              <div key={tech} className="text-center">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {tech}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 National Polytechnic Institute of PNG
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Technical and Vocational Education Training System
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link href="/student-registration" className="text-sm text-blue-600 hover:text-blue-800">
                Student Registration
              </Link>
              <Link href="/admin-dashboard" className="text-sm text-blue-600 hover:text-blue-800">
                Admin Portal
              </Link>
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
