// ========================================
// Branch Expense Management Types
// ========================================

export type ExpenseStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'paid';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Cancelled';

export type PaymentMode = 'Cash' | 'Bank Transfer' | 'Cheque' | 'UPI' | 'Card' | 'Petty Cash' | 'Other';

// Branch office specific expenses only
export type ExpenseType =
  | 'rent'
  | 'electricity'
  | 'water'
  | 'internet'
  | 'food_canteen'
  | 'stationery'
  | 'printing'
  | 'office_supplies'
  | 'cleaning'
  | 'maintenance'
  | 'transportation_local'
  | 'telephone'
  | 'courier'
  | 'other';

export interface ExpenseCategory {
  id: string;
  category_name: string;
  description: string | null;
  is_active: boolean;
}

export interface BranchExpense {
  id: string;
  expense_number: string;
  branch_id: string;
  expense_date: string;
  category_id: string | null;
  expense_type: ExpenseType;
  sub_category?: string | null;
  amount: number;
  description: string;
  notes?: string | null;

  // Vendor
  vendor_id?: string | null;

  // Recipient/Vendor details
  recipient_type?: string | null;
  recipient_id?: string | null;
  recipient_name?: string | null;
  vendor_contact?: string | null;

  // Payment details
  payment_mode?: PaymentMode | null;
  payment_reference?: string | null;
  payment_date?: string | null;
  payment_status?: PaymentStatus | null;

  // Attachments
  receipt_url?: string | null;
  attachment_urls?: string[] | null;

  // Approval workflow
  status: ExpenseStatus;
  submitted_at?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  rejection_reason?: string | null;

  // Related transaction
  transaction_id?: string | null;

  // Audit
  created_by: string;
  created_by_name?: string | null;
  created_at: string;
  updated_at: string;

  // Relations (joined)
  branch_name?: string;
  category_name?: string;
}

export interface CreateBranchExpense {
  branch_id: string;
  expense_date: string;
  category_id?: string;
  expense_type: ExpenseType;
  sub_category?: string;
  amount: number;
  description: string;
  notes?: string;
  recipient_type?: string;
  recipient_name?: string;
  vendor_contact?: string;
  vendor_id?: string;
  payment_mode?: PaymentMode;
  payment_reference?: string;
  payment_date?: string;
  payment_status?: PaymentStatus;
  receipt_url?: string;
  attachment_urls?: string[];
  status?: ExpenseStatus;
}

export interface UpdateBranchExpense {
  expense_date?: string;
  category_id?: string;
  expense_type?: ExpenseType;
  sub_category?: string;
  amount?: number;
  description?: string;
  notes?: string;
  recipient_type?: string;
  recipient_name?: string;
  vendor_contact?: string;
  vendor_id?: string;
  payment_mode?: PaymentMode;
  payment_reference?: string;
  payment_date?: string;
  payment_status?: PaymentStatus;
  receipt_url?: string;
  attachment_urls?: string[];
  status?: ExpenseStatus;
  rejection_reason?: string;
  submitted_at?: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
}

export interface ExpenseSummary {
  branch_id: string;
  branch_name: string;
  manager_name: string | null;
  expense_month: string;
  expense_type: ExpenseType;
  expense_count: number;
  total_amount: number;
  approved_amount: number;
  pending_amount: number;
  rejected_amount: number;
}

export interface ExpenseFilters {
  branch_id?: string;
  status?: ExpenseStatus;
  expense_type?: ExpenseType;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  vendor_id?: string;
}

export interface ExpenseStats {
  total: number;
  draft?: number;
  pending: number;
  approved: number;
  paid: number;
  rejected: number;
  total_amount?: number;
  approved_amount?: number;
  pending_amount?: number;
  byType?: Record<ExpenseType, number>;
  byBranch?: Array<{
    branch_id: string;
    branch_name: string;
    total: number;
    count: number;
  }>;
}
