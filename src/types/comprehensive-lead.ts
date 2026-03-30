// Comprehensive Lead Type with ALL related data from ALL tables

export interface ComprehensiveLead {
  // Main Lead Data
  id: string
  customer_name: string
  email?: string
  mobile: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  capacity_kw?: number
  system_type?: string
  property_type?: string
  monthly_bill?: number
  source?: string
  branch_id?: string
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
  area_id?: string
  solar_category?: string
  state_id?: string
  district_id?: string
  city_id?: string
  source_user_id?: string
  source_user_name?: string
  subsidy_eligible?: boolean
  payment_type?: string
  pm_suryaghar_id?: string
  finance_bank?: string
  finance_amount?: number
  installation_date?: string
  payout_amount?: number
  subsidy_amount?: number
  completed_at?: string
  pm_suryaghar_date?: string
  pm_suryaghar_login_id?: string
  finance_approval_date?: string
  installation_team_id?: string
  payout_date?: string
  subsidy_claim_date?: string
  completion_date?: string
  is_subsidy_eligible?: boolean
  pm_suryaghar_login_date?: string
  estimated_total_cost?: number
  system_capacity_kw?: number
  application_type?: string
  status?: string

  // Relations
  branch?: {
    id: string
    name: string
    code: string
  }
  created_by_user?: {
    id: string
    name: string
    email: string
  }
  source_user?: {
    id: string
    name: string
    email: string
  }

  // Related Tables Data
  expenses?: LeadExpenseData[]
  bank_approval_costs?: BankApprovalCost[]
  disbursements?: Disbursement[]
  quotations?: Quotation[]
  bank_quotations?: BankQuotation[]
  installations?: Installation[]
  invoices?: Invoice[]
  net_metering?: NetMetering[]
  lead_payments?: LeadPayment[]
  lead_pm_suryaghar?: LeadPMSuryaghar
  lead_net_meter?: LeadNetMeter
  subsidy_claims?: SubsidyClaim[]
  lead_documents?: LeadDocument[]
  lead_activities?: LeadActivity[]
  material_usage?: MaterialUsage[]
  solar_shipments?: SolarShipment[]
}

export interface LeadExpenseData {
  id: string
  lead_id: string
  shipping_cost?: number
  shipping_date?: string
  shipping_status?: string
  shipping_notes?: string
  installation_cost?: number
  installation_date?: string
  installation_status?: string
  installation_notes?: string
  electricity_agreement_cost?: number
  electricity_agreement_date?: string
  electricity_agreement_status?: string
  net_metering_charge?: number
  net_metering_charge_date?: string
  net_metering_charge_status?: string
  net_meter_installation_charge?: number
  net_meter_installation_date?: string
  net_meter_installation_status?: string
  vendor_agreement_cost?: number
  vendor_agreement_date?: string
  vendor_agreement_status?: string
  margin_money?: number
  margin_payment_date?: string
  margin_payment_status?: string
  visiting_charge?: number
  visiting_payment_date?: string
  visiting_payment_status?: string
  total_expense?: number
  overall_status?: string
  bank_name?: string
  created_at: string
  updated_at: string
}

