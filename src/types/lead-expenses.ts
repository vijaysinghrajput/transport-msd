export interface LeadExpense {
  id: string
  lead_id: string
  
  // Shipping Expenses
  shipping_cost?: number
  shipping_date?: string
  shipping_status?: 'pending' | 'paid' | 'cancelled'
  shipping_notes?: string
  shipping_file_url?: string
  
  // Installation Expenses
  installation_cost?: number
  installation_date?: string
  installation_status?: 'pending' | 'paid' | 'cancelled'
  installation_notes?: string
  installation_file_url?: string
  
  // Net Metering Expenses (4 types)
  electricity_agreement_cost?: number
  electricity_agreement_date?: string
  electricity_agreement_status?: 'pending' | 'paid' | 'cancelled'
  electricity_agreement_notes?: string
  electricity_agreement_file?: string
  
  net_metering_charge?: number
  net_metering_charge_date?: string
  net_metering_charge_status?: 'pending' | 'paid' | 'cancelled'
  net_metering_charge_notes?: string
  net_metering_charge_file?: string
  
  net_meter_installation_charge?: number
  net_meter_installation_date?: string
  net_meter_installation_status?: 'pending' | 'paid' | 'cancelled'
  net_meter_installation_notes?: string
  net_meter_installation_file?: string
  
  vendor_agreement_cost?: number
  vendor_agreement_date?: string
  vendor_agreement_status?: 'pending' | 'paid' | 'cancelled'
  vendor_agreement_notes?: string
  vendor_agreement_file?: string
  
  // Bank Expenses (3 types from bank_approval_costs table)
  margin_money?: number
  margin_payment_date?: string
  margin_payment_status?: 'pending' | 'paid' | 'cancelled'
  margin_notes?: string
  margin_file_url?: string
  
  visiting_charge?: number
  visiting_payment_date?: string
  visiting_payment_status?: 'pending' | 'paid' | 'cancelled'
  visiting_notes?: string
  visiting_file_url?: string
  
  bank_expense?: number
  bank_expense_date?: string
  bank_expense_status?: 'pending' | 'paid' | 'cancelled'
  bank_expense_notes?: string
  bank_expense_file?: string
  
  // Other Expenses
  other_expenses?: OtherExpense[]
  
  // Totals & Status
  total_expense: number
  overall_status: 'pending' | 'partial' | 'completed'
  
  // Metadata
  bank_name?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  
  // Relations
  lead?: {
    id: string
    customer_name: string
    mobile: string
    address: string
    city: string
    capacity_kw: number
    branch?: {
      id: string
      name: string
    }
  }
}

export interface OtherExpense {
  name: string
  amount: number
  date?: string
  status: 'pending' | 'paid' | 'cancelled'
  notes?: string
  file_url?: string
}

export interface LeadExpenseFormData {
  lead_id: string
  
  shipping_cost?: number
  shipping_date?: string
  shipping_status?: string
  shipping_notes?: string
  
  installation_cost?: number
  installation_date?: string
  installation_status?: string
  installation_notes?: string
  
  networking_cost?: number
  networking_date?: string
  networking_status?: string
  networking_notes?: string
  
  bank_expense?: number
  bank_expense_date?: string
  bank_expense_status?: string
  bank_expense_notes?: string
  
  margin_money?: number
  margin_payment_date?: string
  margin_payment_status?: string
  margin_notes?: string
  
  visiting_charge?: number
  visiting_payment_date?: string
  visiting_payment_status?: string
  visiting_notes?: string
  
  other_expenses?: OtherExpense[]
  
  overall_status?: string
  bank_name?: string
}

export interface LeadExpenseSummary {
  total_expenses: number
  total_shipping: number
  total_installation: number
  total_networking: number
  total_bank_expense: number
  total_margin_money: number
  total_visiting_charge: number
  pending_count: number
  partial_count: number
  completed_count: number
  total_leads_with_expenses: number
}

export const EXPENSE_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Cancelled', value: 'cancelled' },
]

export const EXPENSE_CATEGORIES = [
  { label: 'Shipping Cost', key: 'shipping_cost' },
  { label: 'Installation Cost', key: 'installation_cost' },
  { label: 'Networking Cost', key: 'networking_cost' },
  { label: 'Bank Expense', key: 'bank_expense' },
  { label: 'Margin Money', key: 'margin_money' },
  { label: 'Visiting Charge', key: 'visiting_charge' },
]
