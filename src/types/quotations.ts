// Types for Quotation System
export interface Quotation {
  id: string
  quotation_number: string
  lead_id: string
  vendor_id: string
  brand_id: string
  application_type: string
  system_type: string
  solar_system_id: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  customer_address?: string
  system_capacity_kw: number
  total_amount: number
  installation_cost: number
  raw_material_cost: number
  net_amount: number
  additional_costs?: number
  valid_until: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  notes?: string
  created_by: string
  created_at: string
  updated_at?: string
  margin_money_applied?: {
    bank_name: string
    margin_percentage: number
    margin_amount: number
  }
  
  // Relations
  leads?: Lead
  vendors?: Vendor
  product_brands?: Brand
  solar_systems?: SolarSystem
  users?: User
}

export interface Lead {
  id: string
  customer_name: string
  email?: string
  mobile: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  system_capacity_kw?: number
  application_type?: string
  system_type?: string
  status: string
}

export interface Vendor {
  id: string
  company_name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  logo_url?: string
  signature_url?: string
  stamp_url?: string
  gst_number?: string
  pan_number?: string
  vendor_code?: string
  registration_number?: string
  is_active: boolean
}

export interface Brand {
  id: string
  name: string
  logo_url?: string
  website?: string
}

export interface SolarSystem {
  id: string
  name: string
  brand_id: string
  application_type: string
  system_type: string
  capacity_kw: number
  total_price: number
  subtotal_price: number
  installation_cost: number
  additional_costs?: number
  warranty_period?: number
  description?: string
  components?: SystemComponent[]
}

export interface SystemComponent {
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
}

export interface ProductDetail {
  id: string
  name: string
  description?: string
  sku?: string
  price: number
  unit: string
  warranty_period?: number
  specifications?: string
  technical_details?: string
  images?: string[]
  certifications?: string[]
  product_brands?: Brand
  product_categories?: {
    name: string
    description?: string
  }
}

export interface QuotationFormData {
  selectedLead: Lead | null
  selectedVendor: Vendor | null
  selectedBrand: string
  selectedApplicationType: string
  selectedSystemType: string
  selectedSolarSystem: SolarSystem | null
  isCreatingNewLead: boolean
}

export interface QuotationFilters {
  status?: string[]
  dateRange?: [string, string]
  customerName?: string
  quotationNumber?: string
}

export interface QuotationActions {
  onView: (quotation: Quotation) => void
  onEdit: (quotation: Quotation) => void
  onDelete: (id: string) => void
  onDownload: (quotation: Quotation) => void
}