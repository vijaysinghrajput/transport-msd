'use client'

import { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, message, Spin } from 'antd'
import { Users, Plus, Search, Phone, X, ArrowRightLeft, Car } from 'lucide-react'
import { vehicleService } from '@/services/transportation.service'

export default function DriversPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('assigned')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [detailItem, setDetailItem] = useState<any>(null)
  const [showReassign, setShowReassign] = useState<any>(null)
  const [form] = Form.useForm()
  const [reassignForm] = Form.useForm()

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const data = await vehicleService.getAll()
      setVehicles(data)
    } catch { message.error('Failed to load drivers') }
    finally { setLoading(false) }
  }

  // Drivers from vehicles that have driver_name
  const drivers = vehicles
    .filter(v => v.driver_name)
    .map(v => ({
      vehicleId: v.id,
      name: v.driver_name,
      contact: v.driver_contact,
      vehicleNumber: v.vehicle_number,
      vehicleType: v.vehicle_type,
      isActive: v.is_active,
      ownerName: v.vendor_name,
      ownerType: v.owner_type,
    }))

  // Vehicles without a driver
  const unassignedVehicles = vehicles.filter(v => !v.driver_name && v.is_active)

  const filtered = filter === 'unassigned' ? unassignedVehicles : drivers.filter(d => {
    if (!search) return true
    const q = search.toLowerCase()
    return d.name?.toLowerCase().includes(q) || d.contact?.includes(q) || d.vehicleNumber?.toLowerCase().includes(q)
  })

  const openForm = (item?: any) => {
    setEditItem(item || null)
    if (item) {
      form.setFieldsValue({
        driver_name: item.name,
        driver_contact: item.contact,
      })
    } else {
      form.resetFields()
    }
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editItem?.vehicleId) {
        await vehicleService.update(editItem.vehicleId, values)
        message.success('Driver updated')
      } else {
        message.info('To add a driver, go to Vehicles → select a vehicle → Assign Driver')
        setShowForm(false)
        return
      }
      setShowForm(false)
      setDetailItem(null)
      load()
    } catch { message.error('Please fill required fields') }
  }

  const openReassign = (driver: any) => {
    setShowReassign(driver)
    reassignForm.setFieldsValue({ target_vehicle_id: undefined })
  }

  const handleReassign = async () => {
    try {
      const { target_vehicle_id } = await reassignForm.validateFields()
      if (!target_vehicle_id) { message.warning('Select a vehicle'); return }

      // Get current driver info
      const driverInfo = {
        driver_name: showReassign.name,
        driver_contact: showReassign.contact,
      }

      // Remove driver from old vehicle
      await vehicleService.update(showReassign.vehicleId, {
        driver_name: null,
        driver_contact: null,
      })
      // Assign to new vehicle
      await vehicleService.update(target_vehicle_id, driverInfo)

      message.success(`Driver reassigned successfully`)
      setShowReassign(null)
      setDetailItem(null)
      load()
    } catch { message.error('Failed to reassign') }
  }

  const handleUnassign = async (vehicleId: string) => {
    if (!confirm('Remove this driver from vehicle?')) return
    try {
      await vehicleService.update(vehicleId, {
        driver_name: null,
        driver_contact: null,
      })
      message.success('Driver removed from vehicle')
      setDetailItem(null)
      load()
    } catch { message.error('Failed to remove') }
  }

  if (loading) return <div className="app-loading"><Spin /></div>

  return (
    <div className="app-page">
      {/* Search */}
      <div className="app-search">
        <Search size={16} color="#9ca3af" />
        <input placeholder="Search drivers..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Filter Chips */}
      <div className="filter-chips">
        <button className={`filter-chip ${filter === 'assigned' ? 'active' : ''}`} onClick={() => setFilter('assigned')}>
          Assigned ({drivers.length})
        </button>
        <button className={`filter-chip ${filter === 'unassigned' ? 'active' : ''}`} onClick={() => setFilter('unassigned')}>
          No Driver ({unassignedVehicles.length})
        </button>
      </div>

      {/* Assigned Drivers List */}
      {filter === 'assigned' && (
        <>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Users size={28} /></div>
              <div className="empty-state-text">No drivers found</div>
              <div className="empty-state-sub">Assign drivers via Vehicle page</div>
            </div>
          ) : (
            (filtered as typeof drivers).map((d, i) => (
              <div key={i} className="list-card" onClick={() => setDetailItem(d)} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="list-card-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
                    <Users size={20} />
                  </div>
                  <div className="list-card-body">
                    <div className="list-card-title">{d.name}</div>
                    <div className="list-card-sub">{d.contact || 'No contact'}</div>
                  </div>
                  {d.contact && (
                    <a href={`tel:${d.contact}`} onClick={e => e.stopPropagation()} style={{ color: 'var(--app-primary)' }}>
                      <Phone size={18} />
                    </a>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--app-text-secondary)', paddingLeft: 52 }}>
                  <span><Car size={11} style={{ display: 'inline', verticalAlign: -1 }} /> {d.vehicleNumber}</span>
                  <span>{d.vehicleType || 'N/A'}</span>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* Unassigned Vehicles List */}
      {filter === 'unassigned' && (
        <>
          {unassignedVehicles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Car size={28} /></div>
              <div className="empty-state-text">All vehicles have drivers</div>
            </div>
          ) : (
            unassignedVehicles.map(v => (
              <div key={v.id} className="list-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="list-card-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                    <Car size={20} />
                  </div>
                  <div className="list-card-body">
                    <div className="list-card-title">{v.vehicle_number}</div>
                    <div className="list-card-sub">{v.vehicle_type || 'N/A'} • No driver assigned</div>
                  </div>
                  <span className="list-card-badge badge-yellow">Needs Driver</span>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* FAB */}
      <button className="fab" onClick={() => openForm()}>
        <Plus size={24} />
      </button>

      {/* Detail Sheet */}
      {detailItem && !showReassign && (
        <div className="more-overlay" onClick={() => setDetailItem(null)}>
          <div className="more-sheet" onClick={e => e.stopPropagation()}>
            <div className="more-sheet-header">
              <span className="more-sheet-title">{detailItem.name}</span>
              <button className="more-sheet-close" onClick={() => setDetailItem(null)}><X size={18} /></button>
            </div>
            <div style={{ padding: 16 }}>
              <div className="detail-row">
                <span className="detail-label">Phone</span>
                <span className="detail-value">
                  {detailItem.contact ? (
                    <a href={`tel:${detailItem.contact}`} style={{ color: 'var(--app-primary)', textDecoration: 'none' }}>{detailItem.contact}</a>
                  ) : 'N/A'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Vehicle</span>
                <span className="detail-value">{detailItem.vehicleNumber}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Vehicle Type</span>
                <span className="detail-value">{detailItem.vehicleType || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Owner</span>
                <span className="detail-value">{detailItem.ownerName || 'Company'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`list-card-badge ${detailItem.isActive ? 'badge-green' : 'badge-gray'}`}>
                  {detailItem.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button style={{ flex: 1, borderRadius: 10, minHeight: 40, background: '#dbeafe', border: 'none', color: '#2563eb', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }} onClick={() => openReassign(detailItem)}>
                  <ArrowRightLeft size={14} /> Reassign
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button style={{ flex: 1, borderRadius: 10, minHeight: 40, background: 'var(--app-primary)', border: 'none', color: '#fff', fontWeight: 500, cursor: 'pointer' }} onClick={() => { setDetailItem(null); openForm(detailItem) }}>Edit Driver</button>
                {detailItem.contact && (
                  <a href={`tel:${detailItem.contact}`} style={{ flex: 1, borderRadius: 10, minHeight: 40, background: '#dbeafe', border: 'none', color: '#2563eb', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    <Phone size={16} style={{ marginRight: 6 }} /> Call
                  </a>
                )}
              </div>
              <button style={{ width: '100%', borderRadius: 10, minHeight: 40, background: '#fee2e2', border: 'none', color: '#dc2626', fontWeight: 500, cursor: 'pointer', marginTop: 8 }} onClick={() => handleUnassign(detailItem.vehicleId)}>
                Remove from Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Sheet */}
      {showReassign && (
        <div className="more-overlay" onClick={() => setShowReassign(null)}>
          <div className="more-sheet" onClick={e => e.stopPropagation()}>
            <div className="more-sheet-header">
              <span className="more-sheet-title">Reassign {showReassign.name}</span>
              <button className="more-sheet-close" onClick={() => setShowReassign(null)}><X size={18} /></button>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ background: '#dbeafe', borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 12, color: '#1e40af' }}>
                Currently on: <strong>{showReassign.vehicleNumber}</strong>
              </div>
              <Form form={reassignForm} layout="vertical">
                <Form.Item name="target_vehicle_id" label="Move to Vehicle" rules={[{ required: true, message: 'Select target vehicle' }]}>
                  <Select placeholder="Select vehicle" showSearch optionFilterProp="label"
                    options={vehicles.filter(v => v.id !== showReassign.vehicleId && v.is_active).map(v => ({
                      label: `${v.vehicle_number} ${v.driver_name ? `(has: ${v.driver_name})` : '(no driver)'}`,
                      value: v.id,
                    }))}
                  />
                </Form.Item>
              </Form>
              <div style={{ fontSize: 11, color: 'var(--app-text-secondary)', marginBottom: 12 }}>
                If the target vehicle has a driver, that driver will be replaced.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, borderRadius: 10, minHeight: 40, background: 'var(--app-primary)', border: 'none', color: '#fff', fontWeight: 500, cursor: 'pointer' }} onClick={handleReassign}>
                  Reassign Driver
                </button>
                <button style={{ flex: 1, borderRadius: 10, minHeight: 40, background: '#f3f4f6', border: 'none', color: 'var(--app-text-secondary)', fontWeight: 500, cursor: 'pointer' }} onClick={() => setShowReassign(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={showForm} onCancel={() => setShowForm(false)} title={editItem ? 'Edit Driver' : 'Add Driver'} onOk={handleSave} okText="Save" destroyOnHidden>
        <Form form={form} layout="vertical">
          <Form.Item name="driver_name" label="Driver Name" rules={[{ required: true }]}>
            <Input placeholder="Full name" />
          </Form.Item>
          <Form.Item name="driver_contact" label="Contact Number">
            <Input placeholder="Phone number" />
          </Form.Item>
        </Form>
        {!editItem && (
          <div style={{ padding: '8px 0', fontSize: 12, color: 'var(--app-text-secondary)' }}>
            Tip: Go to Vehicles → select a vehicle → Assign Driver to add a new driver.
          </div>
        )}
      </Modal>
    </div>
  )
}
