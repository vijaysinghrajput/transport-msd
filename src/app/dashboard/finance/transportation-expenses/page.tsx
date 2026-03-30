'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Modal, Form, Input, DatePicker, Select, Tag, Row, Col, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, CarOutlined } from '@ant-design/icons'
import { transportationExpenseService } from '@/services/operations-finance.service'
import { TransportationExpense } from '@/types/operations-finance.types'
import { useState } from 'react'
import FinanceGuard from '@/components/FinanceGuard'
import { PageHeader, StatCard, StatusTag, Amount, DataTable, FormModal, AmountField, DateField, StatusField } from '@/components/finance'
import dayjs from 'dayjs'

export default function TransportationExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<TransportationExpense | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data: expenses, isLoading, refetch } = useQuery({
    queryKey: ['transportation-expenses'],
    queryFn: () => transportationExpenseService.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      selectedExpense ? transportationExpenseService.update(selectedExpense.id, data) : transportationExpenseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportation-expenses'] })
      setIsModalOpen(false)
      form.resetFields()
      setSelectedExpense(null)
      message.success(selectedExpense ? 'Updated' : 'Created')
    },
    onError: () => message.error('Failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transportationExpenseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportation-expenses'] })
      message.success('Deleted')
    },
  })

  const total = expenses?.reduce((s, e) => s + e.amount, 0) || 0
  const pending = expenses?.filter(e => e.payment_status === 'pending').reduce((s, e) => s + e.amount, 0) || 0
  const fuel = expenses?.filter(e => e.expense_type === 'fuel').reduce((s, e) => s + e.amount, 0) || 0

  const columns = [
    {
      title: 'Vehicle',
      key: 'vehicle',
      render: (_: any, r: TransportationExpense) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CarOutlined style={{ fontSize: 16, color: '#8c8c8c' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{r.vehicle_number}</div>
            <Tag style={{ margin: 0, fontSize: 11 }}>{r.vehicle_type}</Tag>
          </div>
        </div>
      ),
    },
    { title: 'Type', dataIndex: 'expense_type', width: 100, render: (t: string) => <Tag color="cyan" style={{ margin: 0 }}>{t}</Tag> },
    { title: 'Amount', width: 100, render: (_: any, r: TransportationExpense) => <Amount value={r.amount} /> },
    { title: 'Status', width: 90, render: (_: any, r: TransportationExpense) => <StatusTag status={r.payment_status} size="small" /> },
    { title: 'Date', width: 100, render: (_: any, r: TransportationExpense) => dayjs(r.expense_date).format('DD MMM YY') },
    { title: 'Driver', dataIndex: 'driver_name', width: 100, ellipsis: true },
    {
      title: '',
      width: 80,
      render: (_: any, r: TransportationExpense) => (
        <Button.Group size="small">
          <Button icon={<EditOutlined />} onClick={() => { setSelectedExpense(r); form.setFieldsValue({ ...r, expense_date: dayjs(r.expense_date) }); setIsModalOpen(true) }} />
          <Button icon={<DeleteOutlined />} danger onClick={() => Modal.confirm({ title: 'Delete?', okType: 'danger', onOk: () => deleteMutation.mutate(r.id) })} />
        </Button.Group>
      ),
    },
  ]

  return (
    <FinanceGuard>
      <div style={{ padding: '16px 20px' }}>
        <PageHeader
          title="Transportation Expenses"
          subtitle="Track vehicle fuel, maintenance, and transport costs"
          icon={<CarOutlined />}
          breadcrumbs={[{ label: 'Finance', href: '/dashboard/finance-operations' }, { label: 'Transportation' }]}
          actions={<Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedExpense(null); form.resetFields(); setIsModalOpen(true) }}>Add Expense</Button>}
        />

        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={8} sm={6}><StatCard title="Total" value={total} prefix="₹" icon={<CarOutlined />} color="#1890ff" compact /></Col>
          <Col xs={8} sm={6}><StatCard title="Fuel" value={fuel} prefix="₹" icon={<CarOutlined />} color="#52c41a" compact /></Col>
          <Col xs={8} sm={6}><StatCard title="Pending" value={pending} prefix="₹" icon={<CarOutlined />} color="#faad14" compact /></Col>
        </Row>

        <DataTable title="Transportation Expenses" dataSource={expenses} columns={columns} loading={isLoading} rowKey="id" onRefresh={() => refetch()} />

        <FormModal
          title={selectedExpense ? 'Edit Expense' : 'Add Transport Expense'}
          open={isModalOpen}
          onCancel={() => { setIsModalOpen(false); form.resetFields(); setSelectedExpense(null) }}
          onSubmit={(values) => createMutation.mutate(values)}
          form={form}
          loading={createMutation.isPending}
        >
          <Form.Item label="Vehicle No." name="vehicle_number" rules={[{ required: true }]}><Input placeholder="MH12AB1234" /></Form.Item>
          <Form.Item label="Vehicle Type" name="vehicle_type" rules={[{ required: true }]}>
            <Select options={[{ label: 'Truck', value: 'truck' }, { label: 'Van', value: 'van' }, { label: 'Car', value: 'car' }, { label: 'Bike', value: 'bike' }, { label: 'Auto', value: 'auto' }]} />
          </Form.Item>
          <Form.Item label="Expense Type" name="expense_type" rules={[{ required: true }]}>
            <Select options={[{ label: 'Fuel', value: 'fuel' }, { label: 'Maintenance', value: 'maintenance' }, { label: 'Toll', value: 'toll' }, { label: 'Insurance', value: 'insurance' }, { label: 'Repair', value: 'repair' }, { label: 'Parking', value: 'parking' }, { label: 'Other', value: 'other' }]} />
          </Form.Item>
          <AmountField />
          <StatusField name="payment_status" label="Status" />
          <DateField name="expense_date" label="Expense Date" />
          <Form.Item label="Driver" name="driver_name"><Input placeholder="Driver name" /></Form.Item>
        </FormModal>
      </div>
    </FinanceGuard>
  )
}
