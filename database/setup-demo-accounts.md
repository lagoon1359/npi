# Demo Accounts Setup Guide

## Quick Setup (Recommended)

The application now automatically creates user profiles when someone logs in for the first time. However, you still need to create the authentication accounts in Supabase.

### Step 1: Create Demo Users in Supabase Auth

Go to your Supabase Dashboard → Authentication → Users, and create the following users:

1. **Admin Account**
   - Email: `admin@npi.pg`
   - Password: `admin123`
   - Confirm email: Yes

2. **Instructor Account**
   - Email: `instructor@npi.pg`
   - Password: `instructor123`
   - Confirm email: Yes

3. **Student Account**
   - Email: `student@npi.pg`
   - Password: `student123`
   - Confirm email: Yes

### Step 2: Test Login

After creating these accounts, you can use the demo login buttons on the login page. The application will automatically:
- Create user profiles in the `users` table
- Assign appropriate roles based on email addresses
- Set up basic user information

## Alternative: Manual SQL Setup

If you prefer to run SQL directly, you can use the following in your Supabase SQL Editor:

```sql
-- Enable Row Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can read their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Create policy to allow authenticated users to insert their profile
CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);
```

## Troubleshooting

### If you get 406 errors:
1. Make sure the users table exists in your database
2. Check that RLS policies are set up correctly
3. Verify the Supabase environment variables in your `.env.production`

### If login redirects back to login page:
1. Check browser console for error messages
2. Verify the Supabase URL and anon key are correct
3. Make sure the users were created with confirmed email addresses

## Demo Account Credentials

- **Admin**: admin@npi.pg / admin123 (Full system access)
- **Instructor**: instructor@npi.pg / instructor123 (Teaching and grading access)
- **Student**: student@npi.pg / student123 (Student portal access)

The application will automatically assign roles and create profiles when these users first log in.
