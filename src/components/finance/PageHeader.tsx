'use client'

import { Typography, Space, Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Title, Text } = Typography

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

export default function PageHeader({ 
  title, 
  subtitle, 
  icon, 
  actions,
  breadcrumbs 
}: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      {breadcrumbs && (
        <Breadcrumb
          style={{ marginBottom: 8 }}
          items={[
            { title: <Link href="/dashboard"><HomeOutlined /></Link> },
            ...breadcrumbs.map((item) => ({
              title: item.href ? <Link href={item.href}>{item.label}</Link> : item.label,
            })),
          ]}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            {icon}
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              {subtitle}
            </Text>
          )}
        </div>
        {actions && <Space>{actions}</Space>}
      </div>
    </div>
  )
}
