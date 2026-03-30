'use client'

import { Modal, Select, Alert, Empty, Spin, Card } from 'antd'
import CustomerInfo from './CustomerInfo'
import { LeadInfo } from './TableColumns'

export interface SelectableLead extends LeadInfo {
  id: string
}

interface LeadSelectModalProps {
  title?: string
  open: boolean
  onCancel: () => void
  onOk: () => void
  loading?: boolean
  leadsLoading?: boolean
  leads?: SelectableLead[]
  selectedLeadId: string
  onLeadChange: (leadId: string) => void
}

export default function LeadSelectModal({
  title = 'Create Record',
  open,
  onCancel,
  onOk,
  loading = false,
  leadsLoading = false,
  leads = [],
  selectedLeadId,
  onLeadChange,
}: LeadSelectModalProps) {
  const selectedLead = leads.find(l => l.id === selectedLeadId)

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText="Create"
      confirmLoading={loading}
      width={520}
    >
      <Alert message="Select a customer lead" type="info" showIcon style={{ marginBottom: 12 }} />
      
      {leadsLoading ? (
        <div style={{ textAlign: 'center', padding: 24 }}><Spin /></div>
      ) : leads.length > 0 ? (
        <Select
          style={{ width: '100%' }}
          placeholder="Search lead..."
          showSearch
          value={selectedLeadId || undefined}
          onChange={onLeadChange}
          filterOption={(input, opt) => (opt?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          options={leads.map(l => ({ 
            value: l.id, 
            label: `${l.customer_name} | ${l.mobile} | ${l.address || ''} | ${l.branch?.name || ''} | ${l.source || l.source_user_name || ''}`.replace(/\|\s*\|/g, '|').replace(/^\||\|$/g, '').trim()
          }))}
          optionRender={(opt) => {
            const lead = leads.find(l => l.id === opt.value)
            if (!lead) return opt.label
            return (
              <div style={{ padding: '4px 0' }}>
                <div style={{ fontWeight: 500 }}>{lead.customer_name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  📱 {lead.mobile} {lead.address && `• 📍 ${lead.address}${lead.city ? `, ${lead.city}` : ''}`}
                </div>
                <div style={{ fontSize: 11, marginTop: 2 }}>
                  {lead.branch?.name && <span style={{ color: '#1890ff', marginRight: 8 }}>🏢 {lead.branch.name}</span>}
                  {(lead.source || lead.source_user_name) && <span style={{ color: '#52c41a' }}>👤 {lead.source || lead.source_user_name}</span>}
                  {(lead.capacity_kw || lead.system_capacity_kw) && <span style={{ color: '#faad14', marginLeft: 8 }}>⚡ {lead.capacity_kw || lead.system_capacity_kw} kW</span>}
                </div>
              </div>
            )
          }}
        />
      ) : (
        <Empty description="No available leads" />
      )}

      {selectedLead && (
        <Card size="small" style={{ marginTop: 12, background: '#fafafa' }}>
          <CustomerInfo 
            name={selectedLead.customer_name || ''} 
            mobile={selectedLead.mobile} 
            address={selectedLead.address} 
            city={selectedLead.city} 
            state={selectedLead.state}
            capacityKw={selectedLead.capacity_kw || selectedLead.system_capacity_kw} 
            branchName={selectedLead.branch?.name}
            source={selectedLead.source}
            sourceUserName={selectedLead.source_user_name}
            compact 
          />
        </Card>
      )}
    </Modal>
  )
}
