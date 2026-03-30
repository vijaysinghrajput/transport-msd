export interface Vendor {
  id: string
  vendor_code: string
  company_name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  gst_number?: string
  pan_number?: string
  bank_account_number?: string
  bank_name?: string
  ifsc_code?: string
  vendor_type: 'subsidy_vendor' | 'installation_vendor' | 'maintenance_vendor' | 'other'
  registration_number?: string
  registration_date?: string
  validity_period_months: number
  is_active: boolean
  rating: number
  notes?: string
  created_at: string
  updated_at: string
  // Location foreign keys
  state_id?: string
  district_id?: string
  city_id?: string
  area_id?: string
  // Joined location data
  states?: { name: string }
  districts?: { name: string }
  cities?: { name: string }
  areas?: { name: string; pincode: string }
  // Image URLs
  logo_url?: string
  signature_url?: string
  stamp_url?: string
}

export interface Distributor {
  id: string
  distributor_code: string
  company_name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  gst_number?: string
  pan_number?: string
  bank_account_number?: string
  bank_name?: string
  ifsc_code?: string
  distributor_type: 'wholesaler' | 'distributor' | 'manufacturer' | 'supplier'
  business_category?: 'solar_panels' | 'inverters' | 'mounting_structures' | 'cables_wiring' | 'batteries' | 'charge_controllers' | 'monitoring_systems' | 'accessories' | 'complete_systems' | 'other'
  credit_limit: number
  payment_terms?: 'COD' | '7_days' | '15_days' | '30_days' | '45_days' | '60_days' | '90_days'
  minimum_order_amount: number
  delivery_time_days: number
  is_active: boolean
  rating: number
  notes?: string
  created_at: string
  updated_at: string
  // Location foreign keys
  state_id?: string
  district_id?: string
  city_id?: string
  area_id?: string
  // Joined location data
  states?: { name: string }
  districts?: { name: string }
  cities?: { name: string }
  areas?: { name: string; pincode: string }
}

export interface VendorFormData {
  company_name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  gst_number?: string
  pan_number?: string
  bank_account_number?: string
  bank_name?: string
  ifsc_code?: string
  vendor_type: string
  registration_number?: string
  registration_date?: Date
  validity_period_months: number
  is_active: boolean
  rating: number
  notes?: string
}

export interface DistributorFormData {
  company_name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  gst_number?: string
  pan_number?: string
  bank_account_number?: string
  bank_name?: string
  ifsc_code?: string
  distributor_type: string
  business_category?: string
  credit_limit: number
  payment_terms?: string
  minimum_order_amount: number
  delivery_time_days: number
  is_active: boolean
  rating: number
  notes?: string
}