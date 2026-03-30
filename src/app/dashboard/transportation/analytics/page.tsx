'use client'

import { useEffect, useState } from 'react'
import { Spin, message } from 'antd'
import { BarChart3, TrendingUp, Package, Car, Receipt, MapPin, AlertTriangle } from 'lucide-react'
import { shipmentAnalyticsService, vehicleService, transportationExpenseService } from '@/services/transportation.service'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [vehicleStats, setVehicleStats] = useState<any>(null)
  const [expenseStats, setExpenseStats] = useState<any>(null)
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const [s, v, e, ins] = await Promise.all([
        shipmentAnalyticsService.getDashboardStats(),
        vehicleService.getStats(),
        transportationExpenseService.getStats(),
        shipmentAnalyticsService.getInsights(),
      ])
      setStats(s)
      setVehicleStats(v)
      setExpenseStats(e)
      setInsights(ins)
    } catch { message.error('Failed to load analytics') }
    finally { setLoading(false) }
  }

  if (loading) return <div className="app-loading"><Spin /></div>

  const s = stats || {}
  const vs = vehicleStats || {}
  const es = expenseStats || {}

  return (
    <div className="app-page">
      {/* Overview Stats */}
      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><Package size={18} /></div>
          <div><div className="stat-value">{s.totalShipments || 0}</div><div className="stat-label">Shipments</div></div>
        </div>
        <div className="stat-box">
          <div className="stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}><Car size={18} /></div>
          <div><div className="stat-value">{vs.total || 0}</div><div className="stat-label">Vehicles</div></div>
        </div>
        <div className="stat-box">
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}><Receipt size={18} /></div>
          <div><div className="stat-value">₹{((es.total || 0) / 1000).toFixed(0)}k</div><div className="stat-label">Expenses</div></div>
        </div>
        <div className="stat-box">
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}><TrendingUp size={18} /></div>
          <div><div className="stat-value">₹{((s.totalShipmentCost || 0) / 1000).toFixed(0)}k</div><div className="stat-label">Revenue</div></div>
        </div>
      </div>

      {/* Shipment Status Breakdown */}
      <div className="app-card">
        <div className="app-card-title" style={{ marginBottom: 10 }}>Shipment Status</div>
        {Object.entries(s.shipmentsByStatus || {}).map(([status, count]) => {
          const total = s.totalShipments || 1
          const pct = Math.round((Number(count) / total) * 100)
          return (
            <div key={status} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: 'var(--app-text-secondary)' }}>{status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                <span style={{ fontWeight: 600 }}>{String(count)} ({pct}%)</span>
              </div>
              <div style={{ height: 6, background: 'var(--app-border)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: status === 'delivered' || status === 'completed' ? '#059669' : status === 'in_transit' ? '#2563eb' : status === 'scheduled' ? '#d97706' : '#9ca3af', borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Fleet Status */}
      <div className="app-card">
        <div className="app-card-title" style={{ marginBottom: 10 }}>Fleet Status</div>
        <div className="detail-row"><span className="detail-label">Active Vehicles</span><span className="list-card-badge badge-green">{vs.active || 0}</span></div>
        <div className="detail-row"><span className="detail-label">Inactive Vehicles</span><span className="list-card-badge badge-gray">{vs.inactive || 0}</span></div>
        {(vs.insuranceExpiring || 0) > 0 && (
          <div className="detail-row">
            <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={14} color="#d97706" /> Insurance Expiring
            </span>
            <span className="list-card-badge badge-yellow">{vs.insuranceExpiring}</span>
          </div>
        )}
        {(vs.fitnessExpiring || 0) > 0 && (
          <div className="detail-row">
            <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={14} color="#dc2626" /> Fitness Expiring
            </span>
            <span className="list-card-badge badge-red">{vs.fitnessExpiring}</span>
          </div>
        )}
        {vs.byType && Object.keys(vs.byType).length > 0 && (
          <>
            <div className="app-divider" />
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', marginBottom: 6 }}>BY TYPE</div>
            {Object.entries(vs.byType).map(([type, count]) => (
              <div key={type} className="detail-row">
                <span className="detail-label">{type.replace(/_/g, ' ')}</span>
                <span className="detail-value">{String(count)}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Expense Breakdown */}
      <div className="app-card">
        <div className="app-card-title" style={{ marginBottom: 10 }}>Expense Breakdown</div>
        <div className="detail-row"><span className="detail-label">Total Expenses</span><span className="detail-value" style={{ fontWeight: 700 }}>₹{(es.total || 0).toLocaleString('en-IN')}</span></div>
        <div className="detail-row"><span className="detail-label">Pending</span><span className="detail-value" style={{ color: '#d97706' }}>₹{(es.pending || 0).toLocaleString('en-IN')}</span></div>
        <div className="detail-row"><span className="detail-label">Approved</span><span className="detail-value" style={{ color: '#059669' }}>₹{(es.approved || 0).toLocaleString('en-IN')}</span></div>
        {es.byType && Object.keys(es.byType).length > 0 && (
          <>
            <div className="app-divider" />
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-secondary)', marginBottom: 6 }}>BY TYPE</div>
            {Object.entries(es.byType).sort((a, b) => Number(b[1]) - Number(a[1])).map(([type, amount]) => (
              <div key={type} className="detail-row">
                <span className="detail-label">{type.replace(/_/g, ' ')}</span>
                <span className="detail-value">₹{(Number(amount) || 0).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Financial Summary */}
      <div className="app-card">
        <div className="app-card-title" style={{ marginBottom: 10 }}>Financial Summary</div>
        <div className="detail-row"><span className="detail-label">Shipment Revenue</span><span className="detail-value">₹{(s.totalShipmentCost || 0).toLocaleString('en-IN')}</span></div>
        <div className="detail-row"><span className="detail-label">Total Expenses</span><span className="detail-value" style={{ color: '#dc2626' }}>₹{(es.total || 0).toLocaleString('en-IN')}</span></div>
        <div className="detail-row"><span className="detail-label">Pending Payments</span><span className="detail-value" style={{ color: '#d97706' }}>₹{(s.pendingPayments || 0).toLocaleString('en-IN')}</span></div>
        <div className="app-divider" />
        <div className="detail-row" style={{ borderBottom: 'none' }}>
          <span className="detail-label" style={{ fontWeight: 600, color: 'var(--app-text)' }}>Net Profit</span>
          <span className="detail-value" style={{ fontSize: 16, color: (s.totalShipmentCost || 0) - (es.total || 0) >= 0 ? '#059669' : '#dc2626' }}>
            ₹{((s.totalShipmentCost || 0) - (es.total || 0)).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="app-card">
          <div className="app-card-title" style={{ marginBottom: 10 }}>AI Insights</div>
          {insights.slice(0, 5).map((ins, i) => (
            <div key={ins.id || i} style={{ padding: '10px 0', borderBottom: i < insights.length - 1 ? '1px solid var(--app-border)' : 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--app-text)' }}>{ins.title || ins.insight_type || 'Insight'}</div>
              <div style={{ fontSize: 12, color: 'var(--app-text-secondary)', marginTop: 4 }}>{ins.description || ins.insight_text || ''}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
