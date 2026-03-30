'use client'

import React from 'react'
import { Card, Table, Tag, Empty, Typography } from 'antd'
import dayjs from 'dayjs'
import { ComprehensiveLead } from '@/types/comprehensive-lead'

const { Text } = Typography

interface InstallationExpensesTabProps {
  lead: ComprehensiveLead
}

export default function InstallationExpensesTab({ lead }: InstallationExpensesTabProps) {
  const installations = lead.installations || []

  return (
    <div>
      {installations.length > 0 ? (
        <Card title="Installation Expenses">
          <Table
            dataSource={installations}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: 'Installation Date',
                dataIndex: 'installation_date',
                key: 'installation_date',
                render: (date) => date ? dayjs(date).format('DD MMM YYYY') : '-',
              },
              {
                title: 'Completion Date',
                dataIndex: 'completion_date',
                key: 'completion_date',
                render: (date) => date ? dayjs(date).format('DD MMM YYYY') : '-',
              },
              {
                title: 'Address',
                dataIndex: 'installation_address',
                key: 'installation_address',
                ellipsis: true,
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status) => <Tag color="blue">{status}</Tag>,
              },
              {
                title: 'Installation Cost',
                dataIndex: 'installation_cost',
                key: 'installation_cost',
                render: (cost) => <Text>₹{(cost || 0).toLocaleString()}</Text>,
              },
              {
                title: 'Raw Materials',
                dataIndex: 'raw_materials_cost',
                key: 'raw_materials_cost',
                render: (cost) => <Text>₹{(cost || 0).toLocaleString()}</Text>,
              },
              {
                title: 'Total Cost',
                dataIndex: 'total_installation_cost',
                key: 'total_installation_cost',
                render: (cost) => <Text strong>₹{(cost || 0).toLocaleString()}</Text>,
              },
            ]}
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ margin: 0 }}>
                  {record.installation_notes && (
                    <div>
                      <Text strong>Notes:</Text> <Text>{record.installation_notes}</Text>
                    </div>
                  )}
                </div>
              ),
              rowExpandable: (record) => !!record.installation_notes,
            }}
            summary={(data) => {
              const totalInstallation = data.reduce((sum, record) => sum + (record.installation_cost || 0), 0)
              const totalMaterials = data.reduce((sum, record) => sum + (record.raw_materials_cost || 0), 0)
              const grandTotal = data.reduce((sum, record) => sum + (record.total_installation_cost || 0), 0)
              return (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <Text strong>Total Installation Expenses</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>₹{totalInstallation.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text strong>₹{totalMaterials.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text strong style={{ color: '#cf1322' }}>₹{grandTotal.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )
            }}
          />
        </Card>
      ) : (
        <Empty description="No installation data available" />
      )}
    </div>
  )
}
