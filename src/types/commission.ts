export interface CommissionStructure {
  id: string
  name: string
  description?: string
  type: CommissionType
  is_active: boolean
  created_at: string
  updated_at: string
}

export enum CommissionType {
  PRODUCT_SALES = 'product_sales',
  INSTALLATION = 'installation',
  SUBSIDY_PROCESSING = 'subsidy_processing',
  LEAD_GENERATION = 'lead_generation'
}

export interface CommissionRule {
  id: string
  commission_structure_id: string
  entity_type: CommissionEntityType
  entity_id?: string // branch_id, agent_id, etc.
  product_category_id?: string
  product_id?: string
  min_amount?: number
  max_amount?: number
  commission_rate: number // percentage
  flat_amount?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export enum CommissionEntityType {
  BRANCH = 'branch',
  AGENT = 'agent',
  TELECALLER = 'telecaller',
  INSTALLATION_TEAM = 'installation_team',
  ACCOUNTS_TEAM = 'accounts_team'
}

export interface Commission {
  id: string
  order_id?: string
  lead_id?: string
  commission_structure_id: string
  commission_rule_id: string
  entity_type: CommissionEntityType
  entity_id: string
  base_amount: number
  commission_rate: number
  flat_amount?: number
  calculated_amount: number
  status: CommissionStatus
  payment_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export enum CommissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export interface CommissionPayout {
  id: string
  entity_type: CommissionEntityType
  entity_id: string
  period_start: string
  period_end: string
  total_amount: number
  commission_ids: string[]
  status: PayoutStatus
  payment_method?: string
  payment_reference?: string
  paid_date?: string
  created_by: string
  created_at: string
  updated_at: string
}

export enum PayoutStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed'
}

export interface Wallet {
  id: string
  entity_type: CommissionEntityType
  entity_id: string
  balance: number
  locked_balance: number
  last_transaction_date?: string
  created_at: string
  updated_at: string
}

export interface WalletTransaction {
  id: string
  wallet_id: string
  transaction_type: TransactionType
  amount: number
  balance_after: number
  reference_type: string // 'commission', 'payout', 'adjustment'
  reference_id: string
  description?: string
  created_at: string
}

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit'
}
