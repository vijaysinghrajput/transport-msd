/**
 * Disbursement Types
 * 
 * Maps to `disbursements`, `disbursement_activity_logs`, and `bank_disbursement_parts` tables.
 */

export type PaymentStatus = 'pending' | 'received' | 'failed';
export type OverallStatus = 'pending' | 'partial' | 'completed';

export interface Disbursement {
  id: string;
  created_at: string;
  updated_at: string;

  // Lead info
  lead_id: string;
  customer_name: string;
  total_amount: number | null;

  // First Payment
  first_payment_bank_name: string | null;
  first_payment_amount: number | null;
  first_payment_date: string | null;
  first_payment_utr: string | null;
  first_payment_status: PaymentStatus;

  // Second Payment
  second_payment_bank_name: string | null;
  second_payment_amount: number | null;
  second_payment_date: string | null;
  second_payment_utr: string | null;
  second_payment_status: PaymentStatus;

  // Cash Payment
  cash_payment_amount: number | null;
  cash_payment_date: string | null;
  cash_payment_status: PaymentStatus;

  // Overall
  overall_status: OverallStatus;
  notes: string | null;
  created_by: string | null;

  // Joined lead data
  lead?: DisbursementLead;
}

export interface DisbursementLead {
  id: string;
  customer_name: string;
  mobile: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  capacity_kw?: number;
  estimated_total_cost?: number;
  source_user_name?: string;
  solar_category?: string;
  system_type?: string;
  property_type?: string;
  monthly_bill?: number;
  subsidy_eligible?: boolean;
  status?: string;
  branch?: { id: string; name: string };
}

export interface DisbursementActivityLog {
  id: string;
  disbursement_id: string;
  user_id: string | null;
  user_name: string | null;
  activity_type: string;
  description: string;
  old_value: any;
  new_value: any;
  created_at: string;
}

export interface DisbursementSummary {
  totalCount: number;
  pendingCount: number;
  partialCount: number;
  completedCount: number;
  totalFirstPayment: number;
  totalSecondPayment: number;
  totalCashPayment: number;
  totalReceived: number;
  totalPending: number;
}

export type PaymentSection = 'first_payment' | 'second_payment' | 'cash_payment';
