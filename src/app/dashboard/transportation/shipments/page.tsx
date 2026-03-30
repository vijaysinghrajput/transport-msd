'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Modal, Form, Input, Select, DatePicker, InputNumber, message, Spin, Upload } from 'antd'
import { Package, Plus, Search, X, MapPin, Car, Camera, Gauge, IndianRupee, User, Phone, Zap, Building2, Image as ImageIcon } from 'lucide-react'
import { shipmentService } from '@/services/transportation.service'
import dayjs from 'dayjs'

const STATUS_CONFIG: Record<string, { badge: string; label: string }> = {
  scheduled: { badge: 'badge-yellow', label: 'Scheduled' },
  in_transit: { badge: 'badge-blue', label: 'In Transit' },
  delivered: { badge: 'badge-green', label: 'Delivered' },
  completed: { badge: 'badge-green', label: 'Completed' },
  cancelled: { badge: 'badge-red', label: 'Cancelled' },
}

const PAYMENT_CONFIG: Record<string, { badge: string; label: string }> = {
  paid: { badge: 'badge-green', label: 'Paid' },
  pending: { badge: 'badge-yellow', label: 'Pending' },
  partial: { badge: 'badge-blue', label: 'Partial' },
}

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [detailItem, setDetailItem] = useState<any>(null)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [startingMeterImg, setStartingMeterImg] = useState<string | null>(null)
  const [closingMeterImg, setClosingMeterImg] = useState<string | null>(null)
  const [uploadingStart, setUploadingStart] = useState(false)
  const [uploadingClose, setUploadingClose] = useState(false)
  const [form] = Form.useForm()

  /** Convert stored R2 key (or legacy URL) to displayable image URL */
  const getImageUrl = (keyOrUrl: string | null) => {
    if (!keyOrUrl) return ''
    if (keyOrUrl.startsWith('http')) return keyOrUrl
    return `/api/upload?key=${encodeURIComponent(keyOrUrl)}&redirect=true`
  }

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const [data, v, l] = await Promise.all([
        shipmentService.getAll(),
        shipmentService.getVehicles(),
        shipmentService.getLeadsForDelivery(),
      ])
      setTrips(data)
      setVehicles(v)
      setLeads(l)
    } catch { message.error('Failed to load trips') }
    finally { setLoading(false) }
  }

  const filtered = trips.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return s.shipment_number?.toLowerCase().includes(q) || s.from_name?.toLowerCase().includes(q) || s.to_name?.toLowerCase().includes(q)
    }
    return true
  })

  const onVehicleChange = useCallback((vehicleId: string) => {
    const v = vehicles.find(veh => veh.id === vehicleId)
    setSelectedVehicle(v || null)
  }, [vehicles])

  const onLeadChange = useCallback((leadId: string | undefined) => {
    if (!leadId) {
      setSelectedLead(null)
      form.setFieldsValue({ to_name: '' })
      return
    }
    const lead = leads.find(l => l.id === leadId)
    setSelectedLead(lead || null)
    if (lead) {
      const dest = [lead.name, lead.address, lead.city].filter(Boolean).join(', ')
      form.setFieldsValue({ to_name: dest })
    }
  }, [leads, form])

  const uploadMeterImage = async (file: File, type: 'starting' | 'closing') => {
    const setter = type === 'starting' ? setUploadingStart : setUploadingClose
    setter(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'transportation')
      formData.append('subfolder', `meter-${type}`)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const result = await res.json()
      if (result.success && result.key) {
        if (type === 'starting') setStartingMeterImg(result.key)
        else setClosingMeterImg(result.key)
        message.success(`${type} meter image uploaded`)
      } else {
        message.error('Upload failed')
      }
    } catch {
      message.error('Upload failed')
    } finally {
      setter(false)
    }
  }

  const openForm = (item?: any) => {
    setEditItem(item || null)
    if (item) {
      form.setFieldsValue({
        vehicle_id: item.vehicle_id,
        from_name: item.from_name,
        to_name: item.to_name,
        to_id: item.to_id || undefined,
        dispatch_date: item.dispatch_date ? dayjs(item.dispatch_date) : null,
        per_km_rate: item.per_km_rate,
        starting_meter: item.starting_meter || undefined,
        closing_meter: item.closing_meter || undefined,
        total_distance_km: item.total_distance_km,
        total_cost: item.total_cost,
        loading_charge: item.loading_charge,
        unloading_charge: item.unloading_charge,
        status: item.status,
        payment_status: item.payment_status,
      })
      const v = vehicles.find(veh => veh.id === item.vehicle_id)
      setSelectedVehicle(v || null)
      setStartingMeterImg(item.starting_meter_image || null)
      setClosingMeterImg(item.closing_meter_image || null)
      // Restore lead selection if to_id exists
      if (item.to_id) {
        const lead = leads.find(l => l.id === item.to_id)
        setSelectedLead(lead || null)
      } else {
        setSelectedLead(null)
      }
    } else {
      form.resetFields()
      form.setFieldsValue({ status: 'scheduled', payment_status: 'pending', dispatch_date: dayjs() })
      setSelectedVehicle(null)
      setSelectedLead(null)
      setStartingMeterImg(null)
      setClosingMeterImg(null)
    }
    setShowForm(true)
  }

  const calcTotal = () => {
    const starting = form.getFieldValue('starting_meter') || 0
    const closing = form.getFieldValue('closing_meter') || 0
    const rate = form.getFieldValue('per_km_rate') || 0
    const loadingC = form.getFieldValue('loading_charge') || 0
    const unloadingC = form.getFieldValue('unloading_charge') || 0

    const km = closing > starting ? closing - starting : 0
    const total = km * rate + loadingC + unloadingC

    form.setFieldsValue({ total_distance_km: km, total_cost: total })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      const payload: Record<string, any> = {
        shipment_type: 'trip',
        from_name: values.from_name,
        to_name: values.to_name,
        to_id: selectedLead?.id || null,
        to_type: selectedLead ? 'customer' : null,
        vehicle_id: values.vehicle_id,
        dispatch_date: values.dispatch_date?.format('YYYY-MM-DD') || null,
        per_km_rate: values.per_km_rate || 0,
        total_distance_km: values.total_distance_km || 0,
        total_cost: values.total_cost || 0,
        loading_charge: values.loading_charge || 0,
        unloading_charge: values.unloading_charge || 0,
        status: values.status,
        payment_status: values.payment_status,
        payment_type: 'per_km',
        starting_meter: values.starting_meter || 0,
        closing_meter: values.closing_meter || 0,
        starting_meter_image: startingMeterImg || null,
        closing_meter_image: closingMeterImg || null,
        driver_name: selectedVehicle?.driverName || null,
        driver_contact: selectedVehicle?.driverContact || null,
        owner_name: selectedVehicle?.ownerName || null,
        owner_contact: selectedVehicle?.ownerContact || null,
      }

      if (editItem?.id) {
        await shipmentService.update(editItem.id, payload)
        message.success('Trip updated')
      } else {
        const created = await shipmentService.create(payload)
        message.success('Trip created')

        // Fire-and-forget: Send WhatsApp notifications to all parties
        fetch('/api/whatsapp/trip-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tripNumber: created?.shipment_number || 'TR-NEW',
            date: values.dispatch_date?.format('DD MMM YYYY') || 'N/A',
            vehicleNumber: selectedVehicle?.vehicleNumber || 'N/A',
            driverName: selectedVehicle?.driverName || '',
            driverMobile: selectedVehicle?.driverContact || '',
            ownerName: selectedVehicle?.ownerName || '',
            ownerMobile: selectedVehicle?.ownerContact || '',
            customerName: selectedLead?.name || '',
            customerMobile: selectedLead?.mobile || '',
            source: values.from_name || 'N/A',
            destination: values.to_name || 'N/A',
            ratePerKm: String(values.per_km_rate || 0),
          }),
        }).then(r => r.json()).then(r => {
          if (r.totalSent > 0) console.log(`✅ WhatsApp: ${r.totalSent} messages sent`)
          if (r.totalErrors > 0) console.warn('⚠️ WhatsApp errors:', r.errors)
        }).catch(err => console.error('WhatsApp notify failed:', err))
      }
      setShowForm(false)
      load()
    } catch { message.error('Please fill required fields') }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await shipmentService.update(id, { status })
      message.success('Status updated')
      setDetailItem(null)
      load()
    } catch { message.error('Failed to update') }
  }

  const updatePayment = async (id: string, payment_status: string) => {
    try {
      await shipmentService.update(id, { payment_status })
      message.success('Payment status updated')
      setDetailItem(null)
      load()
    } catch { message.error('Failed to update') }
  }

  // Find lead info for detail view
  const getLeadForItem = (item: any) => {
    if (!item?.to_id) return null
    return leads.find(l => l.id === item.to_id) || null
  }

  if (loading) return <div className="app-loading"><Spin /></div>

  return (
    <div className="app-page">
      {/* Search */}
      <div className="app-search">
        <Search size={16} color="#9ca3af" />
        <input placeholder="Search trips..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Filter Chips */}
      <div className="filter-chips">
        {[{ k: 'all', l: 'All' }, { k: 'scheduled', l: 'Scheduled' }, { k: 'in_transit', l: 'In Transit' }, { k: 'delivered', l: 'Delivered' }, { k: 'completed', l: 'Done' }].map(f => (
          <button key={f.k} className={`filter-chip ${statusFilter === f.k ? 'active' : ''}`} onClick={() => setStatusFilter(f.k)}>
            {f.l} {f.k === 'all' ? `(${trips.length})` : `(${trips.filter(s => s.status === f.k).length})`}
          </button>
        ))}
      </div>

      {/* Trip List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={28} /></div>
          <div className="empty-state-text">No trips found</div>
          <div className="empty-state-sub">Tap + to create a trip</div>
        </div>
      ) : (
        filtered.map(s => (
          <div key={s.id} className="list-card" onClick={() => setDetailItem(s)} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="list-card-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
                <Package size={20} />
              </div>
              <div className="list-card-body">
                <div className="list-card-title">{s.shipment_number}</div>
                <div className="list-card-sub">
                  <MapPin size={11} style={{ display: 'inline', verticalAlign: -1 }} /> {s.from_name || 'N/A'} → {s.to_name || 'N/A'}
                </div>
              </div>
              <span className={`list-card-badge ${STATUS_CONFIG[s.status]?.badge || 'badge-gray'}`}>
                {STATUS_CONFIG[s.status]?.label || s.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--app-text-secondary)', paddingLeft: 52 }}>
              <span>{s.dispatch_date ? dayjs(s.dispatch_date).format('DD MMM') : 'No date'} • {s.total_distance_km || 0} km</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span className={`list-card-badge ${PAYMENT_CONFIG[s.payment_status]?.badge || 'badge-gray'}`} style={{ fontSize: 10 }}>
                  {PAYMENT_CONFIG[s.payment_status]?.label || s.payment_status}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--app-text)' }}>₹{(s.total_cost || 0).toLocaleString('en-IN')}</span>
              </span>
            </div>
          </div>
        ))
      )}

      {/* FAB */}
      <button className="fab" onClick={() => openForm()}>
        <Plus size={24} />
      </button>

      {/* Detail Sheet */}
      {detailItem && (() => {
        const veh = vehicles.find(v => v.id === detailItem.vehicle_id)
        const lead = getLeadForItem(detailItem)
        return (
          <div className="more-overlay" onClick={() => setDetailItem(null)}>
            <div className="more-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '85dvh', overflowY: 'auto' }}>
              <div className="more-sheet-header">
                <span className="more-sheet-title">{detailItem.shipment_number}</span>
                <button className="more-sheet-close" onClick={() => setDetailItem(null)}><X size={18} /></button>
              </div>
              <div style={{ padding: 16 }}>
                {/* Route */}
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--app-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Route</div>
                <div className="detail-row"><span className="detail-label">Date</span><span className="detail-value">{detailItem.dispatch_date ? dayjs(detailItem.dispatch_date).format('DD MMM YYYY') : 'N/A'}</span></div>
                <div className="detail-row"><span className="detail-label">Source</span><span className="detail-value">{detailItem.from_name || 'N/A'}</span></div>
                <div className="detail-row"><span className="detail-label">Destination</span><span className="detail-value">{detailItem.to_name || 'N/A'}</span></div>

                {/* Customer/Lead Section */}
                {lead && (
                  <>
                    <div className="app-divider" />
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--app-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Customer (Solar Lead)</div>
                    <div style={{ background: '#eff6ff', borderRadius: 10, padding: 10, marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <User size={14} color="#2563eb" />
                        <span style={{ fontWeight: 600, fontSize: 13, color: '#1e40af' }}>{lead.name}</span>
                      </div>
                      <div className="detail-row" style={{ marginBottom: 2 }}><span className="detail-label">Mobile</span>
                        <a href={`tel:${lead.mobile}`} style={{ color: 'var(--app-primary)', textDecoration: 'none', fontWeight: 500, fontSize: 12 }}>{lead.mobile || 'N/A'}</a>
                      </div>
                      <div className="detail-row" style={{ marginBottom: 2 }}><span className="detail-label">Address</span><span className="detail-value">{lead.address || 'N/A'}</span></div>
                      <div className="detail-row" style={{ marginBottom: 2 }}><span className="detail-label">City</span><span className="detail-value">{lead.city}{lead.pincode ? ` - ${lead.pincode}` : ''}{lead.state ? `, ${lead.state}` : ''}</span></div>
                      <div className="detail-row" style={{ marginBottom: 2 }}><span className="detail-label">System Size</span><span className="detail-value" style={{ fontWeight: 600 }}>{lead.capacityKw ? `${lead.capacityKw} kW` : 'N/A'} {lead.systemType !== 'N/A' ? `(${lead.systemType})` : ''}</span></div>
                      <div className="detail-row" style={{ marginBottom: 2 }}><span className="detail-label">Branch</span><span className="detail-value">{lead.branchName}</span></div>
                      <div className="detail-row" style={{ marginBottom: 0 }}><span className="detail-label">Lead Source</span><span className="detail-value">{lead.source}{lead.sourceName !== 'N/A' ? ` - ${lead.sourceName}` : ''}</span></div>
                    </div>
                  </>
                )}

                {/* Vehicle & Driver */}
                <div className="app-divider" />
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--app-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Vehicle & Driver</div>
                <div className="detail-row"><span className="detail-label">Vehicle</span><span className="detail-value">{veh?.vehicleNumber || 'N/A'}</span></div>
                <div className="detail-row"><span className="detail-label">Driver</span><span className="detail-value">{detailItem.driver_name || veh?.driverName || 'N/A'}</span></div>
                <div className="detail-row"><span className="detail-label">Driver Contact</span>
                  <span className="detail-value">{(detailItem.driver_contact || veh?.driverContact) ? (
                    <a href={`tel:${detailItem.driver_contact || veh?.driverContact}`} style={{ color: 'var(--app-primary)', textDecoration: 'none' }}>{detailItem.driver_contact || veh?.driverContact}</a>
                  ) : 'N/A'}</span>
                </div>
                <div className="detail-row"><span className="detail-label">Owner</span><span className="detail-value">{detailItem.owner_name || veh?.ownerName || 'N/A'}</span></div>
                <div className="detail-row"><span className="detail-label">Owner Contact</span>
                  <span className="detail-value">{(detailItem.owner_contact || veh?.ownerContact) ? (
                    <a href={`tel:${detailItem.owner_contact || veh?.ownerContact}`} style={{ color: 'var(--app-primary)', textDecoration: 'none' }}>{detailItem.owner_contact || veh?.ownerContact}</a>
                  ) : 'N/A'}</span>
                </div>

                {/* Meter Readings */}
                <div className="app-divider" />
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--app-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Meter Reading</div>
                <div className="detail-row"><span className="detail-label">Starting Meter</span><span className="detail-value">{detailItem.starting_meter || 'N/A'} km</span></div>
                {detailItem.starting_meter_image && (
                  <div style={{ marginBottom: 8 }}>
                    <a href={getImageUrl(detailItem.starting_meter_image)} target="_blank" rel="noopener noreferrer">
                      <img src={getImageUrl(detailItem.starting_meter_image)} alt="Starting meter" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--app-border)' }} />
                    </a>
                  </div>
                )}
                <div className="detail-row"><span className="detail-label">Closing Meter</span><span className="detail-value">{detailItem.closing_meter || 'N/A'} km</span></div>
                {detailItem.closing_meter_image && (
                  <div style={{ marginBottom: 8 }}>
                    <a href={getImageUrl(detailItem.closing_meter_image)} target="_blank" rel="noopener noreferrer">
                      <img src={getImageUrl(detailItem.closing_meter_image)} alt="Closing meter" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--app-border)' }} />
                    </a>
                  </div>
                )}
                <div className="detail-row"><span className="detail-label">Total Distance</span><span className="detail-value" style={{ fontWeight: 700, color: 'var(--app-primary)' }}>{detailItem.total_distance_km || 0} km</span></div>

                {/* Cost */}
                <div className="app-divider" />
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--app-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Cost Breakdown</div>
                <div className="detail-row"><span className="detail-label">Rate/km</span><span className="detail-value">₹{detailItem.per_km_rate || 0}</span></div>
                <div className="detail-row"><span className="detail-label">Trip Cost</span><span className="detail-value">₹{((detailItem.total_distance_km || 0) * (detailItem.per_km_rate || 0)).toLocaleString('en-IN')}</span></div>
                <div className="detail-row"><span className="detail-label">Loading</span><span className="detail-value">₹{(detailItem.loading_charge || 0).toLocaleString('en-IN')}</span></div>
                <div className="detail-row"><span className="detail-label">Unloading</span><span className="detail-value">₹{(detailItem.unloading_charge || 0).toLocaleString('en-IN')}</span></div>
                <div className="detail-row"><span className="detail-label">Total Amount</span><span className="detail-value" style={{ fontWeight: 700, fontSize: 16, color: 'var(--app-primary)' }}>₹{(detailItem.total_cost || 0).toLocaleString('en-IN')}</span></div>

                {/* Status */}
                <div className="app-divider" />
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--app-text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Status</div>
                <div className="detail-row"><span className="detail-label">Delivery</span><span className={`list-card-badge ${STATUS_CONFIG[detailItem.status]?.badge || 'badge-gray'}`}>{STATUS_CONFIG[detailItem.status]?.label || detailItem.status}</span></div>
                <div className="detail-row"><span className="detail-label">Payment</span><span className={`list-card-badge ${PAYMENT_CONFIG[detailItem.payment_status]?.badge || 'badge-gray'}`}>{PAYMENT_CONFIG[detailItem.payment_status]?.label || detailItem.payment_status}</span></div>

                {/* Quick Status Update */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', marginBottom: 6 }}>DELIVERY STATUS</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['scheduled', 'in_transit', 'delivered', 'completed'].map(st => (
                      <button key={st} onClick={() => updateStatus(detailItem.id, st)}
                        style={{ padding: '6px 12px', borderRadius: 20, border: detailItem.status === st ? '2px solid var(--app-primary)' : '1px solid var(--app-border)', background: detailItem.status === st ? 'var(--app-primary-light)' : '#fff', color: detailItem.status === st ? 'var(--app-primary)' : 'var(--app-text-secondary)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                        {st.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', marginBottom: 6 }}>PAYMENT STATUS</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['pending', 'partial', 'paid'].map(ps => (
                      <button key={ps} onClick={() => updatePayment(detailItem.id, ps)}
                        style={{ padding: '6px 12px', borderRadius: 20, border: detailItem.payment_status === ps ? '2px solid var(--app-primary)' : '1px solid var(--app-border)', background: detailItem.payment_status === ps ? 'var(--app-primary-light)' : '#fff', color: detailItem.payment_status === ps ? 'var(--app-primary)' : 'var(--app-text-secondary)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                        {ps}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button style={{ flex: 1, borderRadius: 10, minHeight: 40, background: 'var(--app-primary)', border: 'none', color: '#fff', fontWeight: 500, cursor: 'pointer' }} onClick={() => { setDetailItem(null); openForm(detailItem) }}>Edit Trip</button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Add/Edit Trip Modal */}
      <Modal open={showForm} onCancel={() => setShowForm(false)} title={editItem ? 'Edit Trip' : 'New Trip'} onOk={handleSave} okText="Save" forceRender width={420}>
        <Form form={form} layout="vertical">
          {/* Date & Vehicle */}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', marginBottom: 8 }}>TRIP DETAILS</div>
          <Form.Item name="dispatch_date" label="Trip Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="vehicle_id" label="Select Vehicle" rules={[{ required: true, message: 'Select a vehicle' }]}>
            <Select placeholder="Search vehicle..." showSearch optionFilterProp="label"
              onChange={onVehicleChange}
              options={vehicles.map(v => ({
                label: v.name,
                value: v.id,
              }))}
            />
          </Form.Item>

          {/* Auto-filled vehicle info */}
          {selectedVehicle && (
            <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 10, marginBottom: 16, fontSize: 12 }}>
              <div style={{ fontWeight: 600, color: '#166534', marginBottom: 4 }}>Vehicle Info (auto-filled)</div>
              <div>Driver: <strong>{selectedVehicle.driverName || 'No driver'}</strong> {selectedVehicle.driverContact && `(${selectedVehicle.driverContact})`}</div>
              <div>Owner: <strong>{selectedVehicle.ownerName || 'Company'}</strong> {selectedVehicle.ownerContact && `(${selectedVehicle.ownerContact})`}</div>
            </div>
          )}

          {/* Route */}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', margin: '4px 0 8px' }}>ROUTE</div>
          <Form.Item name="from_name" label="Source Place" rules={[{ required: true, message: 'Enter source' }]}>
            <Input placeholder="Starting location" prefix={<MapPin size={14} color="#9ca3af" />} />
          </Form.Item>

          {/* Customer / Solar Lead Selection (optional) */}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', margin: '4px 0 8px' }}>DESTINATION - CUSTOMER (Optional)</div>
          <Form.Item name="to_id" label="Select Customer (Solar Lead)">
            <Select placeholder="Search customer by name, mobile, city..." showSearch allowClear
              onChange={onLeadChange}
              listHeight={350}
              filterOption={(input, option) => {
                const q = input.toLowerCase()
                const l = leads.find(ld => ld.id === option?.value)
                if (!l) return false
                return [l.name, l.mobile, l.city, l.address, l.branchName, l.sourceName, l.source, l.status].some(f => f?.toLowerCase().includes(q))
              }}
              optionRender={(option) => {
                const l = leads.find(ld => ld.id === option.data.value)
                if (!l) return option.label
                return (
                  <div style={{ padding: '6px 0', lineHeight: 1.5, borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{l.name}</span>
                      <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: '#dbeafe', color: '#1d4ed8', fontWeight: 600 }}>{l.status}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#374151', marginBottom: 1 }}>📱 {l.mobile || 'N/A'}</div>
                    <div style={{ fontSize: 11, color: '#374151', marginBottom: 1 }}>📍 {[l.address, l.city, l.state, l.pincode].filter(Boolean).join(', ') || 'N/A'}</div>
                    <div style={{ fontSize: 11, color: '#374151', marginBottom: 1 }}>⚡ {l.capacityKw ? `${l.capacityKw} kW` : 'N/A'} {l.systemType !== 'N/A' ? `• ${l.systemType}` : ''}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280' }}>
                      <span>🏢 {l.branchName}</span>
                      <span>Source: {l.source}{l.sourceName !== 'N/A' ? ` - ${l.sourceName}` : ''}</span>
                    </div>
                  </div>
                )
              }}
              options={leads.map(l => ({
                label: `${l.name} - ${l.mobile} (${l.city})`,
                value: l.id,
              }))}
            />
          </Form.Item>

          {/* Selected lead info card */}
          {selectedLead && (
            <div style={{ background: '#eff6ff', borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <User size={14} color="#2563eb" />
                <span style={{ fontWeight: 700, fontSize: 13, color: '#1e40af' }}>{selectedLead.name}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px', color: '#374151' }}>
                <div><Phone size={10} style={{ display: 'inline', verticalAlign: -1 }} /> {selectedLead.mobile || 'N/A'}</div>
                <div><Zap size={10} style={{ display: 'inline', verticalAlign: -1 }} /> {selectedLead.capacityKw ? `${selectedLead.capacityKw} kW` : 'N/A'} {selectedLead.systemType !== 'N/A' ? `(${selectedLead.systemType})` : ''}</div>
                <div><MapPin size={10} style={{ display: 'inline', verticalAlign: -1 }} /> {selectedLead.address || 'N/A'}</div>
                <div><Building2 size={10} style={{ display: 'inline', verticalAlign: -1 }} /> {selectedLead.branchName}</div>
                <div style={{ gridColumn: '1 / -1' }}>{selectedLead.city}{selectedLead.pincode ? ` - ${selectedLead.pincode}` : ''}{selectedLead.state ? `, ${selectedLead.state}` : ''}</div>
                <div style={{ gridColumn: '1 / -1', color: '#6b7280' }}>Source: {selectedLead.source}{selectedLead.sourceName !== 'N/A' ? ` - ${selectedLead.sourceName}` : ''}</div>
              </div>
            </div>
          )}

          <Form.Item name="to_name" label="Destination Place" rules={[{ required: true, message: 'Enter destination' }]}>
            <Input placeholder="Destination location" prefix={<MapPin size={14} color="#9ca3af" />} />
          </Form.Item>

          {/* Meter Readings with Image Upload */}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', margin: '4px 0 8px' }}>METER READINGS</div>

          {/* Starting Meter */}
          <div style={{ background: '#f9fafb', borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <Form.Item name="starting_meter" label="Starting Meter (km)" style={{ marginBottom: 8 }}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="0" onChange={calcTotal} />
            </Form.Item>
            {startingMeterImg ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <a href={getImageUrl(startingMeterImg)} target="_blank" rel="noopener noreferrer">
                  <img src={getImageUrl(startingMeterImg)} alt="Starting meter" style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 8, border: '2px solid var(--app-primary)' }} />
                </a>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginBottom: 2 }}>✓ Photo uploaded</div>
                  <button onClick={() => setStartingMeterImg(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 11, padding: 0, textDecoration: 'underline' }}>Remove photo</button>
                </div>
              </div>
            ) : (
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 12px', borderRadius: 10, border: '2px dashed #d1d5db', cursor: 'pointer', background: '#fff', color: 'var(--app-text-secondary)' }}>
                <Camera size={16} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{uploadingStart ? 'Uploading...' : 'Upload Starting Meter Photo'}</span>
                <input type="file" accept="image/*" capture="environment" hidden
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadMeterImage(f, 'starting'); e.target.value = '' }}
                />
              </label>
            )}
          </div>

          {/* Closing Meter */}
          <div style={{ background: '#f9fafb', borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <Form.Item name="closing_meter" label="Closing Meter (km)" style={{ marginBottom: 8 }}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="0" onChange={calcTotal} />
            </Form.Item>
            {closingMeterImg ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <a href={getImageUrl(closingMeterImg)} target="_blank" rel="noopener noreferrer">
                  <img src={getImageUrl(closingMeterImg)} alt="Closing meter" style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 8, border: '2px solid var(--app-primary)' }} />
                </a>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginBottom: 2 }}>✓ Photo uploaded</div>
                  <button onClick={() => setClosingMeterImg(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 11, padding: 0, textDecoration: 'underline' }}>Remove photo</button>
                </div>
              </div>
            ) : (
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 12px', borderRadius: 10, border: '2px dashed #d1d5db', cursor: 'pointer', background: '#fff', color: 'var(--app-text-secondary)' }}>
                <Camera size={16} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{uploadingClose ? 'Uploading...' : 'Upload Closing Meter Photo'}</span>
                <input type="file" accept="image/*" capture="environment" hidden
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadMeterImage(f, 'closing'); e.target.value = '' }}
                />
              </label>
            )}
          </div>

          <Form.Item name="total_distance_km" label="Total KM (auto)">
            <InputNumber style={{ width: '100%' }} min={0} disabled />
          </Form.Item>

          {/* Cost */}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', margin: '4px 0 8px' }}>COST</div>
          <Form.Item name="per_km_rate" label="Rate per KM (₹)" rules={[{ required: true, message: 'Enter rate' }]}>
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" onChange={calcTotal} />
          </Form.Item>
          <div style={{ display: 'flex', gap: 8 }}>
            <Form.Item name="loading_charge" label="Loading (₹)" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="0" onChange={calcTotal} />
            </Form.Item>
            <Form.Item name="unloading_charge" label="Unloading (₹)" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="0" onChange={calcTotal} />
            </Form.Item>
          </div>
          <Form.Item name="total_cost" label="Total Amount (₹) (auto)">
            <InputNumber style={{ width: '100%', fontWeight: 700, fontSize: 16 }} min={0} disabled />
          </Form.Item>

          {/* Status */}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', margin: '4px 0 8px' }}>STATUS</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Form.Item name="status" label="Delivery Status" style={{ flex: 1 }}>
              <Select options={[
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'In Transit', value: 'in_transit' },
                { label: 'Delivered', value: 'delivered' },
                { label: 'Completed', value: 'completed' },
              ]} />
            </Form.Item>
            <Form.Item name="payment_status" label="Payment Status" style={{ flex: 1 }}>
              <Select options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Partial', value: 'partial' },
                { label: 'Paid', value: 'paid' },
              ]} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
