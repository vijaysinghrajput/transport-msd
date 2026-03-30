'use client'

import React from 'react'
import { Card, Descriptions, Tag, Row, Col, Typography } from 'antd'
import dayjs from 'dayjs'
import { ComprehensiveLead } from '@/types/comprehensive-lead'
import LeadBasicInfo from '@/components/lead-details/LeadBasicInfo'

const { Text } = Typography

interface OverviewTabProps {
  lead: ComprehensiveLead
}

export default function OverviewTab({ lead }: OverviewTabProps) {
  return (
    <div>
      <LeadBasicInfo lead={lead} />

      <Row gutter={16} className="mt-4">
        <Col span={8}>
          <Card title="System Details" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Capacity">
                {lead.capacity_kw || lead.system_capacity_kw || 0} kW
              </Descriptions.Item>
              <Descriptions.Item label="System Type">
                {lead.system_type || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Property Type">
                {lead.property_type || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Monthly Bill">
                ₹{(lead.monthly_bill || 0).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Financial Details" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Payment Type">
                {lead.payment_type || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Finance Bank">
                {lead.finance_bank || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Finance Amount">
                {lead.finance_amount ? `₹${lead.finance_amount.toLocaleString()}` : 'N/A'}
              </Descriptions.Item>
              {lead.finance_approval_date && (
                <Descriptions.Item label="Approval Date">
                  {dayjs(lead.finance_approval_date).format('DD MMM YYYY')}
                </Descriptions.Item>
              )}
            </Descriptions>
            {!lead.finance_bank && <Text type="secondary">No finance</Text>}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Installation Status" size="small">
            {lead.installation_date ? (
              <>
                <Tag color="green">Scheduled</Tag>
                <br />
                <Text>{dayjs(lead.installation_date).format('DD MMM YYYY')}</Text>
              </>
            ) : (
              <Text type="secondary">Not scheduled</Text>
            )}
            {lead.completion_date && (
              <>
                <br />
                <Text type="success">
                  Completed: {dayjs(lead.completion_date).format('DD MMM YYYY')}
                </Text>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
