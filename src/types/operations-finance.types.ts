// Asset & Operations Finance Types

export interface AssetExpense {
  id: string;
  expense_id: string;
  asset_type: 'vehicle' | 'equipment' | 'building' | 'solar_panel' | 'battery' | 'other';
  asset_name: string;
  asset_id?: string;
  expense_category: 'maintenance' | 'repair' | 'replacement' | 'upgrade' | 'depreciation';
  description: string;
  amount: number;
  currency: string;
  expense_date: string;
  paid_date?: string;
  invoice_number?: string;
  vendor_id?: string;
  vendor_name?: string;
  payment_method: 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'online';
  payment_status: 'pending' | 'partial' | 'paid';
  amount_paid?: number;
  due_date?: string;
  branch_id?: string;
  created_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TransportationExpense {
  id: string;
  expense_id: string;
  vehicle_id: string;
  vehicle_number: string;
  vehicle_type: 'truck' | 'van' | 'car' | 'bike' | 'auto';
  driver_name?: string;
  driver_id?: string;
  trip_id?: string;
  shipment_id?: string;
  expense_type: 'fuel' | 'maintenance' | 'toll' | 'insurance' | 'registration' | 'parking' | 'repair' | 'other';
  description: string;
  amount: number;
  currency: string;
  expense_date: string;
  paid_date?: string;
  invoice_number?: string;
  vendor_id?: string;
  vendor_name?: string;
  payment_method: 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'online';
  payment_status: 'pending' | 'partial' | 'paid';
  amount_paid?: number;
  due_date?: string;
  branch_id?: string;
  created_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseExpense {
  id: string;
  purchase_order_id: string;
  po_number: string;
  distributor_id: string;
  distributor_name: string;
  total_amount: number;
  subtotal: number;
  gst_amount: number;
  other_charges?: number;
  currency: string;
  po_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  invoice_number?: string;
  invoice_date?: string;
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue';
  amount_paid?: number;
  payment_terms?: string;
  next_payment_due?: string;
  payment_method?: 'bank_transfer' | 'check' | 'cash' | 'credit_line' | 'online';
  branch_id?: string;
  created_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NetMeteringExpense {
  id: string;
  expense_id: string;
  site_id?: string;
  site_name?: string;
  meter_id: string;
  billing_period_start: string;
  billing_period_end: string;
  units_consumed: number;
  units_generated?: number;
  net_units: number;
  rate_per_unit: number;
  total_amount: number;
  tax_amount?: number;
  currency: string;
  billing_date: string;
  due_date: string;
  payment_status: 'pending' | 'paid' | 'overdue' | 'credited';
  amount_paid?: number;
  payment_date?: string;
  payment_method?: 'bank_transfer' | 'check' | 'cash' | 'online';
  utility_provider?: string;
  bill_reference_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Net Metering Records - matches mobile app structure (lead-based)
export interface NetMetering {
  id: string;
  lead_id: string;
  // Electricity Agreement
  electricity_agreement_cost?: number;
  electricity_agreement_date?: string;
  electricity_agreement_file?: string;
  electricity_agreement_notes?: string;
  // Net Metering Charge
  net_metering_charge?: number;
  net_metering_date?: string;
  net_metering_file?: string;
  net_metering_notes?: string;
  // Net Meter Installation
  net_meter_installation_charge?: number;
  net_meter_installation_date?: string;
  net_meter_installation_file?: string;
  net_meter_installation_notes?: string;
  // Vendor Agreement
  vendor_agreement_cost?: number;
  vendor_agreement_date?: string;
  vendor_agreement_file?: string;
  vendor_agreement_notes?: string;
  // Timestamps
  created_at: string;
  updated_at: string;
  created_by?: string;
  // Relationship
  lead?: NetMeteringLead;
}

export interface NetMeteringLead {
  id: string;
  customer_name: string;
  mobile: string;
  address: string;
  city?: string;
  state?: string;
  capacity_kw?: number;
  system_capacity_kw?: number;
  source?: string;
  source_user_name?: string;
  branch_id?: string;
  branch?: { id: string; name: string } | null;
  status?: string;
}

export type NetMeteringSection = 'electricity_agreement' | 'net_metering' | 'net_meter_installation' | 'vendor_agreement';

// Bank Approval Costs - matches mobile app structure
export interface BankExpense {
  id: string;
  lead_id: string;
  bank_name?: string;
  
  // Margin Money to Bank fields
  margin_money?: number;
  margin_payment_date?: string;
  margin_payment_status?: 'paid' | 'pending' | 'cancelled';
  margin_file_url?: string;
  margin_notes?: string;
  
  // Bank Expense fields
  bank_expense?: number;
  expense_payment_date?: string;
  expense_payment_status?: 'paid' | 'pending' | 'cancelled';
  expense_file_url?: string;
  expense_notes?: string;
  
  // Visiting Charge fields
  visiting_charge?: number;
  visiting_payment_date?: string;
  visiting_payment_status?: 'paid' | 'pending' | 'cancelled';
  visiting_file_url?: string;
  visiting_notes?: string;
  
  // Relationship
  lead?: BankExpenseLead;
  
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BankExpenseLead {
  id: string;
  customer_name: string;
  mobile: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  capacity_kw?: number;
  system_capacity_kw?: number;
  payment_type?: string;
  finance_bank?: string;
  source?: string;
  source_user_id?: string;
  source_user_name?: string;
  branch_id?: string;
  branch?: { id: string; name: string } | null;
  status?: string;
}

export type BankExpenseSection = 'margin_money' | 'bank_expense' | 'visiting_charge';

export interface BankExpenseFieldMap {
  amount: string;
  date: string;
  status: string;
  file: string;
  notes: string;
}

export interface ExpenseReport {
  id: string;
  report_name: string;
  report_type: 'asset' | 'transportation' | 'purchase' | 'net_metering' | 'bank' | 'comprehensive';
  period_start: string;
  period_end: string;
  total_expenses: number;
  by_category: Record<string, number>;
  by_payment_status: Record<string, number>;
  currency: string;
  generated_by?: string;
  filters?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ExpenseDashboardMetrics {
  totalExpenses: number;
  pendingPayments: number;
  paidExpenses: number;
  overdueAmount: number;
  byCategory: Record<string, number>;
  byPaymentStatus: Record<string, number>;
  monthlyTrend: Array<{ month: string; amount: number }>;
  topVendors: Array<{ vendor: string; amount: number }>;
  currency: string;
}

// Installation Cost - matches mobile app structure
export interface InstallationCost {
  id: string;
  lead_id: string;
  installation_team_id?: string;
  // Cost fields
  installation_cost?: number;
  installation_per_kw_rate?: number;
  raw_materials_cost?: number;
  total_installation_cost?: number;
  // Status
  status?: 'cost_estimated' | 'inspection_scheduled' | 'materials_verified' | 'scheduled' | 'completed';
  payment_status?: 'pending' | 'partial' | 'paid';
  payment_date?: string;
  // Additional fields
  installation_date?: string;
  installation_time?: string;
  installation_address?: string;
  installation_notes?: string;
  inspection_date?: string;
  inspection_time?: string;
  inspection_notes?: string;
  material_requirements?: string;
  site_conditions?: string;
  // Timestamps
  created_at: string;
  updated_at: string;
  created_by?: string;
  // Relationships
  lead?: InstallationCostLead;
  installation_team?: InstallationTeam;
}

export interface InstallationCostLead {
  id: string;
  customer_name: string;
  mobile: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  capacity_kw?: number;
  system_capacity_kw?: number;
  estimated_total_cost?: number;
  source?: string;
  source_user_name?: string;
  branch_id?: string;
  branch?: { id: string; name: string } | null;
  status?: string;
}

export interface InstallationTeam {
  id: string;
  team_name: string;
  team_leader_name: string;
  team_leader_contact?: string;
  email?: string;
  status?: string;
  is_active?: boolean;
  branch_id?: string;
  team_type?: 'independent' | 'inhouse';
}

// Purchase Order Types
export interface PurchaseOrder {
  id: string;
  po_number: string;
  po_date: string;
  distributor_id?: string;
  distributor_name: string;
  distributor_contact?: string;
  distributor_address?: string;
  to_warehouse_id?: string;
  bill_number?: string;
  bill_date?: string;
  bill_amount?: number;
  bill_document_url?: string;
  payment_terms?: string;
  payment_status?: 'pending' | 'partial' | 'paid' | 'overdue';
  amount_paid?: number;
  balance_amount?: number;
  payment_due_date?: string;
  status?: 'draft' | 'ordered' | 'confirmed' | 'in_transit' | 'received' | 'completed' | 'cancelled';
  total_items?: number;
  total_quantity?: number;
  subtotal?: number;
  gst_amount?: number;
  other_charges?: number;
  discount_amount?: number;
  total_amount?: number;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  created_by?: string;
  created_by_name?: string;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  document_type?: string;
  created_at: string;
  updated_at: string;
}

// Shipment Types
export interface Shipment {
  id: string;
  shipment_number: string;
  shipment_type: 'distributor_to_warehouse' | 'distributor_to_site' | 'warehouse_to_site' | 'warehouse_to_warehouse';
  from_type: string;
  from_id: string;
  from_name?: string;
  to_type: string;
  to_id: string;
  to_name?: string;
  to_address?: string;
  vehicle_id?: string;
  total_cost?: number;
  bill_document_url?: string;
  status?: 'scheduled' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  notes?: string;
  payment_status?: 'pending' | 'partial' | 'paid';
  payment_type?: string;
  per_km_rate?: number;
  total_distance_km?: number;
  loading_charge?: number;
  unloading_charge?: number;
  vehicle_payment_amount?: number;
  vehicle_payment_status?: string;
  vehicle_payment_date?: string;
  dispatch_date?: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  created_at: string;
  updated_at: string;
}
