import { SolarSystemType } from './lead-new'

// Define PropertyType locally since it was in the old lead.ts
export type PropertyType = 'residential' | 'commercial' | 'industrial'
export type SystemType = SolarSystemType

export enum SubsidyStatus {
  PENDING = 'pending',
  DOCUMENTATION_REQUIRED = 'documentation_required',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DISBURSED = 'disbursed'
}

export enum GovernmentScheme {
  PM_SURYA_GHAR = 'pm_surya_ghar',
  KUSUM = 'kusum',
  STATE_SUBSIDY = 'state_subsidy',
  MNRE = 'mnre',
  CUSTOM = 'custom'
}

export interface SubsidyClaim {
  id: string
  lead_id: string
  customer_name: string
  system_capacity: number
  property_type: PropertyType
  system_type: SystemType
  installation_cost: number
  subsidy_amount: number
  subsidy_percentage: number
  government_scheme: GovernmentScheme
  scheme_details?: Json
  status: SubsidyStatus
  application_number?: string
  submitted_date?: string
  approval_date?: string
  disbursement_date?: string
  rejection_reason?: string
  documents_required: string[]
  documents_submitted: string[]
  inspector_name?: string
  inspection_date?: string
  inspection_report_url?: string
  branch_commission?: number
  agent_commission?: number
  created_by: string
  updated_by?: string
  created_at: string
  updated_at: string
}

export interface SubsidyDocument {
  id: string
  subsidy_claim_id: string
  document_type: string
  file_name: string
  file_url: string
  is_verified: boolean
  verified_by?: string
  verified_at?: string
  uploaded_by: string
  created_at: string
}

export interface SubsidyConfiguration {
  id: string
  scheme: GovernmentScheme
  state?: string
  min_capacity_kw: number
  max_capacity_kw: number
  subsidy_rate_per_kw: number
  max_subsidy_amount: number
  eligibility_criteria: string[]
  required_documents: string[]
  processing_time_days: number
  is_active: boolean
  valid_from: string
  valid_to?: string
  created_at: string
  updated_at: string
}

export interface SubsidyWorkflow {
  id: string
  subsidy_claim_id: string
  step_name: string
  status: 'pending' | 'completed' | 'rejected'
  assigned_to?: string
  completed_by?: string
  completed_at?: string
  notes?: string
  created_at: string
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Government subsidy rates (can be made configurable)
export const subsidyRates = {
  residential: {
    on_grid: {
      upTo3kW: 0.30, // 30% for up to 3kW
      above3kW: 0.20 // 20% for above 3kW
    }
  }
} as const