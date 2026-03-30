'use client'

import React from 'react'
import { Card, Table, Tag, Empty, Typography } from 'antd'
import dayjs from 'dayjs'
import { ComprehensiveLead } from '@/types/comprehensive-lead'

const { Text } = Typography

interface ShippingExpensesTabProps {
  lead: ComprehensiveLead
}

export default function ShippingExpensesTab({ lead }: ShippingExpensesTabProps) {
  const shipments = lead.solar_shipments || []

  return (
    <div>
      {shipments.length > 0 ? (
        <Card title="Shipping Expenses">
          <Table
            dataSource={shipments}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: 'Shipment Date',
                dataIndex: 'shipment_date',
                key: 'shipment_date',
                render: (date) => date ? dayjs(date).format('DD MMM YYYY') : '-',
              },
              {
                title: 'Type',
                dataIndex: 'shipment_type',
                key: 'shipment_type',
                render: (type) => {
                  const labels: any = {
                    distributor_to_warehouse: 'Distributor → Warehouse',
                    distributor_to_site: 'Distributor → Site',
                    warehouse_to_site: 'Warehouse → Site',
                  }
                  return labels[type] || type
                },
              },
              {
                title: 'From',
                dataIndex: 'from_address',
                key: 'from_address',
              },
              {
                title: 'To',
                dataIndex: 'to_address',
                key: 'to_address',
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status) => {
                  const colors: any = {
                    scheduled: 'orange',
                    in_transit: 'blue',
                    delivered: 'green',
                    completed: 'cyan',
                    cancelled: 'red',
                  }
                  return <Tag color={colors[status] || 'default'}>{status}</Tag>
                },
              },
              {
                title: 'Total Cost',
                dataIndex: 'total_cost',
                key: 'total_cost',
                render: (cost) => <Text strong>₹{(cost || 0).toLocaleString()}</Text>,
              },
            ]}
            summary={(data) => {
              const total = data.reduce((sum, record) => sum + (record.total_cost || 0), 0)
              return (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={5}>
                      <Text strong>Total Shipping Expenses</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong style={{ color: '#cf1322' }}>₹{total.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )
            }}
          />
        </Card>
      ) : (
        <Empty description="No shipping expenses recorded" />
      )}
    </div>
  )
}
