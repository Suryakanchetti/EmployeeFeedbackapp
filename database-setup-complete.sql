-- Complete Database Setup for Employee Feedback App
-- Run this in your Supabase SQL Editor

-- 1. Create the users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE NOT NULL,
    department TEXT DEFAULT 'General',
    position TEXT DEFAULT 'Employee',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('positive', 'constructive', 'suggestion', 'concern')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'addressed', 'closed')),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create the departments table (optional)
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert some default departments
INSERT INTO public.departments (name, description) VALUES
    ('Engineering', 'Software development and technical operations'),
    ('Marketing', 'Marketing and communications'),
    ('Sales', 'Sales and business development'),
    ('HR', 'Human resources and people operations'),
    ('Finance', 'Financial operations and accounting'),
    ('General', 'General department')
ON CONFLICT (name) DO NOTHING;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for users table
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 7. Create RLS policies for feedback table
-- Users can view all feedback
CREATE POLICY "Users can view all feedback" ON public.feedback
    FOR SELECT USING (true);

-- Users can insert their own feedback
CREATE POLICY "Users can insert own feedback" ON public.feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own feedback
CREATE POLICY "Users can update own feedback" ON public.feedback
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own feedback
CREATE POLICY "Users can delete own feedback" ON public.feedback
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Create RLS policies for departments table
-- Everyone can view departments
CREATE POLICY "Everyone can view departments" ON public.departments
    FOR SELECT USING (true);

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON public.feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 10. Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name, department, position)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
        COALESCE(NEW.raw_user_meta_data->>'position', 'Employee')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.feedback TO anon, authenticated;
GRANT ALL ON public.departments TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 13. Test data (optional - remove in production)
-- Insert a test user if you want to test without registration
-- INSERT INTO public.users (id, email, first_name, last_name, department, position) VALUES
--     ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test', 'User', 'General', 'Employee');

-- 14. Verify setup
SELECT 'Setup complete! Check the following:' as message;
SELECT 'Users table:' as table_name, COUNT(*) as row_count FROM public.users;
SELECT 'Feedback table:' as table_name, COUNT(*) as row_count FROM public.feedback;
SELECT 'Departments table:' as table_name, COUNT(*) as row_count FROM public.departments;
