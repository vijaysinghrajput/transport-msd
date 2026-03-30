'use client'

import { Tag, Typography } from 'antd'

const { Text } = Typography

// Lead status color mapping (used across all finance pages)
export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: 'default',
  quotation_sent: 'processing',
  quotation_approved: 'blue',
  site_survey_completed: 'cyan',
  pm_portal_login_pending: 'orange',
  pm_feasibility_approved: 'lime',
  finance_application_submitted: 'purple',
  finance_under_review: 'geekblue',
  finance_disbursed: 'green',
  bank_file_submitted: 'volcano',
  bank_db_part_received: 'gold',
  installation_completed: 'success',
  system_commissioned: 'success',
  net_meter_application_submitted: 'magenta',
  subsidy_application_pending: 'warning',
  subsidy_under_review: 'processing',
  subsidy_approved: 'green',
  project_completed: 'success',
  cancelled: 'error',
  rejected: 'error',
}

// Format status for display
export const formatLeadStatus = (status: string) => 
  status.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())

// Common lead interface for table columns
export interface LeadInfo {
  customer_name?: string
  mobile?: string
  address?: string
  city?: string
  state?: string
  capacity_kw?: number
  system_capacity_kw?: number
  source?: string
  source_user_name?: string
  status?: string
  branch?: { id: string; name: string } | null
}

// Customer cell component
export function CustomerCell({ lead }: { lead?: LeadInfo }) {
  if (!lead) return <Text type="secondary">—</Text>
  return (
    <div>
      <div style={{ fontWeight: 500 }}>{lead.customer_name || '—'}</div>
      {lead.mobile && (
        <a href={`tel:${lead.mobile}`} style={{ fontSize: 12, color: '#1890ff' }}>
          {lead.mobile}
        </a>
      )}
      {lead.address && (
        <div style={{ fontSize: 11, color: '#8c8c8c' }}>
          {lead.address}{lead.city ? `, ${lead.city}` : ''}
        </div>
      )}
    </div>
  )
}

// Branch cell component
export function BranchCell({ lead, width = 110 }: { lead?: LeadInfo; width?: number }) {
  const branchName = lead?.branch?.name
  if (!branchName) return <Text type="secondary">—</Text>
  return (
    <Tag color="geekblue" style={{ margin: 0, fontSize: 11 }}>
      {branchName}
    </Tag>
  )
}

// Source cell component
export function SourceCell({ lead }: { lead?: LeadInfo }) {
  const source = lead?.source || lead?.source_user_name
  if (!source) return <Text type="secondary">—</Text>
  return (
    <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>
      {source}
    </Tag>
  )
}

// kW cell component
export function KwCell({ lead }: { lead?: LeadInfo }) {
  const kw = lead?.capacity_kw || lead?.system_capacity_kw
  if (!kw) return <Text type="secondary">—</Text>
  return <span style={{ fontWeight: 500 }}>{kw}</span>
}

// Lead status cell component
export function LeadStatusCell({ lead }: { lead?: LeadInfo }) {
  const status = lead?.status
  if (!status) return <Text type="secondary">—</Text>
  return (
    <Tag 
      color={LEAD_STATUS_COLORS[status] || 'default'} 
      style={{ margin: 0, fontSize: 10 }}
    >
      {formatLeadStatus(status)}
    </Tag>
  )
}

// Column definitions factory for common columns
export const createCommonColumns = () => ({
  customer: {
    title: 'Customer',
    key: 'customer',
    render: (_: any, r: any) => <CustomerCell lead={r.lead} />,
  },
  branch: {
    title: 'Branch',
    width: 110,
    render: (_: any, r: any) => <BranchCell lead={r.lead} />,
  },
  source: {
    title: 'Source',
    width: 110,
    render: (_: any, r: any) => <SourceCell lead={r.lead} />,
  },
  kw: {
    title: 'kW',
    width: 50,
    render: (_: any, r: any) => <KwCell lead={r.lead} />,
  },
  leadStatus: {
    title: 'Lead Status',
    width: 130,
    render: (_: any, r: any) => <LeadStatusCell lead={r.lead} />,
  },
})
