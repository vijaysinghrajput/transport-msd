'use client'

import React from 'react'
import { Card, Table, Tag, Empty, Button, Typography } from 'antd'
import dayjs from 'dayjs'
import { ComprehensiveLead } from '@/types/comprehensive-lead'

const { Text } = Typography

interface NetMeteringExpensesTabProps {
  lead: ComprehensiveLead
}

export default function NetMeteringExpensesTab({ lead }: NetMeteringExpensesTabProps) {
  const netMetering = lead.net_metering || []

  // Create a data structure for the table
  const tableData = netMetering.flatMap((nm) => [
    {
      id: `${nm.id}-electricity`,
      type: 'Electricity Agreement',
      cost: nm.electricity_agreement_cost || 0,
      date: nm.electricity_agreement_date,
      file: nm.electricity_agreement_file,
      status: nm.electricity_agreement_status || 'pending',
    },
    {
      id: `${nm.id}-net-metering`,
      type: 'Net Metering Charge',
      cost: nm.net_metering_charge || 0,
      date: nm.net_metering_date,
      file: nm.net_metering_file,
      status: nm.net_metering_status || 'pending',
    },
    {
      id: `${nm.id}-meter-install`,
      type: 'Net Meter Installation',
      cost: nm.net_meter_installation_charge || 0,
      date: nm.net_meter_installation_date,
      file: nm.net_meter_installation_file,
      status: nm.net_meter_installation_status || 'pending',
    },
    {
      id: `${nm.id}-vendor`,
      type: 'Vendor Agreement',
      cost: nm.vendor_agreement_cost || 0,
      date: nm.vendor_agreement_date,
      file: nm.vendor_agreement_file,
      status: nm.vendor_agreement_status || 'pending',
    },
  ])

  return (
    <div>
      {tableData.length > 0 ? (
        <Card title="Net Metering Expenses">
          <Table
            dataSource={tableData}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: 'Expense Type',
                dataIndex: 'type',
                key: 'type',
                width: '25%',
              },
              {
                title: 'Cost',
                dataIndex: 'cost',
                key: 'cost',
                width: '20%',
                render: (cost) => <Text strong>₹{cost.toLocaleString()}</Text>,
              },
              {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: '20%',
                render: (date) => date ? dayjs(date).format('DD MMM YYYY') : '-',
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: '15%',
                render: (status) => {
                  const colors: any = {
                    paid: 'green',
                    pending: 'orange',
                    approved: 'blue',
                    rejected: 'red',
                  }
                  return <Tag color={colors[status] || 'default'}>{status}</Tag>
                },
              },
              {
                title: 'Document',
                dataIndex: 'file',
                key: 'file',
                width: '20%',
                render: (file) => file ? (
                  <Button type="link" size="small" href={file} target="_blank">
                    View Document
                  </Button>
                ) : (
                  <Text type="secondary">No file</Text>
                ),
              },
            ]}
            summary={(data) => {
              const total = data.reduce((sum, record) => sum + (record.cost || 0), 0)
              return (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <Text strong>Total Net Metering Expenses</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong style={{ color: '#cf1322' }}>₹{total.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} colSpan={3} />
                  </Table.Summary.Row>
                </Table.Summary>
              )
            }}
          />
        </Card>
      ) : (
        <Empty description="No net metering expenses recorded" />
      )}
    </div>
  )
}
