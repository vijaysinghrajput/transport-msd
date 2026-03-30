'use client'

import { Select, Space, Button, Card, Row, Col, Typography } from 'antd'
import { ShopOutlined, TeamOutlined } from '@ant-design/icons'
import DateRangeFilter, { DateRange } from './DateRangeFilter'

const { Text } = Typography

export interface Branch {
  id: string
  name: string
}

export interface FilterBarProps {
  branches?: Branch[]
  sources?: string[]
  branchValue?: string
  sourceValue?: string
  dateRange?: DateRange
  onBranchChange: (value: string | undefined) => void
  onSourceChange: (value: string | undefined) => void
  onDateRangeChange: (value: DateRange | undefined) => void
  onClear?: () => void
  recordCount?: number
  extraFilters?: React.ReactNode
}

export default function FilterBar({
  branches,
  sources,
  branchValue,
  sourceValue,
  dateRange,
  onBranchChange,
  onSourceChange,
  onDateRangeChange,
  onClear,
  recordCount = 0,
  extraFilters,
}: FilterBarProps) {
  const hasFilters = branchValue || sourceValue || dateRange

  return (
    <Card size="small" style={{ marginBottom: 12 }}>
      <Row gutter={[8, 8]} align="middle">
        <Col flex="auto">
          <Space wrap size={8}>
            <Select
              placeholder="Branch"
              value={branchValue}
              onChange={onBranchChange}
              allowClear
              style={{ minWidth: 140 }}
              size="small"
              suffixIcon={<ShopOutlined />}
              options={branches?.map(b => ({ value: b.id, label: b.name }))}
            />
            <Select
              placeholder="Source"
              value={sourceValue}
              onChange={onSourceChange}
              allowClear
              showSearch
              style={{ minWidth: 140 }}
              size="small"
              suffixIcon={<TeamOutlined />}
              options={sources?.map(s => ({ value: s, label: s }))}
            />
            <DateRangeFilter
              value={dateRange}
              onChange={onDateRangeChange}
              placeholder="Date Range"
            />
            {extraFilters}
            {hasFilters && (
              <Button size="small" type="link" onClick={onClear}>
                Clear filters
              </Button>
            )}
          </Space>
        </Col>
        <Col>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {recordCount} records
          </Text>
        </Col>
      </Row>
    </Card>
  )
}
