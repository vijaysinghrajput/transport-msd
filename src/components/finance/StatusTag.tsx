'use client'

import { Tag } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons'

type StatusType = 
  | 'paid' | 'pending' | 'cancelled' | 'overdue' 
  | 'completed' | 'in_progress' | 'failed'
  | 'active' | 'inactive' | 'draft'
  | 'approved' | 'rejected' | 'processing'

interface StatusTagProps {
  status: string
  size?: 'small' | 'default'
  showIcon?: boolean
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  paid: { color: 'success', icon: <CheckCircleOutlined />, label: 'Paid' },
  pending: { color: 'warning', icon: <ClockCircleOutlined />, label: 'Pending' },
  cancelled: { color: 'error', icon: <CloseCircleOutlined />, label: 'Cancelled' },
  overdue: { color: 'error', icon: <ExclamationCircleOutlined />, label: 'Overdue' },
  completed: { color: 'success', icon: <CheckCircleOutlined />, label: 'Completed' },
  in_progress: { color: 'processing', icon: <SyncOutlined spin />, label: 'In Progress' },
  failed: { color: 'error', icon: <CloseCircleOutlined />, label: 'Failed' },
  active: { color: 'success', icon: <CheckCircleOutlined />, label: 'Active' },
  inactive: { color: 'default', icon: <MinusCircleOutlined />, label: 'Inactive' },
  draft: { color: 'default', icon: <ClockCircleOutlined />, label: 'Draft' },
  approved: { color: 'success', icon: <CheckCircleOutlined />, label: 'Approved' },
  rejected: { color: 'error', icon: <CloseCircleOutlined />, label: 'Rejected' },
  processing: { color: 'processing', icon: <SyncOutlined spin />, label: 'Processing' },
  cleared: { color: 'success', icon: <CheckCircleOutlined />, label: 'Cleared' },
  partial: { color: 'warning', icon: <ClockCircleOutlined />, label: 'Partial' },
}

export default function StatusTag({ status, size = 'default', showIcon = true }: StatusTagProps) {
  const config = statusConfig[status?.toLowerCase()] || {
    color: 'default',
    icon: <MinusCircleOutlined />,
    label: status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown',
  }

  return (
    <Tag
      color={config.color}
      icon={showIcon ? config.icon : undefined}
      style={{ 
        margin: 0,
        fontSize: size === 'small' ? 11 : 12,
        padding: size === 'small' ? '0 6px' : undefined,
      }}
    >
      {config.label}
    </Tag>
  )
}
