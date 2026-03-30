export interface Branch {
  id: string
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  manager_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BranchStats {
  total_leads: number
  active_agents: number
  monthly_revenue: number
  conversion_rate: number
}