'use client'

import { Card, Row, Col, Statistic, Typography, Progress } from 'antd'
import { ReactNode } from 'react'

const { Text } = Typography

export interface SectionStat {
  label: string
  icon?: ReactNode
  iconColor?: string
  total: number
  progress?: number  // 0-100
  progressLabel?: string
}

interface SummaryCardProps {
  recordCount: number
  totalAmount: number
  sections?: SectionStat[]
  compact?: boolean
}

// Format amount in K notation
const formatAmount = (amount: number) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  return `₹${(amount / 1000).toFixed(1)}K`
}

export default function SummaryCard({ 
  recordCount, 
  totalAmount, 
  sections = [],
  compact = true 
}: SummaryCardProps) {
  const sectionColSpan = sections.length > 0 ? Math.floor(24 / sections.length) : 24

  return (
    <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
      {/* Overview Card */}
      <Col xs={24} md={sections.length > 0 ? (sections.length > 3 ? 6 : 8) : 24}>
        <Card size="small" style={{ background: 'linear-gradient(135deg, #e6f7ff 0%, #fff 100%)', height: '100%' }}>
          <Row gutter={8} align="middle">
            <Col span={sections.length > 3 ? 12 : 8}>
              <Statistic 
                title={<Text style={{ fontSize: 11 }}>Records</Text>} 
                value={recordCount} 
                valueStyle={{ fontSize: compact ? 18 : 24, fontWeight: 600 }} 
              />
            </Col>
            <Col span={sections.length > 3 ? 12 : 16}>
              <Text style={{ fontSize: 11, color: '#8c8c8c' }}>Total</Text>
              <div style={{ fontSize: compact ? 14 : 18, fontWeight: 600, color: '#1890ff' }}>
                {formatAmount(totalAmount)}
              </div>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* Section Stats */}
      {sections.length > 0 && (
        <Col xs={24} md={sections.length > 3 ? 18 : 16}>
          <Card size="small" style={{ height: '100%' }}>
            <Row gutter={[12, 4]} align="middle">
              {sections.map((section, index) => (
                <Col span={sectionColSpan} key={index}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {section.icon && (
                      <span style={{ color: section.iconColor || '#1890ff', fontSize: 13 }}>
                        {section.icon}
                      </span>
                    )}
                    <div style={{ flex: 1 }}>
                      <Text style={{ fontSize: 10, color: '#8c8c8c' }}>{section.label}</Text>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{formatAmount(section.total)}</div>
                      {section.progress !== undefined && (
                        <Progress 
                          percent={section.progress} 
                          size="small" 
                          strokeColor="#52c41a"
                          format={p => <span style={{ fontSize: 9 }}>{section.progressLabel || `${p}%`}</span>}
                        />
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      )}
    </Row>
  )
}
