import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client with service role key for user deletion
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('🗑️ Deleting user:', userId)

    // Get user info before deletion
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('name, email, role')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      console.error('❌ User not found:', fetchError)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Step 1: Update all foreign key references to NULL before deletion
    console.log('🔄 Updating foreign key references...')

    // Update leads - set source_user_id and assigned_to to NULL
    await supabaseAdmin
      .from('leads')
      .update({ source_user_id: null })
      .eq('source_user_id', userId)

    await supabaseAdmin
      .from('leads')
      .update({ assigned_to: null })
      .eq('assigned_to', userId)

    // Update branches - set manager_id to NULL
    await supabaseAdmin
      .from('branches')
      .update({ manager_id: null })
      .eq('manager_id', userId)

    // Update employees - set reporting_manager_id to NULL
    await supabaseAdmin
      .from('employees')
      .update({ reporting_manager_id: null })
      .eq('reporting_manager_id', userId)

    // Update any other tables that might reference this user
    // Add more updates here if there are other foreign keys

    console.log('✅ Foreign key references updated')

    // Step 2: Delete from users table
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (dbError) {
      console.error('❌ Database deletion error:', dbError)
      return NextResponse.json(
        { error: `Failed to delete user from database: ${dbError.message}` },
        { status: 400 }
      )
    }

    console.log('✅ User deleted from database')

    // Delete from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('⚠️ Auth deletion error (user may not exist in auth):', authError)
      // Don't fail if auth deletion fails - user is already deleted from DB
    } else {
      console.log('✅ User deleted from auth')
    }

    return NextResponse.json({
      success: true,
      message: `User deleted successfully`,
      user: user
    })

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
