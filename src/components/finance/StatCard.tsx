'use client'

import { Card, Statistic, Tooltip } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

interface StatCardProps {
  title: string
  value: number | string
  prefix?: React.ReactNode | string
  suffix?: string
  icon?: React.ReactNode
  color?: string
  trend?: number
  trendLabel?: string
  loading?: boolean
  compact?: boolean
  tooltip?: string
}

export default function StatCard({
  title,
  value,
  prefix,
  suffix,
  icon,
  color,
  trend,
  trendLabel,
  loading,
  compact = false,
  tooltip,
}: StatCardProps) {
  const content = (
    <Card
      size="small"
      style={{ height: '100%' }}
      styles={{ body: { padding: compact ? '12px 16px' : '16px 20px' } }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {icon && (
          <div
            style={{
              width: compact ? 36 : 44,
              height: compact ? 36 : 44,
              borderRadius: 8,
              background: color ? `${color}15` : '#f0f5ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color || '#1890ff',
              fontSize: compact ? 18 : 22,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              color: '#8c8c8c',
              marginBottom: 4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: compact ? 20 : 24,
              fontWeight: 600,
              color: color || '#262626',
              lineHeight: 1.2,
            }}
          >
            {typeof prefix === 'string' ? prefix : null}
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
            {suffix}
          </div>
          {trend !== undefined && (
            <div
              style={{
                fontSize: 12,
                marginTop: 4,
                color: trend >= 0 ? '#52c41a' : '#ff4d4f',
              }}
            >
              {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {' '}{Math.abs(trend)}%{trendLabel && ` ${trendLabel}`}
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content
}
