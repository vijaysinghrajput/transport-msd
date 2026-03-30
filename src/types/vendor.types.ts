export type VendorType = 
  | 'manpower'
  | 'transport'
  | 'contractor'
  | 'supplier'
  | 'services'
  | 'maintenance'
  | 'other'

export interface BranchVendor {
  id: string
  branch_id: string
  vendor_code: string
  vendor_name: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  gst_number?: string
  pan_number?: string
  bank_name?: string
  bank_account_number?: string
  ifsc_code?: string
  vendor_type: VendorType
  service_categories?: string[]
  payment_terms?: string
  credit_limit?: number
  is_active: boolean
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface CreateBranchVendorInput {
  branch_id: string
  vendor_code?: string
  vendor_name: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  gst_number?: string
  pan_number?: string
  bank_name?: string
  bank_account_number?: string
  ifsc_code?: string
  vendor_type: VendorType
  service_categories?: string[]
  payment_terms?: string
  credit_limit?: number
  is_active?: boolean
  notes?: string
}

export interface UpdateBranchVendorInput {
  vendor_code?: string
  vendor_name?: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  gst_number?: string
  pan_number?: string
  bank_name?: string
  bank_account_number?: string
  ifsc_code?: string
  vendor_type?: VendorType
  service_categories?: string[]
  payment_terms?: string
  credit_limit?: number
  is_active?: boolean
  notes?: string
}

export interface BranchVendorFilters {
  vendor_type?: VendorType
  is_active?: boolean
  search?: string
}
