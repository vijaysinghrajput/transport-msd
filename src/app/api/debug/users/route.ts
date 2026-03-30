import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/debug/users - Debug users visibility issues
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const debugLevel = searchParams.get('level') || 'basic'
    
    console.log('🚀 Starting users debug check...')
    
    // Check database connection
    const { data: testConnection, error: connectionError } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1)
    
    if (connectionError) {
      console.error('❌ Database connection error:', connectionError)
      return NextResponse.json({
        error: 'Database connection failed',
        details: String(connectionError.message || connectionError),
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
    // Get total user count
    const { count: totalUsers, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    // Get sample of all users with basic info
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        role,
        is_active,
        created_at,
        branch_id,
        territory_id,
        state_name,
        region_name,
        area_name
      `)
      .order('created_at', { ascending: false })
      .limit(50)
    
    // Get users by role distribution
    const { data: roleDistribution, error: roleError } = await supabase
      .from('users')
      .select('role')
    
    const roleCounts = roleDistribution?.reduce((acc: any, user: any) => {
      const role = user.role || 'unknown'
      acc[role] = (acc[role] || 0) + 1
      return acc
    }, {})
    
    // Get active/inactive distribution
    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
    
    const { count: inactiveUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', false)
    
    // Check for users with missing critical data
    const { data: usersWithIssues, error: issuesError } = await supabase
      .from('users')
      .select('id, name, email, role, branch_id, territory_id')
      .or('name.is.null,email.is.null,role.is.null')
    
    // Get branches count
    const { count: branchesCount } = await supabase
      .from('branches')
      .select('*', { count: 'exact', head: true })
    
    // Get territories count
    const { count: territoriesCount } = await supabase
      .from('territories')
      .select('*', { count: 'exact', head: true })
    
    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        connection: connectionError ? 'FAILED' : 'SUCCESS',
        total_users: totalUsers || 0,
        active_users: activeUsers || 0,
        inactive_users: inactiveUsers || 0,
        branches_count: branchesCount || 0,
        territories_count: territoriesCount || 0
      },
      role_distribution: roleCounts || {},
      users_with_issues: usersWithIssues || [],
      sample_users: allUsers?.slice(0, 10).map(user => ({
        id: user.id,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        has_branch: !!user.branch_id,
        has_territory: !!user.territory_id,
        created_at: user.created_at
      })) || []
    }
    
    // Add error information separately to avoid type issues
    if (connectionError || countError || usersError || roleError || issuesError) {
      debugInfo.errors = {
        connection: connectionError ? JSON.stringify(connectionError) : null,
        count: countError ? JSON.stringify(countError) : null,
        users: usersError ? JSON.stringify(usersError) : null,
        roles: roleError ? JSON.stringify(roleError) : null,
        issues: issuesError ? JSON.stringify(issuesError) : null
      }
    }
    
    // Extended debug info if requested
    if (debugLevel === 'detailed') {
      const { data: recentUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      
      debugInfo.recent_users = recentUsers
    }
    
    console.log('✅ Debug info collected:', debugInfo)
    
    return NextResponse.json(debugInfo)
    
  } catch (error) {
    console.error('💥 Debug API error:', error)
    return NextResponse.json({
      error: 'Debug check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}