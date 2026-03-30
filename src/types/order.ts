export interface Order {
  id: string
  order_number: string
  lead_id: string
  customer_id: string
  branch_id: string
  assigned_agent_id?: string
  assigned_installation_team_id?: string
  order_type: OrderType
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  tax_amount: number
  discount_amount: number
  installation_charges: number
  total_amount: number
  advance_amount?: number
  balance_amount?: number
  payment_status: PaymentStatus
  installation_address: string
  expected_installation_date?: string
  actual_installation_date?: string
  completion_date?: string
  warranty_start_date?: string
  notes?: string
  created_by: string
  created_at: string
  updated_at: string
}

export enum OrderType {
  PRODUCT_ONLY = 'product_only',
  INSTALLATION_ONLY = 'installation_only',
  COMPLETE_SOLUTION = 'complete_solution',
  SOLAR_PACKAGE = 'solar_package'
}

export enum OrderStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_RECEIVED = 'payment_received',
  READY_FOR_INSTALLATION = 'ready_for_installation',
  INSTALLATION_IN_PROGRESS = 'installation_in_progress',
  INSTALLATION_COMPLETED = 'installation_completed',
  DOCUMENTATION_PENDING = 'documentation_pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  REFUNDED = 'refunded'
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  solar_package_id?: string
  product_name: string
  quantity: number
  unit_price: number
  discount_percentage?: number
  discount_amount?: number
  total_price: number
  serial_numbers?: string[]
  warranty_years?: number
}

export interface InstallationTeam {
  id: string
  name: string
  branch_id: string
  team_leader_id: string
  members: InstallationTeamMember[]
  expertise: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InstallationTeamMember {
  user_id: string
  role: 'leader' | 'technician' | 'helper'
  joined_date: string
}

export interface Installation {
  id: string
  order_id: string
  installation_team_id: string
  scheduled_date: string
  start_time?: string
  end_time?: string
  status: InstallationStatus
  pre_installation_checklist: ChecklistItem[]
  post_installation_checklist: ChecklistItem[]
  photos: InstallationPhoto[]
  customer_signature_url?: string
  technician_signature_url?: string
  completion_certificate_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export enum InstallationStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled'
}

export interface ChecklistItem {
  item: string
  is_completed: boolean
  notes?: string
  photo_url?: string
}

export interface InstallationPhoto {
  url: string
  caption: string
  timestamp: string
  taken_by: string
}

export interface Payment {
  id: string
  order_id: string
  payment_number: string
  amount: number
  payment_method: PaymentMethod
  payment_date: string
  payment_reference?: string
  status: PaymentStatus
  notes?: string
  created_by: string
  created_at: string
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
  UPI = 'upi',
  CARD = 'card',
  ONLINE = 'online'
}
