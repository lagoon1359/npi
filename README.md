# 🎓 NPI PNG Student Assessment System

A comprehensive Technical and Vocational Education Training (TVET) assessment system built for the National Polytechnic Institute of Papua New Guinea.

## 🔧 System Overview

This is a full-stack web application designed to manage student assessments, grades, and academic records for TVET institutions. The system supports multiple user roles and provides comprehensive tools for academic administration.

### Features Implemented

✅ **Role-Based Authentication System**
- Admin, Department Head, Instructor/Lecturer/Tutor, Student roles
- Secure login with role-based dashboard access
- User profile management

✅ **Comprehensive Dashboards**
- **Admin Dashboard**: System overview, statistics, and administrative tools
- **Department Head Dashboard**: Department management, course oversight, approval workflows
- **Instructor Dashboard**: Course management, assessment creation, student grading
- **Student Dashboard**: Course progress, grades, transcript access

✅ **Academic Management**
- Department management with statistics
- Course management with role-based views
- User management with role assignment
- Comprehensive database schema for TVET workflows

✅ **Responsive Design**
- Modern UI built with Tailwind CSS and Shadcn/UI
- Mobile-friendly responsive layouts
- Consistent design system

## 🏗️ Technical Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Shadcn/UI components
- **TypeScript**: Full type safety
- **Authentication**: Supabase Auth integration ready

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **API**: Next.js API routes
- **ORM**: Supabase client

### Deployment
- **Platform**: Vercel/Netlify compatible
- **Environment**: Cloud-hosted with CDN
- **Backup**: Automated cloud backups

## 🗂️ Database Schema

The system includes a comprehensive database schema with:

- **Users & Roles**: Multi-role user management
- **Academic Structure**: Departments, Programs, Courses, Semesters
- **Assessment System**: Flexible assessment types with weighting
- **Grading Engine**: Customizable grade criteria and GPA calculation
- **Student Records**: Complete academic history and transcripts
- **Reporting**: Comprehensive analytics and export capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd npi-png-assessment-system
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up the database**
   ```bash
   # Run the database schema
   psql -U your_user -d your_database -f database/schema.sql

   # Optional: Add sample data
   psql -U your_user -d your_database -f database/sample-data.sql
   ```

5. **Start the development server**
   ```bash
   bun dev
   # or npm run dev
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Use demo credentials (see Login page) or create your admin user

## 👥 User Roles & Permissions

### Administrator
- Full system access
- User management (create, edit, delete users)
- Department management
- System settings and configuration
- Generate system-wide reports

### Department Head
- Manage department courses and programs
- Approve course setups and modifications
- Review assessment plans
- Monitor department performance
- Manage department instructors

### Instructor/Lecturer/Tutor
- Create and manage course assessments
- Enter student grades and feedback
- View enrolled student lists
- Generate class reports
- Manage course materials

### Student
- View enrolled courses and progress
- Check grades and feedback
- Download transcripts
- View academic history
- Access course schedules

## 📊 Key Features

### Assessment Management
- Flexible assessment types (assignments, exams, practicals, projects)
- Customizable weighting and grade criteria
- Automated GPA calculation
- Moderation workflows

### Academic Structure
- Multi-department support
- Program duration (1-4 years)
- Semester-based organization
- Credit hour tracking

### Reporting & Analytics
- Student transcripts (PDF export)
- Class performance reports
- Department analytics
- System usage statistics

### Data Management
- Comprehensive student profiles
- Academic progression tracking
- Enrollment management
- Grade history and appeals

## 🔒 Security Features

- Role-based access control (RBAC)
- Secure authentication with Supabase
- Row-level security (RLS) policies
- Input validation and sanitization
- Audit trails for grade modifications

## 📈 Future Enhancements

- [ ] Mobile app version
- [ ] Integration with national TVET records
- [ ] Biometric authentication for assessments
- [ ] AI-powered grade analytics
- [ ] Advanced reporting and dashboards
- [ ] Email notification system
- [ ] File upload for assignments
- [ ] Plagiarism detection
- [ ] Video conferencing integration
- [ ] Advanced calendar and scheduling

## 🛠️ Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
│   ├── dashboards/     # Role-specific dashboards
│   ├── layout/         # Layout components
│   └── ui/             # Shadcn/UI components
├── contexts/           # React contexts (Auth, etc.)
├── lib/                # Utilities and configurations
└── types/              # TypeScript type definitions

database/
├── schema.sql          # Complete database schema
└── sample-data.sql     # Sample data for testing
```

### Key Technologies
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Component library
- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Database
- **Bun**: Fast JavaScript runtime and package manager

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For technical support or questions about the system:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🙏 Acknowledgments

- National Polytechnic Institute of Papua New Guinea
- TVET sector stakeholders
- Open source community contributions

---

**Built with ❤️ for TVET Education in Papua New Guinea**
