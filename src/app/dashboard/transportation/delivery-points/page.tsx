'use client'

import { useEffect, useState } from 'react'
import { message, Spin, Select } from 'antd'
import { MapPin, Search, X, CheckCircle, Clock, Truck } from 'lucide-react'
import { deliveryPointService, shipmentService } from '@/services/transportation.service'
import dayjs from 'dayjs'

const STATUS_BADGE: Record<string, { badge: string; label: string }> = {
  pending: { badge: 'badge-yellow', label: 'Pending' },
  in_transit: { badge: 'badge-blue', label: 'In Transit' },
  delivered: { badge: 'badge-green', label: 'Delivered' },
  failed: { badge: 'badge-red', label: 'Failed' },
  skipped: { badge: 'badge-gray', label: 'Skipped' },
}

export default function DeliveryPointsPage() {
  const [points, setPoints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [detailItem, setDetailItem] = useState<any>(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const data = await deliveryPointService.getAll()
      setPoints(data)
    } catch { message.error('Failed to load delivery points') }
    finally { setLoading(false) }
  }

  const filtered = points.filter(p => {
    if (statusFilter !== 'all' && p.delivery_status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return p.contact_name?.toLowerCase().includes(q) || p.delivery_address?.toLowerCase().includes(q) || p.delivery_city?.toLowerCase().includes(q)
    }
    return true
  })

  const updateStatus = async (id: string, status: string) => {
    try {
      await deliveryPointService.update(id, { delivery_status: status })
      message.success('Status updated')
      setDetailItem(null)
      load()
    } catch { message.error('Failed to update') }
  }

  if (loading) return <div className="app-loading"><Spin /></div>

  return (
    <div className="app-page">
      {/* Search */}
      <div className="app-search">
        <Search size={16} color="#9ca3af" />
        <input placeholder="Search delivery points..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Filter Chips */}
      <div className="filter-chips">
        {[{ k: 'all', l: 'All' }, { k: 'pending', l: 'Pending' }, { k: 'in_transit', l: 'In Transit' }, { k: 'delivered', l: 'Delivered' }].map(f => (
          <button key={f.k} className={`filter-chip ${statusFilter === f.k ? 'active' : ''}`} onClick={() => setStatusFilter(f.k)}>
            {f.l} {f.k === 'all' ? `(${points.length})` : `(${points.filter(p => p.delivery_status === f.k).length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><MapPin size={28} /></div>
          <div className="empty-state-text">No delivery points</div>
          <div className="empty-state-sub">Delivery points are added with shipments</div>
        </div>
      ) : (
        filtered.map(p => (
          <div key={p.id} className="list-card" onClick={() => setDetailItem(p)} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="list-card-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <MapPin size={20} />
              </div>
              <div className="list-card-body">
                <div className="list-card-title">{p.contact_name || 'Unknown'}</div>
                <div className="list-card-sub">{p.delivery_city || 'N/A'} • Order #{p.delivery_order || '-'}</div>
              </div>
              <span className={`list-card-badge ${STATUS_BADGE[p.delivery_status]?.badge || 'badge-gray'}`}>
                {STATUS_BADGE[p.delivery_status]?.label || p.delivery_status || 'Pending'}
              </span>
            </div>
            {p.delivery_address && (
              <div style={{ fontSize: 12, color: 'var(--app-text-secondary)', paddingLeft: 52, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.delivery_address}
              </div>
            )}
          </div>
        ))
      )}

      {/* Detail Sheet */}
      {detailItem && (
        <div className="more-overlay" onClick={() => setDetailItem(null)}>
          <div className="more-sheet" onClick={e => e.stopPropagation()}>
            <div className="more-sheet-header">
              <span className="more-sheet-title">{detailItem.contact_name || 'Delivery Point'}</span>
              <button className="more-sheet-close" onClick={() => setDetailItem(null)}><X size={18} /></button>
            </div>
            <div style={{ padding: 16 }}>
              <div className="detail-row"><span className="detail-label">Address</span><span className="detail-value">{detailItem.delivery_address || 'N/A'}</span></div>
              <div className="detail-row"><span className="detail-label">City</span><span className="detail-value">{detailItem.delivery_city || 'N/A'}</span></div>
              <div className="detail-row"><span className="detail-label">Order</span><span className="detail-value">#{detailItem.delivery_order || '-'}</span></div>
              <div className="detail-row"><span className="detail-label">Status</span><span className={`list-card-badge ${STATUS_BADGE[detailItem.delivery_status]?.badge || 'badge-gray'}`}>{STATUS_BADGE[detailItem.delivery_status]?.label || 'Pending'}</span></div>
              {detailItem.delivered_at && <div className="detail-row"><span className="detail-label">Delivered At</span><span className="detail-value">{dayjs(detailItem.delivered_at).format('DD MMM YYYY, h:mm A')}</span></div>}
              {detailItem.delivery_notes && <div className="detail-row"><span className="detail-label">Notes</span><span className="detail-value">{detailItem.delivery_notes}</span></div>}

              {/* Quick Status */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', marginBottom: 8 }}>UPDATE STATUS</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['pending', 'in_transit', 'delivered', 'failed'].map(st => (
                    <button key={st} onClick={() => updateStatus(detailItem.id, st)}
                      style={{ padding: '6px 12px', borderRadius: 20, border: detailItem.delivery_status === st ? '2px solid var(--app-primary)' : '1px solid var(--app-border)', background: detailItem.delivery_status === st ? 'var(--app-primary-light)' : '#fff', color: detailItem.delivery_status === st ? 'var(--app-primary)' : 'var(--app-text-secondary)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
