import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client with service role key for user creation
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    console.log('📝 Creating user with data:', userData)

    // 1. Create auth user first
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password || '123456', // Default password
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: userData.role,
        phone: userData.phone
      }
    })

    if (authError) {
      console.error('❌ Auth user creation error:', authError)
      return NextResponse.json(
        { error: `Failed to create auth user: ${authError.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Auth user created:', authData.user.id)

    // 2. Insert into users table
    const { data: dbUser, error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        branch_id: userData.branch_id || null,
        state_name: userData.state_name || null,
        area_name: userData.area_name || null,
        territory_id: userData.territory_id || null,
        is_active: userData.is_active !== undefined ? userData.is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ Database user creation error:', dbError)
      // Try to clean up auth user if db insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: `Failed to create database user: ${dbError.message}` },
        { status: 400 }
      )
    }

    console.log('✅ Database user created:', dbUser)

    return NextResponse.json({
      success: true,
      message: 'User created successfully!',
      user: dbUser
    })

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
