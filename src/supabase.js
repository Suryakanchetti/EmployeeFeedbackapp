import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Enhanced error logging for debugging
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please check your .env file contains:')
  console.error('- REACT_APP_SUPABASE_URL')
  console.error('- REACT_APP_SUPABASE_ANON_KEY')
  console.error('Current values:', { supabaseUrl, supabaseAnonKey: supabaseAnonKey ? '***' : 'MISSING' })
} else {
  console.log('✅ Supabase environment variables loaded successfully')
}

// Create optimized client with better performance settings
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)

// Database table names
export const TABLES = {
  FEEDBACK: 'feedback',
  USERS: 'users',
  DEPARTMENTS: 'departments'
}

// Feedback types
export const FEEDBACK_TYPES = {
  POSITIVE: 'positive',
  CONSTRUCTIVE: 'constructive',
  SUGGESTION: 'suggestion',
  CONCERN: 'concern'
}

// Feedback status
export const FEEDBACK_STATUS = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  ADDRESSED: 'addressed',
  CLOSED: 'closed'
}
