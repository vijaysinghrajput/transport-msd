import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing')
  throw new Error('Missing Supabase environment variables')
}

// Debug logging for development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Supabase Client Configuration:')
  console.log('URL:', supabaseUrl)
  console.log('Anon Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Handle auth state changes, especially refresh token errors
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('✅ Token refreshed successfully')
    } else if (event === 'SIGNED_OUT') {
      console.log('👋 User signed out')
      localStorage.removeItem('user')
    } else if (!session && event !== 'INITIAL_SESSION') {
      // Clear user data if session is invalid (e.g., refresh token expired)
      console.log('⚠️ Session invalid, clearing user data')
      localStorage.removeItem('user')
    }
  })
}

// Helper function to get authenticated user
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Helper function to handle auth errors and redirect to login if needed
export const handleAuthError = async (error: any): Promise<boolean> => {
  // Check if it's an auth-related error
  const isAuthError = 
    error?.message?.includes('refresh_token') ||
    error?.message?.includes('Invalid Refresh Token') ||
    error?.message?.includes('JWT') ||
    error?.message?.includes('token') ||
    error?.message?.includes('session') ||
    error?.code === 'PGRST301' || // PostgREST auth error
    error?.status === 401

  if (isAuthError && typeof window !== 'undefined') {
    console.error('❌ Auth error detected:', error)
    localStorage.removeItem('user')
    await supabase.auth.signOut({ scope: 'local' })
    window.location.href = '/login'
    return true // Indicates error was handled
  }
  
  return false // Error was not an auth error
}