// Finance Lead Service Types
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'application_created' | 'converted' | 'rejected' | 'closed'

export interface FinanceLead {
  id: string
  lead_number: string
  customer_name: string
  mobile: string
  email?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  
  // Product interest
  product_category_id?: string | null
  product_id?: string | null
  loan_amount?: number | null
  tenure_months?: number | null
  monthly_income?: number | null
  employment_type?: string | null
  
  // Lead management
  status: LeadStatus
  source?: string | null
  source_details?: string | null
  assigned_to?: string | null
  branch_id?: string | null
  priority?: 'low' | 'medium' | 'high' | null
  
  // Follow-up
  next_follow_up_date?: string | null
  last_contacted_date?: string | null
  notes?: string | null
  
  // Audit
  created_by: string
  created_by_name?: string | null
  created_at: string
  updated_at: string
}

export interface CreateFinanceLead {
  customer_name: string
  mobile: string
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  product_category_id?: string
  product_id?: string
  loan_amount?: number
  tenure_months?: number
  monthly_income?: number
  employment_type?: string
  status?: LeadStatus
  source?: string
  source_details?: string
  assigned_to?: string
  branch_id?: string
  priority?: 'low' | 'medium' | 'high'
  next_follow_up_date?: string
  notes?: string
}

export interface UpdateFinanceLead extends Partial<CreateFinanceLead> {
  last_contacted_date?: string
}

export interface LeadFilters {
  status?: LeadStatus
  product_category_id?: string
  product_id?: string
  date_from?: string
  date_to?: string
  branch_id?: string
  assigned_to?: string
  source?: string
  priority?: 'low' | 'medium' | 'high'
  search?: string
}

// Finance Application Types
export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'documents_pending'
  | 'approved' 
  | 'rejected' 
  | 'disbursed' 
  | 'cancelled'

export interface FinanceApplication {
  id: string
  application_number: string
  lead_id?: string | null
  
  // Customer details
  customer_name: string
  mobile: string
  email?: string | null
  pan_number?: string | null
  aadhar_number?: string | null
  date_of_birth?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  
  // Product details
  product_id?: string | null
  partner_id?: string | null
  loan_amount: number
  tenure_months: number
  interest_rate?: number | null
  processing_fee?: number | null
  
  // Employment
  employment_type?: string | null
  employer_name?: string | null
  monthly_income?: number | null
  work_experience_months?: number | null
  
  // References
  reference_name_1?: string | null
  reference_mobile_1?: string | null
  reference_name_2?: string | null
  reference_mobile_2?: string | null
  
  // Documents
  documents_submitted?: string[] | null
  documents_verified?: boolean | null
  
  // Workflow
  status: ApplicationStatus
  submitted_date?: string | null
  review_date?: string | null
  approved_date?: string | null
  disbursed_date?: string | null
  rejection_reason?: string | null
  
  // Assignment
  assigned_to?: string | null
  reviewed_by?: string | null
  approved_by?: string | null
  branch_id?: string | null
  
  // Additional
  notes?: string | null
  internal_remarks?: string | null
  
  // Audit
  created_by: string
  created_by_name?: string | null
  created_at: string
  updated_at: string
}

export interface CreateFinanceApplication {
  lead_id?: string
  customer_name: string
  mobile: string
  email?: string
  pan_number?: string
  aadhar_number?: string
  date_of_birth?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  product_id?: string
  partner_id?: string
  loan_amount: number
  tenure_months: number
  interest_rate?: number
  processing_fee?: number
  employment_type?: string
  employer_name?: string
  monthly_income?: number
  work_experience_months?: number
  reference_name_1?: string
  reference_mobile_1?: string
  reference_name_2?: string
  reference_mobile_2?: string
  documents_submitted?: string[]
  status?: ApplicationStatus
  assigned_to?: string
  branch_id?: string
  notes?: string
  internal_remarks?: string
}

export interface UpdateFinanceApplication extends Partial<CreateFinanceApplication> {
  documents_verified?: boolean
  rejection_reason?: string
}

