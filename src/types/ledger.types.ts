export type PartyType = 'user' | 'installation_team' | 'distributor' | 'vendor' | 'customer';
export type TransactionType = 'debit' | 'credit';
export type LedgerStatus = 'pending' | 'completed' | 'cancelled';
export type PaymentMode = 'cash' | 'bank_transfer' | 'upi' | 'cheque' | 'neft' | 'rtgs' | 'imps' | 'other';

export interface PartyLedger {
  id: string;
  ledger_number: string;
  transaction_date: string;
  party_type: PartyType;
  party_id: string;
  party_name: string;
  transaction_type: TransactionType;
  amount: number;
  description: string;
  reference_type?: string;
  reference_id?: string;
  reference_number?: string;
  payment_mode?: PaymentMode;
  payment_reference?: string;
  bank_name?: string;
  cheque_number?: string;
  cheque_date?: string;
  utr_number?: string;
  branch_id?: string;
  notes?: string;
  attachment_url?: string;
  status: LedgerStatus;
  created_by?: string;
  created_by_name?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  branches?: { name: string };
}

export interface CreateLedgerInput {
  transaction_date: string;
  party_type: PartyType;
  party_id: string;
  party_name: string;
  transaction_type: TransactionType;
  amount: number;
  description: string;
  reference_type?: string;
  reference_id?: string;
  reference_number?: string;
  payment_mode?: PaymentMode;
  payment_reference?: string;
  bank_name?: string;
  cheque_number?: string;
  cheque_date?: string;
  utr_number?: string;
  branch_id?: string;
  notes?: string;
  attachment_url?: string;
}

export interface UpdateLedgerInput {
  transaction_date?: string;
  amount?: number;
  description?: string;
  reference_type?: string;
  reference_id?: string;
  reference_number?: string;
  payment_mode?: PaymentMode;
  payment_reference?: string;
  bank_name?: string;
  cheque_number?: string;
  cheque_date?: string;
  utr_number?: string;
  notes?: string;
  attachment_url?: string;
  status?: LedgerStatus;
}

export interface PartyBalance {
  party_type: PartyType;
  party_id: string;
  party_name: string;
  total_debit: number;
  total_credit: number;
  balance: number;
  transaction_count: number;
  last_transaction_date: string;
}

export interface LedgerFilters {
  party_type?: PartyType;
  party_id?: string;
  transaction_type?: TransactionType;
  status?: LedgerStatus;
  branch_id?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export interface LedgerSummary {
  total_debit: number;
  total_credit: number;
  net_balance: number;
  transaction_count: number;
  pending_count: number;
}

// Party selection interfaces
export interface PartyOption {
  id: string;
  name: string;
  type: PartyType;
  code?: string;
  phone?: string;
  email?: string;
}
