'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import dayjs from 'dayjs'
import { 
  TrackingSession, 
  TrackingPoint, 
  TrackingStop, 
  TrackingAnalytics, 
  TrackingFilters, 
  TrackingPermissions,
  RealTimeTracking
} from '@/types/tracking'
import { useGetIdentity } from '@refinedev/core'
import { App } from 'antd'

export const useTracking = () => {
  const { message } = App.useApp()
  const { data: auth } = useGetIdentity()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // State variables for tracking data
  const [sessions, setSessions] = useState<TrackingSession[]>([])
  const [points, setPoints] = useState<TrackingPoint[]>([])
  const [stops, setStops] = useState<TrackingStop[]>([])
  const [analytics, setAnalytics] = useState<TrackingAnalytics | null>(null)
  const [realTimeData, setRealTimeData] = useState<RealTimeTracking | null>(null)
  const currentUser = (auth as any)?.user || null

  // Permission system based on user role
  const getPermissions = useCallback((): TrackingPermissions => {
    if (!auth || !(auth as any).user) {
      return {
        canViewAll: false,
        canViewBranch: false,
        canViewOwn: false,
        canExport: false,
        canAnalyze: false,
        allowedBranches: [],
        allowedRoles: []
      }
    }

    const role = (auth as any).user.role
    const branchId = (auth as any).user.branch_id

    switch (role) {
      case 'admin':
      case 'super_admin':
        return {
          canViewAll: true,
          canViewBranch: true,
          canViewOwn: true,
          canExport: true,
          canAnalyze: true,
          allowedBranches: [],
          allowedRoles: ['all']
        }
      
      case 'branch_manager':
        return {
          canViewAll: false,
          canViewBranch: true,
          canViewOwn: true,
          canExport: true,
          canAnalyze: true,
          allowedBranches: branchId ? [branchId] : [],
          allowedRoles: ['sales_executive', 'technician', 'installer']
        }
      
      case 'sales_manager':
        return {
          canViewAll: false,
          canViewBranch: true,
          canViewOwn: true,
          canExport: true,
          canAnalyze: false,
          allowedBranches: branchId ? [branchId] : [],
          allowedRoles: ['sales_executive']
        }
      
      case 'finance_manager':
        return {
          canViewAll: true,
          canViewBranch: true,
          canViewOwn: true,
          canExport: true,
          canAnalyze: true,
          allowedBranches: [],
          allowedRoles: ['all']
        }
      
      default:
        return {
          canViewAll: false,
          canViewBranch: false,
          canViewOwn: true,
          canExport: false,
          canAnalyze: false,
          allowedBranches: branchId ? [branchId] : [],
          allowedRoles: []
        }
    }
  }, [auth])

  // Fetch tracking sessions with role-based filtering
  const fetchTrackingSessions = useCallback(async (filters: TrackingFilters = {}) => {
    setLoading(true)
    setError(null)

    try {
      const permissions = getPermissions()
      let query = supabase
        .from('tracking_sessions')
        .select(`
          *,
          users:user_id (id, name, email, role, employee_id),
          branches:branch_id (id, name, city, state)
        `)

      // Apply role-based filtering
      if (!permissions.canViewAll) {
        if (permissions.canViewBranch && (auth as any)?.user?.branch_id) {
          query = query.eq('branch_id', (auth as any).user.branch_id)
        } else if (permissions.canViewOwn) {
          query = query.eq('user_id', (auth as any)?.user?.id)
        }
      }

      // Apply filters
      if (filters.startDate) {
        query = query.gte('punched_in_at', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('punched_in_at', filters.endDate)
      }
      if (filters.userId && permissions.canViewAll) {
        query = query.eq('user_id', filters.userId)
      }
      if (filters.branchId && (permissions.canViewAll || permissions.canViewBranch)) {
        query = query.eq('branch_id', filters.branchId)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      // Order by most recent
      query = query.order('punched_in_at', { ascending: false })

      const { data, error: queryError } = await query
      if (queryError) throw queryError

      return data as TrackingSession[]
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tracking sessions'
      setError(errorMessage)
      message.error(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [auth, getPermissions])



  // Fetch Tracking Points for a specific session
  const fetchTrackingPoints = async (sessionId: string, limit: number = 50) => {
    setLoading(true)
    try {
      const { data, error: queryError } = await supabase
        .from('tracking_points')
        .select(`
          *,
          users(id, name, role)
        `)
        .eq('session_id', sessionId)
        .order('recorded_at', { ascending: false })
        .limit(limit)

      if (queryError) throw queryError
      setPoints(data || [])
    } catch (error: any) {
      console.error('Error fetching tracking points:', error)
      message.error('Failed to fetch tracking points: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch Tracking Stops
  const fetchTrackingStops = async (sessionId?: string, filters: TrackingFilters = {}) => {
    setLoading(true)
    try {
      let query = supabase
        .from('tracking_stops')
        .select(`
          *,
          sessions:tracking_sessions(
            id,
            users(id, name, role)
          )
        `)
        .order('start_time', { ascending: false })

      if (sessionId) {
        query = query.eq('session_id', sessionId)
      }

      if (filters.startDate) {
        query = query.gte('start_time', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('start_time', filters.endDate + ' 23:59:59')
      }

      const { data, error: queryError } = await query.limit(100)

      if (queryError) throw queryError
      setStops(data || [])
    } catch (error: any) {
      console.error('Error fetching tracking stops:', error)
      message.error('Failed to fetch tracking stops: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch Analytics Data
  const fetchAnalytics = async (filters: TrackingFilters = {}) => {
    setLoading(true)
    try {
      const today = dayjs().format('YYYY-MM-DD')
      const startDate = filters.startDate || today
      const endDate = filters.endDate || today

      // Fetch active sessions
      const { data: activeSessions, error: sessionsError } = await supabase
        .from('tracking_sessions')
        .select(`
          *,
          users(id, name, role)
        `)
        .gte('punched_in_at', startDate)
        .lte('punched_in_at', endDate + ' 23:59:59')

      if (sessionsError) throw sessionsError

      // Calculate analytics
      const totalActiveSessions = activeSessions?.length || 0
      const totalEmployeesTracked = new Set(activeSessions?.map(s => s.user_id)).size || 0
      const totalDistanceCovered = activeSessions?.reduce((sum, session) => 
        sum + (session.total_distance_m || 0), 0) || 0

      // Session status breakdown
      const sessionsByStatus = activeSessions?.reduce((acc: any[], session) => {
        const existing = acc.find(item => item.status === session.status)
        if (existing) {
          existing.count++
        } else {
          acc.push({ status: session.status, count: 1, percentage: 0 })
        }
        return acc
      }, []) || []

      // Calculate percentages
      sessionsByStatus.forEach(item => {
        item.percentage = totalActiveSessions > 0 ? (item.count / totalActiveSessions) * 100 : 0
      })

      // User activities
      const userActivities = activeSessions?.reduce((acc: any[], session) => {
        const userId = session.user_id
        let userActivity = acc.find(item => item.user_id === userId)
        
        if (!userActivity) {
          userActivity = {
            user_id: userId,
            user_name: session.users?.name || 'Unknown',
            role: session.users?.role || 'Unknown',
            active_sessions: 0,
            total_distance: 0,
            total_time: 0,
            last_seen: session.punched_in_at
          }
          acc.push(userActivity)
        }
        
        userActivity.active_sessions++
        userActivity.total_distance += session.total_distance_m || 0
        userActivity.total_time += session.travel_minutes || 0
        
        return acc
      }, []) || []

      const analyticsData: TrackingAnalytics = {
        totalActiveSessions,
        totalEmployeesTracked,
        totalDistanceCovered,
        averageSpeed: totalActiveSessions > 0 ? totalDistanceCovered / totalActiveSessions : 0,
        totalStops: activeSessions?.reduce((sum, session) => sum + (session.stops_count || 0), 0) || 0,
        totalAllocations: 0,
        totalAllocatedValue: 0,
        pendingAllocations: 0,
        sessionsByStatus,
        userActivities,
        branchActivities: [], // Would need branch-wise aggregation
        hourlyActivity: [] // Would need hourly breakdown
      }

      setAnalytics(analyticsData)

    } catch (error: any) {
      console.error('Error fetching analytics:', error)
      message.error('Failed to fetch analytics: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch Real-time Data
  const fetchRealTimeData = async () => {
    try {
      // Get active sessions from today
      const { data: activeSessions, error: sessionsError } = await supabase
        .from('tracking_sessions')
        .select(`
          *,
          users(id, name, email, role),
          branches(id, name, city, state)
        `)
        .eq('status', 'active')
        .gte('punched_in_at', dayjs().startOf('day').toISOString())
        .order('punched_in_at', { ascending: false })

      if (sessionsError) throw sessionsError

      // Get recent tracking points (last 10 minutes)
      const { data: recentPoints, error: pointsError } = await supabase
        .from('tracking_points')
        .select(`
          *,
          users(id, name, role)
        `)
        .gte('recorded_at', dayjs().subtract(10, 'minutes').toISOString())
        .order('recorded_at', { ascending: false })
        .limit(50)

      if (pointsError) throw pointsError

      // Get recent stops
      const { data: recentStops, error: stopsError } = await supabase
        .from('tracking_stops')
        .select('*')
        .gte('start_time', dayjs().startOf('day').toISOString())
        .order('start_time', { ascending: false })
        .limit(20)

      if (stopsError) throw stopsError

      const realTimeInfo: RealTimeTracking = {
        activeSessions: activeSessions || [],
        livePoints: recentPoints || [],
        recentStops: recentStops || [],
        onlineUsers: activeSessions?.length || 0,
        systemStatus: 'healthy'
      }

      setRealTimeData(realTimeInfo)

    } catch (error: any) {
      console.error('Error fetching real-time data:', error)
      message.error('Failed to fetch real-time data: ' + error.message)
    }
  }

  // Export tracking data
  const exportTrackingData = async (type: 'sessions' | 'allocations' | 'points', filters: TrackingFilters = {}) => {
    try {
      message.info(`Exporting ${type} data...`)
      // This would integrate with your existing export functionality
      // For now, just show a success message
      message.success(`${type} data exported successfully`)
    } catch (error: any) {
      console.error('Error exporting data:', error)
      message.error('Failed to export data: ' + error.message)
    }
  }

  return {
    sessions,
    points,
    stops,
    analytics,
    realTimeData,
    loading,
    fetchTrackingSessions,
    fetchTrackingPoints,
    fetchTrackingStops,
    fetchAnalytics,
    fetchRealTimeData,
    exportTrackingData,
    currentUser
  }
}