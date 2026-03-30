'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { 
  TrackingSession, 
  TrackingPoint, 
  TrackingStop, 
  TrackingAnalytics, 
  TrackingFilters, 
  TrackingPermissions,
  RealTimeTracking
} from '@/types/tracking'
import { App } from 'antd'

export const useTracking = () => {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [permissions, setPermissions] = useState<TrackingPermissions | null>(null)

  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      initializePermissions()
    }
  }, [currentUser])

  const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setCurrentUser(user)
  }

  const initializePermissions = () => {
    if (!currentUser) return

    const role = currentUser.role?.toLowerCase()
    
    let perms: TrackingPermissions = {
      canViewAll: false,
      canViewBranch: false,
      canViewOwn: true,
      canExport: false,
      canAnalyze: false,
      allowedBranches: [],
      allowedRoles: []
    }

    switch (role) {
      case 'director':
      case 'ops_head':
      case 'hr_head':
        perms = {
          canViewAll: true,
          canViewBranch: true,
          canViewOwn: true,
          canExport: true,
          canAnalyze: true,
          allowedBranches: [],
          allowedRoles: ['all']
        }
        break
      
      case 'branch_manager':
      case 'regional_manager':
      case 'assistant_branch_manager':
        perms = {
          canViewAll: false,
          canViewBranch: true,
          canViewOwn: true,
          canExport: true,
          canAnalyze: true,
          allowedBranches: currentUser.branch_id ? [currentUser.branch_id] : [],
          allowedRoles: ['sales_staff', 'installation_team']
        }
        break
      
      case 'sales_head':
      case 'state_manager':
      case 'area_manager':
        perms = {
          canViewAll: true,
          canViewBranch: true,
          canViewOwn: true,
          canExport: true,
          canAnalyze: true,
          allowedBranches: [],
          allowedRoles: ['all']
        }
        break
      
      default:
        // For sales_staff, installation_team, and other roles
        // Branch roles can only see their branch data
        // Other roles can see all data
        const isBranchRole = ['sales_staff', 'installation_team', 'admin_staff', 'subsidy_staff'].includes(role)
        
        perms = {
          canViewAll: !isBranchRole,
          canViewBranch: true,
          canViewOwn: true,
          canExport: true,
          canAnalyze: true,
          allowedBranches: isBranchRole && currentUser.branch_id ? [currentUser.branch_id] : [],
          allowedRoles: isBranchRole ? [] : ['all']
        }
    }

    setPermissions(perms)
  }

  // Permission system based on user role
  const getPermissions = useCallback((): TrackingPermissions => {
    return permissions || {
      canViewAll: false,
      canViewBranch: false,
      canViewOwn: false,
      canExport: false,
      canAnalyze: false,
      allowedBranches: [],
      allowedRoles: []
    }
  }, [permissions])

  // Fetch tracking sessions with role-based filtering
  const fetchTrackingSessions = useCallback(async (filters?: TrackingFilters) => {
    const filterOptions = filters || {}
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('tracking_sessions')
        .select(`
          *,
          users:user_id (id, name, email, role, employee_id),
          branches:branch_id (id, name, city, state)
        `)

      // Apply role-based filtering
      if (!permissions?.canViewAll) {
        if (permissions?.canViewBranch && currentUser?.branch_id) {
          query = query.eq('branch_id', currentUser.branch_id)
        } else if (permissions?.canViewOwn) {
          query = query.eq('user_id', currentUser?.id)
        }
      }

      // Apply filters
      if (filterOptions.startDate) {
        query = query.gte('punched_in_at', filterOptions.startDate)
      }
      if (filterOptions.endDate) {
        query = query.lte('punched_in_at', filterOptions.endDate)
      }
      if (filterOptions.userId && permissions?.canViewAll) {
        query = query.eq('user_id', filterOptions.userId)
      }
      if (filterOptions.branchId && (permissions?.canViewAll || permissions?.canViewBranch)) {
        query = query.eq('branch_id', filterOptions.branchId)
      }
      if (filterOptions.status) {
        query = query.eq('status', filterOptions.status)
      }

      // Order by most recent
      query = query.order('punched_in_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error

      return data as TrackingSession[]
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tracking sessions'
      setError(errorMessage)
      message?.error(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [currentUser, permissions, message])

  // Fetch tracking points for a session
  const fetchTrackingPoints = useCallback(async (sessionId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('tracking_points')
        .select('*')
        .eq('session_id', sessionId)
        .order('recorded_at', { ascending: true })

      if (error) throw error
      return data as TrackingPoint[]
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tracking points'
      setError(errorMessage)
      message?.error(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [message])

  // Real-time tracking data
  const fetchRealTimeTracking = useCallback(async (): Promise<RealTimeTracking> => {
    setLoading(true)
    setError(null)

    try {
      // Get active sessions
      let sessionQuery = supabase
        .from('tracking_sessions')
        .select(`
          *,
          users:user_id (id, name, email, role),
          branches:branch_id (id, name, city, state)
        `)
        .eq('status', 'active')

      if (!permissions?.canViewAll) {
        if (permissions?.canViewBranch && currentUser?.branch_id) {
          sessionQuery = sessionQuery.eq('branch_id', currentUser.branch_id)
        } else if (permissions?.canViewOwn) {
          sessionQuery = sessionQuery.eq('user_id', currentUser?.id)
        }
      }

      const { data: sessions, error: sessionError } = await sessionQuery
      if (sessionError) throw sessionError

      // Get recent points (last 30 minutes)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
      const { data: points, error: pointsError } = await supabase
        .from('tracking_points')
        .select('*')
        .gte('recorded_at', thirtyMinutesAgo)
        .order('recorded_at', { ascending: false })
        .limit(100)

      if (pointsError) throw pointsError

      // Get recent stops
      const { data: stops, error: stopsError } = await supabase
        .from('tracking_stops')
        .select('*')
        .gte('start_time', thirtyMinutesAgo)
        .order('start_time', { ascending: false })
        .limit(50)

      if (stopsError) throw stopsError

      return {
        activeSessions: sessions as TrackingSession[] || [],
        livePoints: points as TrackingPoint[] || [],
        recentStops: stops as TrackingStop[] || [],
        onlineUsers: sessions?.length || 0,
        systemStatus: 'healthy'
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch real-time tracking'
      setError(errorMessage)
      message?.error(errorMessage)
      return {
        activeSessions: [],
        livePoints: [],
        recentStops: [],
        onlineUsers: 0,
        systemStatus: 'error'
      }
    } finally {
      setLoading(false)
    }
  }, [currentUser, permissions, message])

  // Analytics
  const fetchTrackingAnalytics = useCallback(async (filters?: TrackingFilters): Promise<TrackingAnalytics> => {
    const filterOptions = filters || {}
    setLoading(true)
    setError(null)

    try {
      if (!permissions?.canAnalyze) {
        throw new Error('Insufficient permissions for analytics')
      }

      // Basic stats query
      let baseQuery = supabase.from('tracking_sessions').select('*')
      
      if (!permissions?.canViewAll) {
        if (permissions?.canViewBranch && currentUser?.branch_id) {
          baseQuery = baseQuery.eq('branch_id', currentUser.branch_id)
        }
      }

      if (filterOptions.startDate) {
        baseQuery = baseQuery.gte('punched_in_at', filterOptions.startDate)
      }
      if (filterOptions.endDate) {
        baseQuery = baseQuery.lte('punched_in_at', filterOptions.endDate)
      }

      const { data: sessions, error } = await baseQuery
      if (error) throw error

      // Calculate analytics
      const totalActiveSessions = sessions?.filter(s => s.status === 'active').length || 0
      const totalEmployeesTracked = new Set(sessions?.map(s => s.user_id)).size
      const totalDistanceCovered = sessions?.reduce((sum, s) => sum + (s.total_distance_m || 0), 0) || 0
      const avgTravelTime = sessions?.reduce((sum, s) => sum + (s.travel_minutes || 0), 0) / (sessions?.length || 1) || 0
      const totalStops = sessions?.reduce((sum, s) => sum + (s.stops_count || 0), 0) || 0

      // User performance (simplified)
      const userActivities = Array.from(new Set(sessions?.map(s => s.user_id))).map(userId => ({
        user_id: userId || '',
        user_name: 'User',
        role: 'employee',
        active_sessions: sessions?.filter(s => s.user_id === userId).length || 0,
        total_distance: sessions?.filter(s => s.user_id === userId).reduce((sum, s) => sum + (s.total_distance_m || 0), 0) || 0,
        total_time: sessions?.filter(s => s.user_id === userId).reduce((sum, s) => sum + (s.travel_minutes || 0), 0) || 0,
        last_seen: new Date().toISOString()
      }))

      return {
        totalActiveSessions,
        totalEmployeesTracked,
        totalDistanceCovered,
        averageSpeed: avgTravelTime,
        totalStops,
        totalAllocations: 0,
        totalAllocatedValue: 0,
        pendingAllocations: 0,
        sessionsByStatus: [],
        userActivities,
        branchActivities: [],
        hourlyActivity: []
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics'
      setError(errorMessage)
      message?.error(errorMessage)
      return {
        totalActiveSessions: 0,
        totalEmployeesTracked: 0,
        totalDistanceCovered: 0,
        averageSpeed: 0,
        totalStops: 0,
        totalAllocations: 0,
        totalAllocatedValue: 0,
        pendingAllocations: 0,
        sessionsByStatus: [],
        userActivities: [],
        branchActivities: [],
        hourlyActivity: []
      }
    } finally {
      setLoading(false)
    }
  }, [currentUser, permissions, message])

  return {
    loading,
    error,
    permissions: permissions || {
      canViewAll: false,
      canViewBranch: false,
      canViewOwn: false,
      canExport: false,
      canAnalyze: false,
      allowedBranches: [],
      allowedRoles: []
    },
    fetchTrackingSessions,
    fetchTrackingPoints,
    fetchRealTimeTracking,
    fetchTrackingAnalytics
  }
}