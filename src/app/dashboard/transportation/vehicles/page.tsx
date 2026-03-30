'use client'

import { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, Switch, message, Spin } from 'antd'
import { Car, Plus, Search, Phone, X, Users, User, ArrowRightLeft } from 'lucide-react'
import { vehicleService } from '@/services/transportation.service'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [detailItem, setDetailItem] = useState<any>(null)
  const [showAssign, setShowAssign] = useState<any>(null)
  const [assignForm] = Form.useForm()
  const [form] = Form.useForm()

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const data = await vehicleService.getAll()
      setVehicles(data)
    } catch { message.error('Failed to load vehicles') }
    finally { setLoading(false) }
  }

  const filtered = vehicles.filter(v => {
    if (filter === 'active' && !v.is_active) return false
    if (filter === 'inactive' && v.is_active) return false
    if (search) {
      const q = search.toLowerCase()
      return v.vehicle_number?.toLowerCase().includes(q) || v.driver_name?.toLowerCase().includes(q) || v.vehicle_type?.toLowerCase().includes(q) || v.vendor_name?.toLowerCase().includes(q)
    }
    return true
  })

  const openForm = (item?: any) => {
    setEditItem(item || null)
    if (item) {
      form.setFieldsValue(item)
    } else {
      form.resetFields()
      form.setFieldsValue({ is_active: true, owner_type: 'company' })
    }
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editItem?.id) {
        await vehicleService.update(editItem.id, values)
        message.success('Vehicle updated')
      } else {
        await vehicleService.create(values)
        message.success('Vehicle added')
      }
      setShowForm(false)
      load()
    } catch { message.error('Please fill required fields') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vehicle?')) return
    try {
      await vehicleService.delete(id)
      message.success('Deleted')
      setDetailItem(null)
      load()
    } catch { message.error('Failed to delete') }
  }

  const openAssign = (vehicle: any) => {
    setShowAssign(vehicle)
    assignForm.setFieldsValue({
      driver_name: vehicle.driver_name || '',
      driver_contact: vehicle.driver_contact || '',
    })
  }

  const handleAssign = async () => {
    try {
      const values = await assignForm.validateFields()
      await vehicleService.update(showAssign.id, values)
      message.success(showAssign.driver_name ? 'Driver reassigned' : 'Driver assigned')
      setShowAssign(null)
      setDetailItem(null)
      load()
    } catch { message.error('Please fill driver name') }
  }

  const handleUnassign = async (vehicleId: string) => {
    if (!confirm('Remove driver from this vehicle?')) return
    try {
      await vehicleService.update(vehicleId, { driver_name: null, driver_contact: null })
      message.success('Driver removed')
      setShowAssign(null)
      setDetailItem(null)
      load()
    } catch { message.error('Failed to remove driver') }
  }

  if (loading) return <div className="app-loading"><Spin /></div>

  return (
    <div className="app-page">
      {/* Search */}
      <div className="app-search">
        <Search size={16} color="#9ca3af" />
        <input placeholder="Search vehicles, owner..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Filter Chips */}
      <div className="filter-chips">
        {['all', 'active', 'inactive'].map(f => (
          <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? `All (${vehicles.length})` : f === 'active' ? `Active (${vehicles.filter(v=>v.is_active).length})` : `Inactive (${vehicles.filter(v=>!v.is_active).length})`}
          </button>
        ))}
      </div>

      {/* Vehicle List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Car size={28} /></div>
          <div className="empty-state-text">No vehicles found</div>
          <div className="empty-state-sub">Tap + to add a vehicle</div>
        </div>
      ) : (
        filtered.map(v => (
          <div key={v.id} className="list-card" onClick={() => setDetailItem(v)} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="list-card-icon" style={{ background: v.is_active ? '#ede9fe' : '#f3f4f6', color: v.is_active ? '#7c3aed' : '#9ca3af' }}>
                <Car size={20} />
              </div>
              <div className="list-card-body">
                <div className="list-card-title">{v.vehicle_number}</div>
                <div className="list-card-sub">{v.vehicle_type || 'N/A'} • {v.owner_type === 'vendor' ? 'Vendor' : 'Company'}</div>
              </div>
              <span className={`list-card-badge ${v.is_active ? 'badge-green' : 'badge-gray'}`}>
                {v.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--app-text-secondary)', paddingLeft: 52 }}>
              <span><User size={11} style={{ display: 'inline', verticalAlign: -1 }} /> Owner: {v.vendor_name || 'Company'}</span>
              <span><Users size={11} style={{ display: 'inline', verticalAlign: -1 }} /> {v.driver_name || 'No driver'}</span>
            </div>
          </div>
        ))
      )}

      {/* FAB */}
      <button className="fab" onClick={() => openForm()}>
        <Plus size={24} />
      </button>

      {/* Detail Bottom Sheet */}
      {detailItem && !showAssign && (
        <div className="more-overlay" onClick={() => setDetailItem(null)}>
          <div className="more-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '85dvh', overflowY: 'auto' }}>
            <div className="more-sheet-header">
              <span className="more-sheet-title">{detailItem.vehicle_number}</span>
              <button className="more-sheet-close" onClick={() => setDetailItem(null)}><X size={18} /></button>
            </div>
            <div style={{ padding: 16 }}>
              {/* Vehicle Info */}
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--app-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Vehicle Info</div>
              <div className="detail-row"><span className="detail-label">Type</span><span className="detail-value">{detailItem.vehicle_type || 'N/A'}</span></div>
              <div className="detail-row"><span className="detail-label">Status</span><span className={`list-card-badge ${detailItem.is_active ? 'badge-green' : 'badge-gray'}`}>{detailItem.is_active ? 'Active' : 'Inactive'}</span></div>

              {/* Owner Info */}
              <div className="app-divider" />
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--app-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Owner Info</div>
              <div className="detail-row"><span className="detail-label">Owner Type</span><span className={`list-card-badge ${detailItem.owner_type === 'vendor' ? 'badge-purple' : 'badge-blue'}`}>{detailItem.owner_type === 'vendor' ? 'Vendor' : 'Company'}</span></div>
              <div className="detail-row"><span className="detail-label">Owner Name</span><span className="detail-value">{detailItem.vendor_name || 'Company Owned'}</span></div>
              <div className="detail-row">
                <span className="detail-label">Owner Mobile</span>
                <span className="detail-value">
                  {detailItem.vendor_contact ? (
                    <a href={`tel:${detailItem.vendor_contact}`} style={{ color: 'var(--app-primary)', textDecoration: 'none' }}>{detailItem.vendor_contact}</a>
                  ) : 'N/A'}
                </span>
              </div>

              {/* Driver Info */}
              <div className="app-divider" />
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--app-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Driver Assignment</div>
              <div className="detail-row"><span className="detail-label">Driver</span><span className="detail-value">{detailItem.driver_name || 'Not assigned'}</span></div>
              <div className="detail-row"><span className="detail-label">Driver Contact</span>
                <span className="detail-value">{detailItem.driver_contact ? (
                  <a href={`tel:${detailItem.driver_contact}`} style={{ color: 'var(--app-primary)', textDecoration: 'none' }}>{detailItem.driver_contact}</a>
                ) : 'N/A'}</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button style={{ flex: 1, borderRadius: 10, minHeight: 40, background: '#dbeafe', border: 'none', color: '#2563eb', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }} onClick={() => openAssign(detailItem)}>
                  <ArrowRightLeft size={14} /> {detailItem.driver_name ? 'Reassign' : 'Assign'} Driver
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button style={{ flex: 1, borderRadius: 10, minHeight: 40, background: 'var(--app-primary)', border: 'none', color: '#fff', fontWeight: 500, cursor: 'pointer' }} onClick={() => { setDetailItem(null); openForm(detailItem) }}>Edit</button>
                <button style={{ flex: 1, borderRadius: 10, minHeight: 40, background: '#fee2e2', border: 'none', color: '#dc2626', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleDelete(detailItem.id)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign/Reassign Driver Sheet */}
      {showAssign && (
        <div className="more-overlay" onClick={() => setShowAssign(null)}>
          <div className="more-sheet" onClick={e => e.stopPropagation()}>
            <div className="more-sheet-header">
              <span className="more-sheet-title">{showAssign.driver_name ? 'Reassign' : 'Assign'} Driver — {showAssign.vehicle_number}</span>
              <button className="more-sheet-close" onClick={() => setShowAssign(null)}><X size={18} /></button>
            </div>
            <div style={{ padding: 16 }}>
              {showAssign.driver_name && (
                <div style={{ background: '#fef3c7', borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 12, color: '#92400e' }}>
                  Currently assigned: <strong>{showAssign.driver_name}</strong> ({showAssign.driver_contact || 'No contact'})
                </div>
              )}
              <Form form={assignForm} layout="vertical">
                <Form.Item name="driver_name" label="Driver Name" rules={[{ required: true, message: 'Enter driver name' }]}>
                  <Input placeholder="Full name" />
                </Form.Item>
                <Form.Item name="driver_contact" label="Driver Mobile">
                  <Input placeholder="Phone number" />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, borderRadius: 10, minHeight: 40, background: 'var(--app-primary)', border: 'none', color: '#fff', fontWeight: 500, cursor: 'pointer' }} onClick={handleAssign}>
                  {showAssign.driver_name ? 'Reassign' : 'Assign'}
                </button>
                {showAssign.driver_name && (
                  <button style={{ flex: 1, borderRadius: 10, minHeight: 40, background: '#fee2e2', border: 'none', color: '#dc2626', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleUnassign(showAssign.id)}>
                    Remove Driver
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={showForm} onCancel={() => setShowForm(false)} title={editItem ? 'Edit Vehicle' : 'Add Vehicle'} onOk={handleSave} okText="Save" forceRender>
        <Form form={form} layout="vertical">
          {/* Vehicle Details */}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', marginBottom: 8 }}>VEHICLE DETAILS</div>
          <Form.Item name="vehicle_number" label="Vehicle Number" rules={[{ required: true }]}>
            <Input placeholder="MH 12 AB 1234" />
          </Form.Item>
          <Form.Item name="vehicle_type" label="Vehicle Type">
            <Select placeholder="Select type" options={[
              { label: 'Truck', value: 'truck' },
              { label: 'Mini Truck', value: 'mini_truck' },
              { label: 'Pickup', value: 'pickup' },
              { label: 'Tempo', value: 'tempo' },
              { label: 'Container', value: 'container' },
              { label: 'Tata Ace', value: 'tata_ace' },
              { label: 'Other', value: 'other' },
            ]} />
          </Form.Item>
          {/* Owner Details */}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', margin: '12px 0 8px' }}>OWNER DETAILS</div>
          <Form.Item name="owner_type" label="Owner Type" rules={[{ required: true }]}>
            <Select options={[
              { label: 'Company Owned', value: 'company' },
              { label: 'Vendor / External', value: 'vendor' },
            ]} />
          </Form.Item>
          <Form.Item name="vendor_name" label="Owner Name">
            <Input placeholder="Owner full name" />
          </Form.Item>
          <Form.Item name="vendor_contact" label="Owner Mobile">
            <Input placeholder="Owner phone number" />
          </Form.Item>

          {/* Driver (optional in form, better via Assign) */}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', margin: '12px 0 8px' }}>DRIVER (optional — use Assign button)</div>
          <Form.Item name="driver_name" label="Driver Name">
            <Input placeholder="Driver name" />
          </Form.Item>
          <Form.Item name="driver_contact" label="Driver Contact">
            <Input placeholder="Phone number" />
          </Form.Item>

          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Any notes..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
