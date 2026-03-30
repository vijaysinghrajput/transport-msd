// Attendance System Types
export interface AttendanceLog {
  id: string
  user_id: string
  branch_id: string
  log_date: string
  log_type: 'check_in' | 'check_out'
  logged_at: string
  device_lat?: number
  device_lng?: number
  distance_from_branch?: number
  status?: 'on_time' | 'late' | 'valid' | 'invalid'
  notes?: string
  source?: 'mobile_app' | 'web' | 'system'
  created_at: string
  
  // Relations
  users?: {
    id: string
    name: string
    email: string
    role: string
    employee_id?: string
  }
  branches?: {
    id: string
    name: string
    city: string
    state: string
  }
}

export interface AttendanceDailySummary {
  id: string
  user_id: string
  branch_id: string
  attendance_date: string
  check_in_time?: string
  check_out_time?: string
  minutes_late?: number
  minutes_early_checkout?: number
  worked_minutes?: number
  status: 'present' | 'absent' | 'half_day' | 'late' | 'incomplete'
  created_at: string
  updated_at: string
  
  // Relations
  users?: {
    id: string
    name: string
    email: string
    role: string
    employee_id?: string
  }
  branches?: {
    id: string
    name: string
    city: string
    state: string
  }
}

export interface AttendanceAnalytics {
  totalEmployees: number
  presentToday: number
  absentToday: number
  lateToday: number
  avgWorkingHours: number
  attendancePercentage: number
  branchWiseStats: {
    branch_id: string
    branch_name: string
    total_employees: number
    present: number
    absent: number
    late: number
    percentage: number
  }[]
  roleWiseStats: {
    role: string
    total_employees: number
    present: number
    absent: number
    percentage: number
  }[]
  monthlyTrends: {
    date: string
    present: number
    absent: number
    percentage: number
  }[]
}

export interface AttendanceFilters {
  startDate?: string
  endDate?: string
  branchId?: string
  userId?: string
  status?: string[]
  role?: string[]
  searchTerm?: string
}

export interface AttendancePermissions {
  canViewAll: boolean
  canViewBranch: boolean
  canViewOwn: boolean
  canExport: boolean
  canAnalyze: boolean
  allowedBranches: string[]
  allowedRoles: string[]
}