export interface BankApprovalCost {
  id: string
  lead_id: string
  bank_name?: string
  payment_date?: string
  margin_money?: number
  margin_payment_date?: string
  margin_payment_status?: string
  margin_money_status?: string
  margin_notes?: string
  bank_expense?: number
  expense_payment_date?: string
  expense_payment_status?: string
  bank_expense_status?: string
  expense_notes?: string
  visiting_charge?: number
  visiting_payment_date?: string
  visiting_payment_status?: string
  visiting_charge_status?: string
  visiting_notes?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Disbursement {
  id: string
  lead_id: string
  customer_name: string
  total_amount?: number
  first_payment_bank_name?: string
  first_payment_amount?: number
  first_payment_date?: string
  first_payment_utr?: string
  first_payment_status?: string
  second_payment_bank_name?: string
  second_payment_amount?: number
  second_payment_date?: string
  second_payment_utr?: string
  second_payment_status?: string
  cash_payment_amount?: number
  cash_payment_date?: string
  cash_payment_status?: string
  overall_status?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Quotation {
  id: string
  quotation_number: string
  lead_id?: string
  branch_id?: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  customer_address?: string
  system_capacity_kw: number
  total_amount: number
  installation_cost?: number
  raw_material_cost?: number
  commission_amount?: number
  net_amount: number
  status?: string
  valid_until?: string
  notes?: string
  application_type?: string
  system_type?: string
  additional_costs?: number
  margin_percentage?: number
  is_bank_quotation?: boolean
  created_at: string
  updated_at: string
}

export interface BankQuotation {
  id: string
  quotation_number: string
  lead_id?: string
  vendor_id?: string
  branch_id?: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  customer_address?: string
  product_summary: string
  base_total_amount: number
  margin_percentage: number
  margin_amount: number
  final_total_amount: number
  system_capacity_kw?: number
  application_type?: string
  valid_until: string
  status?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Installation {
  id: string
  lead_id?: string
  quotation_id?: string
  branch_id?: string
  installation_date?: string
  completion_date?: string
  status?: string
  installation_team_id?: string
  installation_address: string
  installation_notes?: string
  raw_materials_provided?: boolean
  raw_materials_cost?: number
  installation_cost?: number
  total_installation_cost?: number
  installation_time?: string
  inspection_date?: string
  inspection_time?: string
  inspection_notes?: string
  inspection_completed?: boolean
  inspection_completed_at?: string
  material_requirements?: string
  site_conditions?: string
  installation_started_at?: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  invoice_number: string
  invoice_date: string
  due_date?: string
  customer_type?: string
  lead_id?: string
  customer_id?: string
  customer_name: string
  customer_email?: string
  customer_phone?: string
  customer_address?: string
  customer_gstin?: string
  subtotal: number
  discount_percentage?: number
  discount_amount?: number
  taxable_amount?: number
  cgst_percentage?: number
  cgst_amount?: number
  sgst_percentage?: number
  sgst_amount?: number
  igst_percentage?: number
  igst_amount?: number
  total_amount: number
  amount_paid?: number
  balance_due?: number
  status?: string
  payment_status?: string
  quotation_id?: string
  terms_and_conditions?: string
  notes?: string
  branch_id?: string
  created_at: string
  updated_at: string
}

export interface NetMetering {
  id: string
  lead_id: string
  electricity_agreement_cost?: number
  electricity_agreement_date?: string
  electricity_agreement_file?: string
  electricity_agreement_notes?: string
  electricity_agreement_status?: string
  net_metering_charge?: number
  net_metering_date?: string
  net_metering_file?: string
  net_metering_notes?: string
  net_metering_status?: string
  net_meter_installation_charge?: number
  net_meter_installation_date?: string
  net_meter_installation_file?: string
  net_meter_installation_notes?: string
  net_meter_installation_status?: string
  vendor_agreement_cost?: number
  vendor_agreement_date?: string
  vendor_agreement_file?: string
  vendor_agreement_notes?: string
  vendor_agreement_status?: string
  created_at: string
  updated_at: string
}

export interface LeadPayment {
  id: string
  lead_id: string
  payment_type: string
  finance_application_id?: string
  bank_name?: string
  ifsc_code?: string
  sanctioned_amount?: number
  disbursed_amount?: number
  disbursement_date?: string
  pending_amount?: number
  account_number?: string
  vendor_name?: string
  total_amount?: number
  paid_amount?: number
  pending_cash_amount?: number
  payment_mode?: string
  payment_date?: string
  payment_reference?: string
  notes?: string
  utr_number?: string
  approval_status?: string
  created_by_name?: string
  created_at: string
  updated_at: string
}

export interface LeadPMSuryaghar {
  id: string
  lead_id: string
  portal_login_id?: string
  portal_password_hint?: string
  registration_date?: string
  application_number?: string
  feasibility_status?: string
  feasibility_approval_date?: string
  consumer_number?: string
  discom_name?: string
  sanction_load_kw?: number
  portal_status?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface LeadNetMeter {
  id: string
  lead_id: string
  application_number?: string
  application_date?: string
  approval_date?: string
  installation_date?: string
  meter_number?: string
  meter_type?: string
  discom_name?: string
  agreement_signed?: boolean
  agreement_date?: string
  commissioning_date?: string
  first_generation_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface SubsidyClaim {
  id: string
  lead_id?: string
  customer_name: string
  system_capacity: number
  installation_cost: number
  subsidy_amount: number
  subsidy_percentage: number
  status?: string
  application_number?: string
  submitted_date?: string
  approval_date?: string
  disbursement_date?: string
  rejection_reason?: string
  documents_required?: string[]
  documents_submitted?: string[]
  created_at: string
  updated_at: string
}

export interface LeadDocument {
  id: string
  lead_id: string
  document_type: string
  document_name: string
  file_path: string
  file_size?: number
  mime_type?: string
  status?: string
  uploaded_by?: string
  uploaded_at: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface LeadActivity {
  id: string
  lead_id: string
  activity_type: string
  description?: string
  created_by?: string
  created_at: string
}

export interface MaterialUsage {
  id: string
  installation_id: string
  lead_id?: string
  material_id: string
  quantity_received: number
  quantity_used?: number
  quantity_damaged?: number
  quantity_returned?: number
  wastage_percentage?: number
  serial_numbers_used?: string[]
  usage_date?: string
  used_by_name?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface SolarShipment {
  id: string
  lead_id: string
  shipment_date?: string
  shipment_type?: 'distributor_to_warehouse' | 'distributor_to_site' | 'warehouse_to_site'
  from_address?: string
  to_address?: string
  vehicle_id?: string
  status?: 'scheduled' | 'in_transit' | 'delivered' | 'completed' | 'cancelled'
  total_cost?: number
  delivery_date?: string
  notes?: string
  created_at: string
  updated_at: string
}
