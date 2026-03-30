import React from 'react'
import { Card, Descriptions, Tag, Typography, Space } from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  DollarOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { ComprehensiveLead } from '@/types/comprehensive-lead'
import dayjs from 'dayjs'

const { Title, Text } = Typography

interface Props {
  lead: ComprehensiveLead
}

export default function LeadBasicInfo({ lead }: Props) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'new':
        return 'blue'
      case 'contacted':
        return 'cyan'
      case 'qualified':
        return 'green'
      case 'proposal':
        return 'orange'
      case 'negotiation':
        return 'purple'
      case 'won':
        return 'success'
      case 'lost':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Card
      title={
        <Space>
          <UserOutlined />
          <span>Lead Basic Information</span>
        </Space>
      }
      className="mb-4"
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Customer Name" span={1}>
          <Text strong className="text-lg">{lead.customer_name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Status" span={1}>
          <Tag color={getStatusColor(lead.status)}>
            {lead.status?.toUpperCase() || 'N/A'}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Mobile" span={1}>
          <Space>
            <PhoneOutlined />
            <Text copyable>{lead.mobile}</Text>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={1}>
          {lead.email ? (
            <Space>
              <MailOutlined />
              <Text copyable>{lead.email}</Text>
            </Space>
          ) : (
            '-'
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Address" span={2}>
          <Space>
            <EnvironmentOutlined />
            <Text>
              {lead.address}
              {lead.city && `, ${lead.city}`}
              {lead.state && `, ${lead.state}`}
              {lead.pincode && ` - ${lead.pincode}`}
            </Text>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="System Capacity" span={1}>
          <Space>
            <ThunderboltOutlined />
            <Text strong className="text-blue-600">
              {lead.capacity_kw || lead.system_capacity_kw || 0} kW
            </Text>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Property Type" span={1}>
          <Space>
            <HomeOutlined />
            {lead.property_type || '-'}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="System Type" span={1}>
          {lead.system_type || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Application Type" span={1}>
          {lead.application_type || '-'}
        </Descriptions.Item>

        <Descriptions.Item label="Solar Category" span={1}>
          {lead.solar_category || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Monthly Bill" span={1}>
          {lead.monthly_bill ? `₹${lead.monthly_bill.toLocaleString()}` : '-'}
        </Descriptions.Item>

        <Descriptions.Item label="Estimated Cost" span={1}>
          <Space>
            <DollarOutlined />
            <Text strong className="text-green-600">
              {lead.estimated_total_cost
                ? `₹${lead.estimated_total_cost.toLocaleString()}`
                : '-'}
            </Text>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Payment Type" span={1}>
          <Tag color="blue">{lead.payment_type || 'Not specified'}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Source" span={1}>
          {lead.source || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Source User" span={1}>
          {lead.source_user_name || lead.source_user?.name || '-'}
        </Descriptions.Item>

        <Descriptions.Item label="Branch" span={1}>
          {lead.branch?.name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Created By" span={1}>
          {lead.created_by_user?.name || '-'}
        </Descriptions.Item>

        <Descriptions.Item label="Created Date" span={1}>
          {dayjs(lead.created_at).format('DD MMM YYYY, hh:mm A')}
        </Descriptions.Item>
        <Descriptions.Item label="Last Updated" span={1}>
          {dayjs(lead.updated_at).format('DD MMM YYYY, hh:mm A')}
        </Descriptions.Item>

        {lead.notes && (
          <Descriptions.Item label="Notes" span={2}>
            <Text>{lead.notes}</Text>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  )
}
