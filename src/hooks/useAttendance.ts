import { useState, useEffect } from 'react'
import { App } from 'antd'
import dayjs from 'dayjs'
import { supabase } from '@/lib/supabaseClient'
import { 
  AttendanceLog, 
  AttendanceDailySummary, 
  AttendanceAnalytics, 
  AttendanceFilters,
  AttendancePermissions 
} from '@/types/attendance'

export const useAttendance = () => {
  const { message } = App.useApp()
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([])
  const [dailySummary, setDailySummary] = useState<AttendanceDailySummary[]>([])
  const [analytics, setAnalytics] = useState<AttendanceAnalytics | null>(null)
  const [permissions, setPermissions] = useState<AttendancePermissions | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

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
    
    let perms: AttendancePermissions = {
      canViewAll: false,
      canViewBranch: false,
      canViewOwn: true,
      canExport: false,
      canAnalyze: false,
      allowedBranches: [],
      allowedRoles: []
    }

    // Admin and Director - Full access
    if (['admin', 'director'].includes(role)) {
      perms = {
        canViewAll: true,
        canViewBranch: true,
        canViewOwn: true,
        canExport: true,
        canAnalyze: true,
        allowedBranches: [],
        allowedRoles: []
      }
    }
    
    // Management roles - Can view their level and below
    else if (['hr_head', 'ops_head'].includes(role)) {
      perms = {
        canViewAll: true,
        canViewBranch: true,
        canViewOwn: true,
        canExport: true,
        canAnalyze: true,
        allowedBranches: [],
        allowedRoles: []
      }
    }
    
    // For testing - make admin_staff more permissive
    else if (['admin_staff'].includes(role)) {
      perms = {
        canViewAll: false,
        canViewBranch: true,
        canViewOwn: true,
        canExport: true,
        canAnalyze: true,
        allowedBranches: currentUser.branch_id ? [currentUser.branch_id] : [],
        allowedRoles: []
      }
    }
    
    // Regional/State managers - Can view their region
    else if (['regional_manager', 'state_manager'].includes(role)) {
      perms = {
        canViewAll: false,
        canViewBranch: true,
        canViewOwn: true,
        canExport: true,
        canAnalyze: true,
        allowedBranches: [], // Would need to fetch based on territory
        allowedRoles: ['branch_manager', 'assistant_branch_manager', 'staff', 'agent', 'salesperson', 'sales_staff']
      }
    }
    
    // Branch Manager - Can view their branch
    else if (['branch_manager', 'assistant_branch_manager'].includes(role)) {
      perms = {
        canViewAll: false,
        canViewBranch: true,
        canViewOwn: true,
        canExport: true,
        canAnalyze: false,
        allowedBranches: currentUser.branch_id ? [currentUser.branch_id] : [],
        allowedRoles: ['staff', 'agent', 'salesperson', 'sales_staff']
      }
    }
    
    // Sales Manager/Head - Can view sales team
    else if (['sales_manager', 'sales_head'].includes(role)) {
      perms = {
        canViewAll: false,
        canViewBranch: true,
        canViewOwn: true,
        canExport: false,
        canAnalyze: false,
        allowedBranches: currentUser.branch_id ? [currentUser.branch_id] : [],
        allowedRoles: ['salesperson', 'agent', 'sales_staff']
      }
    }

    console.log('Initialized permissions for role:', role, perms)
    setPermissions(perms)
  }

  const fetchAttendanceLogs = async (filters: AttendanceFilters = {}) => {
    setLoading(true)
    try {
      if (!permissions) {
        console.log('No permissions available')
        return
      }

      let query = supabase
        .from('attendance_logs')
        .select(`
          *,
          users(id, name, email, role, employee_id),
          branches(id, name, city, state)
        `)
        .order('logged_at', { ascending: false })

      // Apply role-based filtering - be more permissive for testing
      if (!permissions.canViewAll) {
        if (permissions.canViewBranch && currentUser?.branch_id) {
          query = query.eq('branch_id', currentUser.branch_id)
        } else if (permissions.canViewOwn && !permissions.canViewBranch) {
          query = query.eq('user_id', currentUser.id)
        }
        // If user has branch permissions but no branch_id, show all for now
      }

      // Apply date filters
      if (filters.startDate) {
        query = query.gte('log_date', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('log_date', filters.endDate)
      }

      // Apply other filters
      if (filters.branchId) {
        query = query.eq('branch_id', filters.branchId)
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId)
      }

      console.log('Fetching attendance logs with filters:', filters)
      const { data, error } = await query.limit(500)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Fetched attendance logs:', data?.length || 0, 'records')
      setAttendanceLogs(data || [])
    } catch (error: any) {
      console.error('Error fetching attendance logs:', error)
      message.error('Failed to fetch attendance logs: ' + error.message)
      setAttendanceLogs([])
    } finally {
      setLoading(false)
    }
  }

  const fetchDailySummary = async (filters: AttendanceFilters = {}) => {
    setLoading(true)
    try {
      if (!permissions) {
        console.log('No permissions available for daily summary')
        return
      }

      const today = dayjs().format('YYYY-MM-DD')
      const startDate = filters.startDate || today
      const endDate = filters.endDate || today

      let query = supabase
        .from('attendance_daily_summary')
        .select(`
          *,
          users(id, name, email, role, employee_id),
          branches(id, name, city, state)
        `)
        .gte('attendance_date', startDate)
        .lte('attendance_date', endDate)
        .order('attendance_date', { ascending: false })

      // Apply role-based filtering - be more permissive for testing
      if (!permissions.canViewAll) {
        if (permissions.canViewBranch && currentUser?.branch_id) {
          query = query.eq('branch_id', currentUser.branch_id)
        } else if (permissions.canViewOwn && !permissions.canViewBranch) {
          query = query.eq('user_id', currentUser.id)
        }
        // If user has branch permissions but no branch_id, show all for now
      }

      // Apply other filters
      if (filters.branchId) {
        query = query.eq('branch_id', filters.branchId)
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId)
      }
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status)
      }

      console.log('Fetching daily summary with filters:', { startDate, endDate, ...filters })
      const { data, error } = await query

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Fetched daily summary:', data?.length || 0, 'records')
      setDailySummary(data || [])
    } catch (error: any) {
      console.error('Error fetching daily summary:', error)
      message.error('Failed to fetch attendance summary: ' + error.message)
      setDailySummary([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async (filters: AttendanceFilters = {}) => {
    if (!permissions?.canAnalyze) return

    setLoading(true)
    try {
      const today = dayjs().format('YYYY-MM-DD')
      
      // Fetch today's attendance summary with role-based filtering
      let summaryQuery = supabase
        .from('attendance_daily_summary')
        .select(`
          *,
          users(id, name, email, role, employee_id),
          branches(id, name, city, state)
        `)
        .eq('attendance_date', today)

      // Apply role-based filtering for analytics
      if (!permissions.canViewAll && permissions.allowedBranches.length > 0) {
        summaryQuery = summaryQuery.in('branch_id', permissions.allowedBranches)
      }

      const { data: todayData, error: summaryError } = await summaryQuery

      if (summaryError) throw summaryError

      // Calculate analytics
      const totalEmployees = todayData?.length || 0
      const presentToday = todayData?.filter(record => record.status === 'present').length || 0
      const absentToday = todayData?.filter(record => record.status === 'absent').length || 0
      const lateToday = todayData?.filter(record => record.minutes_late && record.minutes_late > 0).length || 0
      
      const avgWorkingHours = totalEmployees > 0 
        ? (todayData?.reduce((sum, record) => sum + (record.worked_minutes || 0), 0) || 0) / totalEmployees / 60
        : 0
      
      const attendancePercentage = totalEmployees > 0 
        ? (presentToday / totalEmployees) * 100 
        : 0

      // Branch-wise statistics
      const branchWiseStats = todayData?.reduce((acc: any[], record) => {
        const branchId = record.branch_id
        const branchName = record.branches?.name || 'Unknown'
        
        let branchStat = acc.find(b => b.branch_id === branchId)
        if (!branchStat) {
          branchStat = {
            branch_id: branchId,
            branch_name: branchName,
            total_employees: 0,
            present: 0,
            absent: 0,
            late: 0,
            percentage: 0
          }
          acc.push(branchStat)
        }
        
        branchStat.total_employees++
        if (record.status === 'present') branchStat.present++
        if (record.status === 'absent') branchStat.absent++
        if (record.minutes_late && record.minutes_late > 0) branchStat.late++
        
        return acc
      }, []) || []

      // Calculate percentages for branch stats
      branchWiseStats.forEach(branch => {
        branch.percentage = branch.total_employees > 0 
          ? (branch.present / branch.total_employees) * 100 
          : 0
      })

      // Role-wise statistics
      const roleWiseStats = todayData?.reduce((acc: any[], record) => {
        const role = record.users?.role || 'unknown'
        
        let roleStat = acc.find(r => r.role === role)
        if (!roleStat) {
          roleStat = {
            role: role,
            total_employees: 0,
            present: 0,
            absent: 0,
            percentage: 0
          }
          acc.push(roleStat)
        }
        
        roleStat.total_employees++
        if (record.status === 'present') roleStat.present++
        if (record.status === 'absent') roleStat.absent++
        
        return acc
      }, []) || []

      // Calculate percentages for role stats
      roleWiseStats.forEach(role => {
        role.percentage = role.total_employees > 0 
          ? (role.present / role.total_employees) * 100 
          : 0
      })

      const analyticsData: AttendanceAnalytics = {
        totalEmployees,
        presentToday,
        absentToday,
        lateToday,
        avgWorkingHours,
        attendancePercentage,
        branchWiseStats,
        roleWiseStats,
        monthlyTrends: [] // Would need separate query for monthly trends
      }

      setAnalytics(analyticsData)

    } catch (error: any) {
      console.error('Error fetching attendance analytics:', error)
      message.error('Failed to fetch attendance analytics: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const exportAttendanceData = async (filters: AttendanceFilters = {}, type: 'logs' | 'summary' = 'summary') => {
    if (!permissions?.canExport) {
      message.error('You do not have permission to export data')
      return
    }

    try {
      // This would integrate with your existing export functionality
      message.info('Export functionality would be implemented here')
    } catch (error: any) {
      console.error('Error exporting data:', error)
      message.error('Failed to export data: ' + error.message)
    }
  }

  return {
    attendanceLogs,
    dailySummary,
    analytics,
    permissions,
    loading,
    fetchAttendanceLogs,
    fetchDailySummary,
    fetchAnalytics,
    exportAttendanceData,
    currentUser
  }
}