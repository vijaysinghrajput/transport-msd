'use client'

import { Modal, Form, Input, InputNumber, DatePicker, Select, Button, Space } from 'antd'
import type { FormInstance } from 'antd'
import StatusTag from './StatusTag'

const { TextArea } = Input

interface FormModalProps {
  title: string
  open: boolean
  onCancel: () => void
  onSubmit: (values: any) => void
  form: FormInstance
  loading?: boolean
  width?: number
  children?: React.ReactNode
}

export function FormModal({
  title,
  open,
  onCancel,
  onSubmit,
  form,
  loading,
  width = 480,
  children,
}: FormModalProps) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      width={width}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        size="small"
        style={{ marginTop: 16 }}
      >
        {children}
      </Form>
    </Modal>
  )
}

// Common form field components
export function AmountField({ name = 'amount', label = 'Amount (₹)', required = true }: { name?: string; label?: string; required?: boolean }) {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={required ? [{ required: true, message: 'Required' }] : undefined}
    >
      <InputNumber
        style={{ width: '100%' }}
        min={0}
        formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value?.replace(/₹\s?|(,*)/g, '') as any}
        placeholder="Enter amount"
      />
    </Form.Item>
  )
}

export function DateField({ name = 'date', label = 'Date', required = true }: { name?: string; label?: string; required?: boolean }) {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={required ? [{ required: true, message: 'Required' }] : undefined}
    >
      <DatePicker style={{ width: '100%' }} />
    </Form.Item>
  )
}

export function StatusField({ 
  name = 'status', 
  label = 'Status',
  statusOptions 
}: { 
  name?: string; 
  label?: string;
  statusOptions?: { label: string; value: string }[];
}) {
  const defaultOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'cancelled', label: 'Cancelled' },
  ]
  const options = statusOptions || defaultOptions
  
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required: true, message: 'Required' }]}
    >
      <Select placeholder="Select status">
        {options.map(opt => (
          <Select.Option key={opt.value} value={opt.value}>
            <StatusTag status={opt.value} size="small" />
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export function NotesField({ name = 'notes', label = 'Notes' }: { name?: string; label?: string }) {
  return (
    <Form.Item name={name} label={label}>
      <TextArea rows={2} placeholder="Optional notes..." />
    </Form.Item>
  )
}