export interface ApplicationFilters {
  status?: ApplicationStatus
  product_id?: string
  partner_id?: string
  date_from?: string
  date_to?: string
  branch_id?: string
  assigned_to?: string
  reviewed_by?: string
  min_amount?: number
  max_amount?: number
  search?: string
}

// Finance Product Types
export interface FinanceProduct {
  id: string
  product_code: string
  name: string
  description?: string | null
  category_id?: string | null
  product_type: 'loan' | 'credit_card' | 'insurance' | 'investment' | 'other'
  
  // Loan details
  min_loan_amount?: number | null
  max_loan_amount?: number | null
  min_tenure_months?: number | null
  max_tenure_months?: number | null
  interest_rate_min?: number | null
  interest_rate_max?: number | null
  processing_fee_percentage?: number | null
  processing_fee_flat?: number | null
  
  // Eligibility
  min_age?: number | null
  max_age?: number | null
  min_monthly_income?: number | null
  employment_types?: string[] | null
  credit_score_min?: number | null
  
  // Features
  features?: string[] | null
  documents_required?: string[] | null
  
  // Partner
  partner_id?: string | null
  commission_percentage?: number | null
  commission_flat?: number | null
  
  // Status
  is_active: boolean
  display_order?: number | null
  
  // Audit
  created_at: string
  updated_at: string
}

export interface CreateFinanceProduct {
  product_code: string
  name: string
  description?: string
  category_id?: string
  product_type: 'loan' | 'credit_card' | 'insurance' | 'investment' | 'other'
  min_loan_amount?: number
  max_loan_amount?: number
  min_tenure_months?: number
  max_tenure_months?: number
  interest_rate_min?: number
  interest_rate_max?: number
  processing_fee_percentage?: number
  processing_fee_flat?: number
  min_age?: number
  max_age?: number
  min_monthly_income?: number
  employment_types?: string[]
  credit_score_min?: number
  features?: string[]
  documents_required?: string[]
  partner_id?: string
  commission_percentage?: number
  commission_flat?: number
  is_active?: boolean
  display_order?: number
}

export interface UpdateFinanceProduct extends Partial<CreateFinanceProduct> {}

// Finance Partner Types
export interface FinancePartner {
  id: string
  partner_code: string
  partner_name: string
  partner_type: 'bank' | 'nbfc' | 'fintech' | 'insurance' | 'other'
  
  // Contact
  contact_person?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  website?: string | null
  
  // Business details
  pan_number?: string | null
  gst_number?: string | null
  
  // Commission
  default_commission_percentage?: number | null
  default_commission_flat?: number | null
  payout_terms?: string | null
  
  // Status
  is_active: boolean
  notes?: string | null
  
  // Audit
  created_at: string
  updated_at: string
}

export interface CreateFinancePartner {
  partner_code: string
  partner_name: string
  partner_type: 'bank' | 'nbfc' | 'fintech' | 'insurance' | 'other'
  contact_person?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  city?: string
  state?: string
  website?: string
  pan_number?: string
  gst_number?: string
  default_commission_percentage?: number
  default_commission_flat?: number
  payout_terms?: string
  is_active?: boolean
  notes?: string
}

export interface UpdateFinancePartner extends Partial<CreateFinancePartner> {}

// Finance Category Types
export interface FinanceCategory {
  id: string
  category_name: string
  category_code: string
  description?: string | null
  icon?: string | null
  display_order?: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateFinanceCategory {
  category_name: string
  category_code: string
  description?: string
  icon?: string
  display_order?: number
  is_active?: boolean
}

export interface UpdateFinanceCategory extends Partial<CreateFinanceCategory> {}

// Dashboard Stats
export interface FinanceDashboardStats {
  leads: {
    total: number
    new: number
    contacted: number
    qualified: number
    converted: number
    conversion_rate: number
  }
  applications: {
    total: number
    draft: number
    submitted: number
    under_review: number
    approved: number
    rejected: number
    disbursed: number
    total_amount: number
    approved_amount: number
    disbursed_amount: number
  }
  products: {
    total: number
    active: number
  }
  partners: {
    total: number
    active: number
  }
}

// Common
export interface PaginationParams {
  page?: number
  per_page?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  per_page: number
  total: number
  total_pages: number
}
