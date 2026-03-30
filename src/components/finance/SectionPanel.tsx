'use client'

import { Card, Typography, Badge, Button, Descriptions, Divider } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import StatusTag from './StatusTag'
import Amount from './Amount'
import dayjs from 'dayjs'

const { Title, Text } = Typography

interface SectionPanelProps {
  title: string
  icon?: React.ReactNode
  iconColor?: string
  status?: 'completed' | 'pending'
  data?: {
    amount?: number
    date?: string
    paymentStatus?: string
    notes?: string
    fileUrl?: string
  }
  onAdd?: () => void
  onEdit?: () => void
  addLabel?: string
  compact?: boolean
}

export default function SectionPanel({
  title,
  icon,
  iconColor = '#1890ff',
  status = 'pending',
  data,
  onAdd,
  onEdit,
  addLabel = 'Add Details',
  compact = false,
}: SectionPanelProps) {
  const isCompleted = status === 'completed' || !!data?.date

  return (
    <Card
      size="small"
      style={{ marginBottom: compact ? 8 : 12 }}
      styles={{ body: { padding: compact ? '12px' : '16px' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && (
            <span style={{ fontSize: compact ? 16 : 18, color: iconColor }}>
              {icon}
            </span>
          )}
          <Text strong style={{ fontSize: compact ? 13 : 14 }}>{title}</Text>
        </div>
        <Badge 
          status={isCompleted ? 'success' : 'warning'} 
          text={<Text type="secondary" style={{ fontSize: 12 }}>{isCompleted ? 'Done' : 'Pending'}</Text>}
        />
      </div>

      {isCompleted && data ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 16px', fontSize: 13 }}>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Amount</Text>
              <div><Amount value={data.amount} size={compact ? 'default' : 'large'} /></div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Date</Text>
              <div>{data.date ? dayjs(data.date).format('DD MMM YYYY') : '—'}</div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Status</Text>
              <div>{data.paymentStatus ? <StatusTag status={data.paymentStatus} size="small" /> : '—'}</div>
            </div>
            {data.notes && (
              <div style={{ gridColumn: 'span 2' }}>
                <Text type="secondary" style={{ fontSize: 11 }}>Notes</Text>
                <div><Text style={{ fontSize: 12 }}>{data.notes}</Text></div>
              </div>
            )}
          </div>
          {onEdit && (
            <Button 
              type="link" 
              size="small" 
              icon={<EditOutlined />} 
              onClick={onEdit}
              style={{ padding: 0, marginTop: 8, height: 'auto' }}
            >
              Edit
            </Button>
          )}
        </>
      ) : (
        <Button 
          type="primary" 
          size="small" 
          onClick={onAdd}
          style={{ width: '100%' }}
        >
          {addLabel}
        </Button>
      )}
    </Card>
  )
}
