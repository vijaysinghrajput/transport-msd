// Real-time Tracking System Types

// GPS Tracking Session
export interface TrackingSession {
  id: string
  user_id: string
  branch_id: string
  punched_in_at: string
  punched_out_at?: string
  status: 'active' | 'completed' | 'cancelled'
  total_distance_m?: number
  travel_minutes?: number
  idle_minutes?: number
  stops_count?: number
  dwell_summary?: any
  ai_language?: string
  ai_summary?: string
  ai_notes?: any
  created_at: string
  updated_at: string
  last_aggregated_at?: string
  
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

// Individual GPS Tracking Point
export interface TrackingPoint {
  id: string
  session_id: string
  user_id: string
  recorded_at: string
  latitude: number
  longitude: number
  speed_m_s?: number
  accuracy_m?: number
  altitude_m?: number
  heading?: number
  activity?: string
  battery?: number
  is_manual?: boolean
  raw_geocode?: any
  created_at: string
  
  // Relations
  users?: {
    id: string
    name: string
    role: string
  }
  sessions?: TrackingSession
}

// Tracking Stop
export interface TrackingStop {
  id: string
  session_id: string
  start_time: string
  end_time?: string
  duration_minutes?: number
  latitude?: number
  longitude?: number
  place_name?: string
  reason?: string
  created_at: string
  
  // Relations
  sessions?: TrackingSession
}

// Analytics and Reporting Types
export interface TrackingAnalytics {
  totalActiveSessions: number
  totalEmployeesTracked: number
  totalDistanceCovered: number
  averageSpeed: number
  totalStops: number
  
  // Material allocation stats
  totalAllocations: number
  totalAllocatedValue: number
  pendingAllocations: number
  
  // Session analytics
  sessionsByStatus: {
    status: string
    count: number
    percentage: number
  }[]
  
  // User activity breakdown
  userActivities: {
    user_id: string
    user_name: string
    role: string
    active_sessions: number
    total_distance: number
    total_time: number
    last_seen: string
  }[]
  
  // Branch-wise tracking
  branchActivities: {
    branch_id: string
    branch_name: string
    active_users: number
    total_sessions: number
    avg_distance: number
  }[]
  
  // Hourly patterns
  hourlyActivity: {
    hour: string
    sessions: number
    points: number
    distance: number
  }[]
}

export interface TrackingFilters {
  startDate?: string
  endDate?: string
  userId?: string
  branchId?: string
  status?: string
  sessionId?: string
  searchTerm?: string
  materialCategory?: string
  installationStatus?: string
}

export interface RealTimeTracking {
  activeSessions: TrackingSession[]
  livePoints: TrackingPoint[]
  recentStops: TrackingStop[]
  onlineUsers: number
  systemStatus: 'healthy' | 'warning' | 'error'
}

export interface TrackingPermissions {
  canViewAll: boolean
  canViewBranch: boolean
  canViewOwn: boolean
  canExport: boolean
  canAnalyze: boolean
  allowedBranches: string[]
  allowedRoles: string[]
}