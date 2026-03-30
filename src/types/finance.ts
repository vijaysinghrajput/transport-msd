export type FinanceLeadStatus =
  | 'new'
  | 'documents_pending'
  | 'documents_collected'
  | 'screening'
  | 'sent_to_partner'
  | 'in_partner_review'
  | 'approved'
  | 'disbursed'
  | 'rejected'
  | 'cancelled'

export const FINANCE_LEAD_STATUS_ORDER: FinanceLeadStatus[] = [
  'new',
  'documents_pending',
  'documents_collected',
  'screening',
  'sent_to_partner',
  'in_partner_review',
  'approved',
  'disbursed',
  'rejected',
  'cancelled'
]

export interface FinanceLeadStatusMeta {
  label: string
  color: string
  description: string
}

export const FINANCE_LEAD_STATUS_META: Record<FinanceLeadStatus, FinanceLeadStatusMeta> = {
  new: {
    label: 'New Lead',
    color: '#1890ff',
    description: 'Lead created and awaiting document collection'
  },
  documents_pending: {
    label: 'Documents Pending',
    color: '#faad14',
    description: 'Initial KYC documents outstanding from customer'
  },
  documents_collected: {
    label: 'Documents Collected',
    color: '#52c41a',
    description: 'All required documents collected and ready for screening'
  },
  screening: {
    label: 'Screening',
    color: '#722ed1',
    description: 'Internal screening and eligibility checks in progress'
  },
  sent_to_partner: {
    label: 'Sent To Partner',
    color: '#13c2c2',
    description: 'Lead shared with finance partner for further evaluation'
  },
  in_partner_review: {
    label: 'In Partner Review',
    color: '#2f54eb',
    description: 'Partner is reviewing documents and underwriting the case'
  },
  approved: {
    label: 'Approved',
    color: '#389e0d',
    description: 'Partner approved the application; awaiting disbursement'
  },
  disbursed: {
    label: 'Disbursed',
    color: '#237804',
    description: 'Funds disbursed to customer or vendor'
  },
  rejected: {
    label: 'Rejected',
    color: '#f5222d',
    description: 'Application rejected by partner or cancelled by customer'
  },
  cancelled: {
    label: 'Cancelled',
    color: '#595959',
    description: 'Lead cancelled internally or withdrawn'
  }
}

export interface FinanceLead {
  id: string
  customer_name: string
  customer_email?: string | null
  customer_phone: string
  alternate_phone?: string | null
  date_of_birth?: string | null
  pan_number?: string | null
  aadhaar_number?: string | null
  occupation?: string | null
  annual_income?: number | null
  product_type?: string | null
  requested_amount?: number | null
  category?: string | null
  lead_source?: string | null
  lead_provider?: string | null
  branch_id?: string | null
  partner_id?: string | null
  product_id?: string | null
  assigned_to?: string | null
  created_by?: string | null
  status: FinanceLeadStatus
  status_notes?: string | null
  documents_status?: string | null
  expected_payout?: number | null
  partner_reference?: string | null
  is_documents_complete?: boolean | null
  is_kyc_complete?: boolean | null
  created_at: string
  updated_at: string
}

