'use client'

import { Space, Typography, Tag, Tooltip } from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  BankOutlined,
  MailOutlined,
  IdcardOutlined,
  ShopOutlined,
  TeamOutlined,
} from '@ant-design/icons'

const { Text } = Typography

interface CustomerInfoProps {
  name: string
  mobile?: string
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  capacityKw?: number
  bankName?: string
  customerId?: string
  branchName?: string
  source?: string
  sourceUserName?: string
  paymentType?: string
  compact?: boolean
  layout?: 'horizontal' | 'vertical'
}

export default function CustomerInfo({
  name,
  mobile,
  email,
  address,
  city,
  state,
  pincode,
  capacityKw,
  bankName,
  customerId,
  branchName,
  source,
  sourceUserName,
  paymentType,
  compact = false,
  layout = 'vertical',
}: CustomerInfoProps) {
  const iconStyle = { fontSize: 12, color: '#8c8c8c' }
  const textStyle = { fontSize: compact ? 12 : 13 }
  
  const fullAddress = [address, city, state, pincode].filter(Boolean).join(', ')

  if (layout === 'horizontal') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', alignItems: 'center' }}>
        <Text strong style={{ fontSize: compact ? 13 : 14 }}>
          <UserOutlined style={{ marginRight: 4, ...iconStyle }} />
          {name}
        </Text>
        {mobile && (
          <Tooltip title="Call">
            <a href={`tel:${mobile}`} style={{ color: '#1890ff', ...textStyle }}>
              <PhoneOutlined style={iconStyle} /> {mobile}
            </a>
          </Tooltip>
        )}
        {branchName && <Tag color="geekblue" style={{ margin: 0, fontSize: 11 }}><ShopOutlined /> {branchName}</Tag>}
        {source && <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>{source}</Tag>}
        {sourceUserName && <Tag color="default" style={{ margin: 0, fontSize: 11 }}><TeamOutlined /> {sourceUserName}</Tag>}
        {capacityKw && <Tag icon={<ThunderboltOutlined />} color="blue" style={{ margin: 0, fontSize: 11 }}>{capacityKw} kW</Tag>}
      </div>
    )
  }

  return (
    <Space direction="vertical" size={compact ? 2 : 4} style={{ width: '100%' }}>
      <Text strong style={{ fontSize: compact ? 14 : 16 }}>{name}</Text>
      
      {customerId && <Text type="secondary" style={textStyle}><IdcardOutlined style={iconStyle} /> {customerId}</Text>}
      
      {mobile && (
        <Tooltip title="Call">
          <a href={`tel:${mobile}`} style={{ color: '#1890ff', ...textStyle }}><PhoneOutlined style={iconStyle} /> {mobile}</a>
        </Tooltip>
      )}
      
      {email && (
        <Tooltip title="Email">
          <a href={`mailto:${email}`} style={{ color: '#1890ff', ...textStyle }}><MailOutlined style={iconStyle} /> {email}</a>
        </Tooltip>
      )}
      
      {fullAddress && <Text type="secondary" style={textStyle}><EnvironmentOutlined style={iconStyle} /> {fullAddress}</Text>}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
        {capacityKw && <Tag icon={<ThunderboltOutlined />} color="blue" style={{ margin: 0 }}>{capacityKw} kW</Tag>}
        {paymentType && <Tag color={paymentType === 'finance' ? 'orange' : 'green'} style={{ margin: 0 }}>{paymentType}</Tag>}
        {bankName && <Tag color="purple" style={{ margin: 0 }}><BankOutlined /> {bankName}</Tag>}
      </div>
      
      {(branchName || source || sourceUserName) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
          {branchName && <Tag color="geekblue" style={{ margin: 0 }}><ShopOutlined /> {branchName}</Tag>}
          {source && <Tag color="cyan" style={{ margin: 0 }}>{source}</Tag>}
          {sourceUserName && <Tag color="default" style={{ margin: 0 }}><TeamOutlined /> {sourceUserName}</Tag>}
        </div>
      )}
    </Space>
  )
}
