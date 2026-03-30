'use client'

import { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, message, Spin } from 'antd'
import { Route, Search, Plus, X, Package, Hash } from 'lucide-react'
import { tripMaterialService } from '@/services/transportation.service'
import dayjs from 'dayjs'

export default function TripMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [detailItem, setDetailItem] = useState<any>(null)
  const [form] = Form.useForm()

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const data = await tripMaterialService.getAll()
      setMaterials(data)
    } catch { message.error('Failed to load materials') }
    finally { setLoading(false) }
  }

  const filtered = materials.filter(m => {
    if (!search) return true
    const q = search.toLowerCase()
    return m.material_name?.toLowerCase().includes(q) || m.material_type?.toLowerCase().includes(q) || m.trip_id?.toLowerCase().includes(q)
  })

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      await tripMaterialService.create(values)
      message.success('Material added')
      setShowForm(false)
      load()
    } catch { message.error('Please fill required fields') }
  }

  if (loading) return <div className="app-loading"><Spin /></div>

  return (
    <div className="app-page">
      {/* Search */}
      <div className="app-search">
        <Search size={16} color="#9ca3af" />
        <input placeholder="Search materials..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Count */}
      <div style={{ fontSize: 12, color: 'var(--app-text-secondary)', padding: '4px 0 8px' }}>
        {filtered.length} material{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Route size={28} /></div>
          <div className="empty-state-text">No trip materials</div>
          <div className="empty-state-sub">Tap + to add materials</div>
        </div>
      ) : (
        filtered.map(m => (
          <div key={m.id} className="list-card" onClick={() => setDetailItem(m)}>
            <div className="list-card-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
              <Package size={20} />
            </div>
            <div className="list-card-body">
              <div className="list-card-title">{m.material_name || 'Material'}</div>
              <div className="list-card-sub">{m.material_type || 'N/A'} • Qty: {m.quantity || 0} {m.unit || ''}</div>
            </div>
            <div className="list-card-right">
              <div className="list-card-amount">₹{(m.total_value || 0).toLocaleString('en-IN')}</div>
              <div style={{ fontSize: 10, color: 'var(--app-text-secondary)' }}>{m.created_at ? dayjs(m.created_at).format('DD MMM') : ''}</div>
            </div>
          </div>
        ))
      )}

      {/* FAB */}
      <button className="fab" onClick={() => { form.resetFields(); setShowForm(true) }}>
        <Plus size={24} />
      </button>

      {/* Detail Sheet */}
      {detailItem && (
        <div className="more-overlay" onClick={() => setDetailItem(null)}>
          <div className="more-sheet" onClick={e => e.stopPropagation()}>
            <div className="more-sheet-header">
              <span className="more-sheet-title">{detailItem.material_name || 'Material'}</span>
              <button className="more-sheet-close" onClick={() => setDetailItem(null)}><X size={18} /></button>
            </div>
            <div style={{ padding: 16 }}>
              <div className="detail-row"><span className="detail-label">Type</span><span className="detail-value">{detailItem.material_type || 'N/A'}</span></div>
              <div className="detail-row"><span className="detail-label">Quantity</span><span className="detail-value">{detailItem.quantity || 0} {detailItem.unit || ''}</span></div>
              <div className="detail-row"><span className="detail-label">Unit Price</span><span className="detail-value">₹{(detailItem.unit_price || 0).toLocaleString('en-IN')}</span></div>
              <div className="detail-row"><span className="detail-label">Total Value</span><span className="detail-value" style={{ fontWeight: 700 }}>₹{(detailItem.total_value || 0).toLocaleString('en-IN')}</span></div>
              <div className="detail-row"><span className="detail-label">Trip ID</span><span className="detail-value">{detailItem.trip_id || 'N/A'}</span></div>
              <div className="detail-row"><span className="detail-label">Added</span><span className="detail-value">{detailItem.created_at ? dayjs(detailItem.created_at).format('DD MMM YYYY') : 'N/A'}</span></div>
              {detailItem.notes && <div className="detail-row"><span className="detail-label">Notes</span><span className="detail-value">{detailItem.notes}</span></div>}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal open={showForm} onCancel={() => setShowForm(false)} title="Add Material" onOk={handleSave} okText="Save" destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="material_name" label="Material Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Solar Panel 540W" />
          </Form.Item>
          <Form.Item name="material_type" label="Material Type">
            <Input placeholder="e.g. Panel, Inverter, Wire" />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
          </Form.Item>
          <Form.Item name="unit" label="Unit">
            <Input placeholder="e.g. pcs, kg, meters" />
          </Form.Item>
          <Form.Item name="unit_price" label="Unit Price (₹)">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
          </Form.Item>
          <Form.Item name="total_value" label="Total Value (₹)">
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
          </Form.Item>
          <Form.Item name="trip_id" label="Trip/Shipment ID">
            <Input placeholder="Trip ID" />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Any notes..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
