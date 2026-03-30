'use client'

import React from 'react'
import { Card, Table, Tag, Empty, Typography } from 'antd'
import dayjs from 'dayjs'
import { ComprehensiveLead } from '@/types/comprehensive-lead'

const { Text } = Typography

interface BankExpensesTabProps {
  lead: ComprehensiveLead
}

export default function BankExpensesTab({ lead }: BankExpensesTabProps) {
  const bankCosts = lead.bank_approval_costs || []

  // Create a data structure for the table with all expense types
  const tableData = bankCosts.flatMap((bc) => [
    {
      id: `${bc.id}-margin`,
      bank_name: bc.bank_name,
      type: 'Margin Money',
      cost: bc.margin_money || 0,
      status: bc.margin_money_status || 'pending',
      payment_date: bc.payment_date,
      notes: bc.notes,
    },
    {
      id: `${bc.id}-expense`,
      bank_name: bc.bank_name,
      type: 'Bank Expense',
      cost: bc.bank_expense || 0,
      status: bc.bank_expense_status || 'pending',
      payment_date: bc.payment_date,
      notes: bc.notes,
    },
    {
      id: `${bc.id}-visiting`,
      bank_name: bc.bank_name,
      type: 'Visiting Charge',
      cost: bc.visiting_charge || 0,
      status: bc.visiting_charge_status || 'pending',
      payment_date: bc.payment_date,
      notes: bc.notes,
    },
  ])

  return (
    <div>
      {tableData.length > 0 ? (
        <Card title="Bank Approval & Processing Expenses">
          <Table
            dataSource={tableData}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: 'Bank Name',
                dataIndex: 'bank_name',
                key: 'bank_name',
                width: '20%',
                render: (name) => <Text strong>{name || 'N/A'}</Text>,
              },
              {
                title: 'Expense Type',
                dataIndex: 'type',
                key: 'type',
                width: '20%',
              },
              {
                title: 'Amount',
                dataIndex: 'cost',
                key: 'cost',
                width: '15%',
                render: (cost) => <Text strong>₹{cost.toLocaleString()}</Text>,
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
                    cancelled: 'default',
                  }
                  return <Tag color={colors[status] || 'default'}>{status}</Tag>
                },
              },
              {
                title: 'Payment Date',
                dataIndex: 'payment_date',
                key: 'payment_date',
                width: '15%',
                render: (date) => date ? dayjs(date).format('DD MMM YYYY') : '-',
              },
              {
                title: 'Notes',
                dataIndex: 'notes',
                key: 'notes',
                width: '15%',
                ellipsis: true,
                render: (notes) => notes || '-',
              },
            ]}
            summary={(data) => {
              const total = data.reduce((sum, record) => sum + (record.cost || 0), 0)
              const marginTotal = data.filter(d => d.type === 'Margin Money').reduce((sum, record) => sum + (record.cost || 0), 0)
              const expenseTotal = data.filter(d => d.type === 'Bank Expense').reduce((sum, record) => sum + (record.cost || 0), 0)
              const visitingTotal = data.filter(d => d.type === 'Visiting Charge').reduce((sum, record) => sum + (record.cost || 0), 0)
              
              return (
                <>
                  <Table.Summary.Row style={{ background: '#fafafa' }}>
                    <Table.Summary.Cell index={0}>
                      <Text strong>Subtotals by Type:</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text>Margin: ₹{marginTotal.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text>Expense: ₹{expenseTotal.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text>Visiting: ₹{visitingTotal.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} colSpan={2} />
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2}>
                      <Text strong>Total Bank Expenses</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong style={{ color: '#cf1322', fontSize: '16px' }}>₹{total.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} colSpan={3} />
                  </Table.Summary.Row>
                </>
              )
            }}
          />
        </Card>
      ) : (
        <Empty description="No bank expenses recorded" />
      )}
    </div>
  )
}
