-- Fixed Sample Data for NPI PNG Student Assessment System
-- This version inserts data in the correct order to avoid dependency issues

-- First, insert Departments (these need to exist before other tables)
INSERT INTO departments (id, name, code, description, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Engineering Department', 'ENG', 'Faculty of Engineering and Technology', true),
('550e8400-e29b-41d4-a716-446655440002', 'Business Department', 'BUS', 'Faculty of Business and Commerce', true),
('550e8400-e29b-41d4-a716-446655440003', 'Sciences Department', 'SCI', 'Faculty of Applied Sciences', true);

-- Insert Academic Years
INSERT INTO academic_years (id, year_name, start_date, end_date, is_current) VALUES
('550e8400-e29b-41d4-a716-446655440010', '2024', '2024-02-01', '2024-12-15', true),
('550e8400-e29b-41d4-a716-446655440011', '2023', '2023-02-01', '2023-12-15', false);

-- Insert Semesters
INSERT INTO semesters (id, academic_year_id, semester_type, start_date, end_date, grading_deadline, is_current) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '1', '2024-02-01', '2024-06-30', '2024-07-15', true),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010', '2', '2024-08-01', '2024-12-15', '2025-01-15', false);

-- Insert Sample Users (with fixed UUIDs to avoid conflicts)
INSERT INTO users (id, email, full_name, role, phone, is_active) VALUES
-- Admin Users
('550e8400-e29b-41d4-a716-446655440030', 'admin@npi.pg', 'John Administrator', 'admin', '+675-123-4567', true),

-- Department Heads
('550e8400-e29b-41d4-a716-446655440031', 'eng.head@npi.pg', 'Dr. Mary Engineering', 'department_head', '+675-234-5678', true),
('550e8400-e29b-41d4-a716-446655440032', 'bus.head@npi.pg', 'Prof. Peter Business', 'department_head', '+675-345-6789', true),
('550e8400-e29b-41d4-a716-446655440033', 'sci.head@npi.pg', 'Dr. Sarah Sciences', 'department_head', '+675-456-7890', true),

-- Instructors
('550e8400-e29b-41d4-a716-446655440040', 'instructor@npi.pg', 'Dr. James Wilson', 'instructor', '+675-567-8901', true),
('550e8400-e29b-41d4-a716-446655440041', 'sarah.johnson@npi.pg', 'Prof. Sarah Johnson', 'instructor', '+675-678-9012', true),
('550e8400-e29b-41d4-a716-446655440042', 'michael.chen@npi.pg', 'Dr. Michael Chen', 'instructor', '+675-789-0123', true),
('550e8400-e29b-41d4-a716-446655440043', 'emily.davis@npi.pg', 'Ms. Emily Davis', 'instructor', '+675-890-1234', true),
('550e8400-e29b-41d4-a716-446655440044', 'robert.brown@npi.pg', 'Dr. Robert Brown', 'instructor', '+675-901-2345', true),

-- Students
('550e8400-e29b-41d4-a716-446655440050', 'student@npi.pg', 'Alice Student', 'student', '+675-111-2222', true),
('550e8400-e29b-41d4-a716-446655440051', 'bob.student@npi.pg', 'Bob Johnson', 'student', '+675-222-3333', true),
('550e8400-e29b-41d4-a716-446655440052', 'carol.smith@npi.pg', 'Carol Smith', 'student', '+675-333-4444', true);

-- Update Department Heads (now that both users and departments exist)
UPDATE departments SET head_id = '550e8400-e29b-41d4-a716-446655440031' WHERE code = 'ENG';
UPDATE departments SET head_id = '550e8400-e29b-41d4-a716-446655440032' WHERE code = 'BUS';
UPDATE departments SET head_id = '550e8400-e29b-41d4-a716-446655440033' WHERE code = 'SCI';

