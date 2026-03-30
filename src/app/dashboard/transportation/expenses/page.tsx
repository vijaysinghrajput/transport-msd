'use client'

import { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, DatePicker, InputNumber, message, Spin } from 'antd'
import { Receipt, Plus, Search, X, Fuel, Wrench, Car } from 'lucide-react'
import { transportationExpenseService, vehicleService } from '@/services/transportation.service'
import dayjs from 'dayjs'

const EXPENSE_TYPES = [
  { label: 'Fuel', value: 'fuel' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Toll', value: 'toll' },
  { label: 'Driver Salary', value: 'driver_salary' },
  { label: 'Insurance', value: 'insurance' },
  { label: 'Parking', value: 'parking' },
  { label: 'Tyre', value: 'tyre' },
  { label: 'Repair', value: 'repair' },
  { label: 'Challan/Fine', value: 'challan' },
  { label: 'Other', value: 'other' },
]

const TYPE_ICON: Record<string, { bg: string; color: string }> = {
  fuel: { bg: '#fef3c7', color: '#d97706' },
  maintenance: { bg: '#ede9fe', color: '#7c3aed' },
  toll: { bg: '#dbeafe', color: '#2563eb' },
  driver_salary: { bg: '#d1fae5', color: '#059669' },
  insurance: { bg: '#fee2e2', color: '#dc2626' },
  repair: { bg: '#fee2e2', color: '#dc2626' },
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [detailItem, setDetailItem] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [form] = Form.useForm()

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const [data, v, st] = await Promise.all([
        transportationExpenseService.getAll(),
        vehicleService.getAll(),
        transportationExpenseService.getStats(),
      ])
      setExpenses(data)
      setVehicles(v)
      setStats(st)
    } catch { message.error('Failed to load expenses') }
    finally { setLoading(false) }
  }

  const filtered = expenses.filter(e => {
    if (typeFilter !== 'all' && e.expense_type !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return e.expense_number?.toLowerCase().includes(q) || e.vehicle_number?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q) || e.expense_type?.toLowerCase().includes(q)
    }
    return true
  })

  const openForm = (item?: any) => {
    setEditItem(item || null)
    if (item) {
      form.setFieldsValue({
        ...item,
        expense_date: item.expense_date ? dayjs(item.expense_date) : null,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ status: 'pending', expense_type: 'fuel' })
    }
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        ...values,
        expense_date: values.expense_date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
      }
      if (editItem?.id) {
        await transportationExpenseService.update(editItem.id, payload)
        message.success('Expense updated')
      } else {
        await transportationExpenseService.create(payload)
        message.success('Expense added')
      }
      setShowForm(false)
      load()
    } catch { message.error('Please fill required fields') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return
    try {
      await transportationExpenseService.delete(id)
      message.success('Deleted')
      setDetailItem(null)
      load()
    } catch { message.error('Failed to delete') }
  }

  if (loading) return <div className="app-loading"><Spin /></div>

  return (
    <div className="app-page">
      {/* Stats */}
      {stats && (
        <div className="stat-grid">
          <div className="stat-box">
            <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}><Receipt size={18} /></div>
            <div><div className="stat-value">₹{((stats.total || 0) / 1000).toFixed(0)}k</div><div className="stat-label">Total</div></div>
          </div>
          <div className="stat-box">
            <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><Receipt size={18} /></div>
            <div><div className="stat-value">{stats.count || 0}</div><div className="stat-label">Records</div></div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="app-search">
        <Search size={16} color="#9ca3af" />
        <input placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Filter Chips */}
      <div className="filter-chips">
        <button className={`filter-chip ${typeFilter === 'all' ? 'active' : ''}`} onClick={() => setTypeFilter('all')}>All</button>
        {EXPENSE_TYPES.slice(0, 5).map(t => (
          <button key={t.value} className={`filter-chip ${typeFilter === t.value ? 'active' : ''}`} onClick={() => setTypeFilter(t.value)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Receipt size={28} /></div>
          <div className="empty-state-text">No expenses found</div>
          <div className="empty-state-sub">Tap + to add an expense</div>
        </div>
      ) : (
        filtered.map(e => {
          const ti = TYPE_ICON[e.expense_type] || { bg: '#f3f4f6', color: '#6b7280' }
          return (
            <div key={e.id} className="list-card" onClick={() => setDetailItem(e)}>
              <div className="list-card-icon" style={{ background: ti.bg, color: ti.color }}>
                {e.expense_type === 'fuel' ? <Fuel size={20} /> : e.expense_type === 'maintenance' || e.expense_type === 'repair' ? <Wrench size={20} /> : <Receipt size={20} />}
              </div>
              <div className="list-card-body">
                <div className="list-card-title">{e.expense_type?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Expense'}</div>
                <div className="list-card-sub">{e.vehicle_number || 'No vehicle'} • {e.expense_date ? dayjs(e.expense_date).format('DD MMM') : ''}</div>
              </div>
              <div className="list-card-right">
                <div className="list-card-amount">₹{(Number(e.amount) || 0).toLocaleString('en-IN')}</div>
                <span className={`list-card-badge ${e.status === 'approved' ? 'badge-green' : e.status === 'pending' ? 'badge-yellow' : 'badge-gray'}`}>
                  {e.status || 'pending'}
                </span>
              </div>
            </div>
          )
        })
      )}

      {/* FAB */}
      <button className="fab" onClick={() => openForm()}>
        <Plus size={24} />
      </button>

      {/* Detail Sheet */}
      {detailItem && (
        <div className="more-overlay" onClick={() => setDetailItem(null)}>
          <div className="more-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '80dvh', overflowY: 'auto' }}>
            <div className="more-sheet-header">
              <span className="more-sheet-title">{detailItem.expense_number || 'Expense'}</span>
              <button className="more-sheet-close" onClick={() => setDetailItem(null)}><X size={18} /></button>
            </div>
            <div style={{ padding: 16 }}>
              <div className="detail-row"><span className="detail-label">Type</span><span className="detail-value">{detailItem.expense_type?.replace(/_/g, ' ')}</span></div>
              <div className="detail-row"><span className="detail-label">Amount</span><span className="detail-value" style={{ fontWeight: 700 }}>₹{(Number(detailItem.amount) || 0).toLocaleString('en-IN')}</span></div>
              <div className="detail-row"><span className="detail-label">Vehicle</span><span className="detail-value">{detailItem.vehicle_number || 'N/A'}</span></div>
              <div className="detail-row"><span className="detail-label">Date</span><span className="detail-value">{detailItem.expense_date ? dayjs(detailItem.expense_date).format('DD MMM YYYY') : 'N/A'}</span></div>
              <div className="detail-row"><span className="detail-label">Status</span><span className={`list-card-badge ${detailItem.status === 'approved' ? 'badge-green' : 'badge-yellow'}`}>{detailItem.status || 'pending'}</span></div>
              {detailItem.description && <div className="detail-row"><span className="detail-label">Description</span><span className="detail-value">{detailItem.description}</span></div>}
              {detailItem.receipt_url && <div className="detail-row"><span className="detail-label">Receipt</span><span className="detail-value"><a href={detailItem.receipt_url} target="_blank" rel="noreferrer" style={{ color: 'var(--app-primary)' }}>View</a></span></div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button style={{ flex: 1, borderRadius: 10, minHeight: 40, background: 'var(--app-primary)', border: 'none', color: '#fff', fontWeight: 500, cursor: 'pointer' }} onClick={() => { setDetailItem(null); openForm(detailItem) }}>Edit</button>
                <button style={{ flex: 1, borderRadius: 10, minHeight: 40, background: '#fee2e2', border: 'none', color: '#dc2626', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleDelete(detailItem.id)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={showForm} onCancel={() => setShowForm(false)} title={editItem ? 'Edit Expense' : 'Add Expense'} onOk={handleSave} okText="Save" destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="expense_type" label="Expense Type" rules={[{ required: true }]}>
            <Select options={EXPENSE_TYPES} />
          </Form.Item>
          <Form.Item name="amount" label="Amount (₹)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
          </Form.Item>
          <Form.Item name="vehicle_id" label="Vehicle">
            <Select placeholder="Select vehicle" allowClear showSearch optionFilterProp="label"
              options={vehicles.map(v => ({ label: `${v.vehicle_number} - ${v.driver_name || 'No driver'}`, value: v.id }))} />
          </Form.Item>
          <Form.Item name="vehicle_number" label="Vehicle Number">
            <Input placeholder="MH 12 AB 1234" />
          </Form.Item>
          <Form.Item name="expense_date" label="Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select options={[
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
            ]} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Describe the expense..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
