'use client'

import { Typography, Tooltip } from 'antd'

const { Text } = Typography

interface AmountProps {
  value?: number | null
  currency?: string
  size?: 'small' | 'default' | 'large'
  color?: string
  showSign?: boolean
  compact?: boolean
}

export default function Amount({
  value,
  currency = '₹',
  size = 'default',
  color,
  showSign = false,
  compact = false,
}: AmountProps) {
  if (value === null || value === undefined) {
    return <Text type="secondary">—</Text>
  }

  const formatNumber = (num: number) => {
    if (compact && Math.abs(num) >= 100000) {
      const lakhs = num / 100000
      return `${lakhs.toFixed(1)}L`
    }
    if (compact && Math.abs(num) >= 1000) {
      const thousands = num / 1000
      return `${thousands.toFixed(1)}K`
    }
    return num.toLocaleString('en-IN')
  }

  const fontSize = size === 'small' ? 12 : size === 'large' ? 20 : 14
  const fontWeight = size === 'large' ? 600 : size === 'default' ? 500 : 400
  const sign = showSign && value > 0 ? '+' : ''

  const displayValue = `${currency}${sign}${formatNumber(value)}`
  const fullValue = `${currency}${value.toLocaleString('en-IN')}`

  const content = (
    <Text
      style={{
        fontSize,
        fontWeight,
        color: color || (value < 0 ? '#ff4d4f' : undefined),
        whiteSpace: 'nowrap',
      }}
    >
      {displayValue}
    </Text>
  )

  return compact && Math.abs(value) >= 1000 ? (
    <Tooltip title={fullValue}>{content}</Tooltip>
  ) : (
    content
  )
}