-- Insert Programs
INSERT INTO programs (id, name, code, department_id, duration_years, description, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440060', 'Diploma in Civil Engineering', 'DCE', '550e8400-e29b-41d4-a716-446655440001', 3, 'Three-year diploma program in civil engineering', true),
('550e8400-e29b-41d4-a716-446655440061', 'Diploma in Electrical Engineering', 'DEE', '550e8400-e29b-41d4-a716-446655440001', 3, 'Three-year diploma program in electrical engineering', true),
('550e8400-e29b-41d4-a716-446655440062', 'Diploma in Business Management', 'DBM', '550e8400-e29b-41d4-a716-446655440002', 2, 'Two-year diploma program in business management', true),
('550e8400-e29b-41d4-a716-446655440063', 'Diploma in Applied Sciences', 'DAS', '550e8400-e29b-41d4-a716-446655440003', 2, 'Two-year diploma program in applied sciences', true);

-- Insert Courses
INSERT INTO courses (id, name, code, department_id, program_id, year_level, semester, credit_hours, description, is_active) VALUES
-- Engineering Courses
('550e8400-e29b-41d4-a716-446655440070', 'Engineering Mathematics I', 'ENG101', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440060', 1, '1', 4, 'Fundamental mathematics for engineering students', true),
('550e8400-e29b-41d4-a716-446655440071', 'Advanced Engineering Mathematics', 'ENG201', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440060', 2, '1', 4, 'Advanced mathematical concepts for engineering', true),
('550e8400-e29b-41d4-a716-446655440072', 'Structural Analysis', 'ENG301', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440060', 3, '1', 3, 'Analysis of structural systems', true),
('550e8400-e29b-41d4-a716-446655440073', 'Engineering Project Management', 'ENG401', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440060', 3, '2', 3, 'Project management in engineering context', true),

-- Electrical Engineering
('550e8400-e29b-41d4-a716-446655440074', 'Circuit Analysis', 'ELE201', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440061', 2, '1', 4, 'Analysis of electrical circuits', true),
('550e8400-e29b-41d4-a716-446655440075', 'Digital Electronics', 'ELE301', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440061', 3, '1', 3, 'Digital electronic systems', true),

-- Business Courses
('550e8400-e29b-41d4-a716-446655440076', 'Business Fundamentals', 'BUS101', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440062', 1, '1', 3, 'Introduction to business concepts', true),
('550e8400-e29b-41d4-a716-446655440077', 'Financial Management', 'BUS201', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440062', 2, '1', 4, 'Principles of financial management', true),

-- Science Courses
('550e8400-e29b-41d4-a716-446655440078', 'General Chemistry', 'SCI101', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440063', 1, '1', 4, 'Fundamental principles of chemistry', true),
('550e8400-e29b-41d4-a716-446655440079', 'Applied Physics', 'SCI201', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440063', 2, '1', 3, 'Physics applications in technology', true);

-- Insert Sample Students
INSERT INTO students (id, user_id, student_number, program_id, year_level, enrollment_year, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440050', 'NPI2024001', '550e8400-e29b-41d4-a716-446655440060', 2, 2023, true),
('550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440051', 'NPI2024002', '550e8400-e29b-41d4-a716-446655440061', 1, 2024, true),
('550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440052', 'NPI2024003', '550e8400-e29b-41d4-a716-446655440062', 1, 2024, true);

-- Insert Course Instructors
INSERT INTO course_instructors (id, course_id, instructor_id, semester_id, is_primary) VALUES
('550e8400-e29b-41d4-a716-446655440090', '550e8400-e29b-41d4-a716-446655440071', '550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440020', true),
('550e8400-e29b-41d4-a716-446655440091', '550e8400-e29b-41d4-a716-446655440072', '550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440020', true),
('550e8400-e29b-41d4-a716-446655440092', '550e8400-e29b-41d4-a716-446655440073', '550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440020', true),
('550e8400-e29b-41d4-a716-446655440093', '550e8400-e29b-41d4-a716-446655440077', '550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440020', true);

-- Insert Student Enrollments
INSERT INTO student_enrollments (id, student_id, course_id, semester_id, enrollment_date, status) VALUES
-- Alice Student (DCE Year 2)
('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440071', '550e8400-e29b-41d4-a716-446655440020', '2024-02-01', 'enrolled'),
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440072', '550e8400-e29b-41d4-a716-446655440020', '2024-02-01', 'enrolled'),

-- Bob Student (DEE Year 1)
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440070', '550e8400-e29b-41d4-a716-446655440020', '2024-02-01', 'enrolled'),

-- Carol Smith (DBM Year 1)
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440076', '550e8400-e29b-41d4-a716-446655440020', '2024-02-01', 'enrolled');

-- Insert Grade Criteria for each department (now departments exist)
INSERT INTO grade_criteria (id, department_id, grade, min_percentage, max_percentage, grade_points, description) VALUES
-- Engineering Department
('550e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440001', 'HD', 80.00, 100.00, 4.00, 'High Distinction'),
('550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440001', 'D', 70.00, 79.99, 3.00, 'Distinction'),
('550e8400-e29b-41d4-a716-446655440112', '550e8400-e29b-41d4-a716-446655440001', 'C', 60.00, 69.99, 2.00, 'Credit'),
('550e8400-e29b-41d4-a716-446655440113', '550e8400-e29b-41d4-a716-446655440001', 'P', 50.00, 59.99, 1.00, 'Pass'),
('550e8400-e29b-41d4-a716-446655440114', '550e8400-e29b-41d4-a716-446655440001', 'F', 0.00, 49.99, 0.00, 'Fail'),

-- Business Department
('550e8400-e29b-41d4-a716-446655440115', '550e8400-e29b-41d4-a716-446655440002', 'HD', 85.00, 100.00, 4.00, 'High Distinction'),
('550e8400-e29b-41d4-a716-446655440116', '550e8400-e29b-41d4-a716-446655440002', 'D', 75.00, 84.99, 3.00, 'Distinction'),
('550e8400-e29b-41d4-a716-446655440117', '550e8400-e29b-41d4-a716-446655440002', 'C', 65.00, 74.99, 2.00, 'Credit'),
('550e8400-e29b-41d4-a716-446655440118', '550e8400-e29b-41d4-a716-446655440002', 'P', 55.00, 64.99, 1.00, 'Pass'),
('550e8400-e29b-41d4-a716-446655440119', '550e8400-e29b-41d4-a716-446655440002', 'F', 0.00, 54.99, 0.00, 'Fail'),

-- Sciences Department
('550e8400-e29b-41d4-a716-446655440120', '550e8400-e29b-41d4-a716-446655440003', 'HD', 80.00, 100.00, 4.00, 'High Distinction'),
('550e8400-e29b-41d4-a716-446655440121', '550e8400-e29b-41d4-a716-446655440003', 'D', 70.00, 79.99, 3.00, 'Distinction'),
('550e8400-e29b-41d4-a716-446655440122', '550e8400-e29b-41d4-a716-446655440003', 'C', 60.00, 69.99, 2.00, 'Credit'),
('550e8400-e29b-41d4-a716-446655440123', '550e8400-e29b-41d4-a716-446655440003', 'P', 50.00, 59.99, 1.00, 'Pass'),
('550e8400-e29b-41d4-a716-446655440124', '550e8400-e29b-41d4-a716-446655440003', 'F', 0.00, 49.99, 0.00, 'Fail');

-- Insert System Settings
INSERT INTO system_settings (key, value, description) VALUES
('institution_name', 'National Polytechnic Institute of PNG', 'Institution Name'),
('min_passing_grade', '50', 'Minimum percentage for passing'),
('max_gpa', '4.0', 'Maximum GPA scale'),
('academic_year_start_month', '2', 'Academic year start month'),
('semester_duration_weeks', '16', 'Standard semester duration in weeks');
