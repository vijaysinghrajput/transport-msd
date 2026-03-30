'use client'

import { Table, Card, Input, Space, Button, Empty } from 'antd'
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'

interface DataTableProps<T> extends Omit<TableProps<T>, 'title'> {
  title?: string
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  onRefresh?: () => void
  onAdd?: () => void
  addLabel?: string
  extra?: React.ReactNode
  compact?: boolean
}

export default function DataTable<T extends object>({
  title,
  searchPlaceholder = 'Search...',
  onSearch,
  onRefresh,
  onAdd,
  addLabel = 'Add New',
  extra,
  compact = true,
  ...tableProps
}: DataTableProps<T>) {
  return (
    <Card
      size="small"
      title={title}
      styles={{ 
        header: { padding: '12px 16px', minHeight: 'auto', borderBottom: '1px solid #f0f0f0' },
        body: { padding: 0 } 
      }}
      extra={
        <Space size="small">
          {onSearch && (
            <Input.Search
              placeholder={searchPlaceholder}
              allowClear
              size="small"
              style={{ width: 220 }}
              onSearch={onSearch}
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            />
          )}
          {onRefresh && (
            <Button 
              size="small" 
              icon={<ReloadOutlined />} 
              onClick={onRefresh}
            />
          )}
          {onAdd && (
            <Button 
              type="primary" 
              size="small" 
              icon={<PlusOutlined />} 
              onClick={onAdd}
            >
              {addLabel}
            </Button>
          )}
          {extra}
        </Space>
      }
    >
      <Table<T>
        size="small"
        pagination={{
          size: 'small',
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          pageSize: 15,
        }}
        locale={{
          emptyText: <Empty description="No data" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
        }}
        {...tableProps}
        style={{ 
          ...tableProps.style,
        }}
      />
    </Card>
  )
}
