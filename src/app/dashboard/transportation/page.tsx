'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Spin } from 'antd'
import { Package, Car, Users, Receipt, MapPin, TrendingUp, AlertTriangle, CheckCircle, Plus, BarChart3, Route } from 'lucide-react'
import { shipmentAnalyticsService } from '@/services/transportation.service'

export default function TransportationDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await shipmentAnalyticsService.getDashboardStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="app-loading"><Spin /></div>
  }

  const s = stats || {}

  return (
    <div className="app-page fade-in">
      {/* Stats Grid */}
      <div className="stat-grid">
        <div className="stat-box" onClick={() => router.push('/dashboard/transportation/shipments')}>
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <Package size={18} />
          </div>
          <div>
            <div className="stat-value">{s.totalShipments || 0}</div>
            <div className="stat-label">Shipments</div>
          </div>
        </div>
        <div className="stat-box" onClick={() => router.push('/dashboard/transportation/shipments')}>
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="stat-value">{s.activeShipments || 0}</div>
            <div className="stat-label">In Transit</div>
          </div>
        </div>
        <div className="stat-box" onClick={() => router.push('/dashboard/transportation/vehicles')}>
          <div className="stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <Car size={18} />
          </div>
          <div>
            <div className="stat-value">{s.totalVehicles || 0}</div>
            <div className="stat-label">Vehicles</div>
          </div>
        </div>
        <div className="stat-box" onClick={() => router.push('/dashboard/transportation/expenses')}>
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <Receipt size={18} />
          </div>
          <div>
            <div className="stat-value">₹{((s.totalExpenses || 0) / 1000).toFixed(0)}k</div>
            <div className="stat-label">Expenses</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="app-card">
        <div className="app-card-title" style={{ marginBottom: 10 }}>Quick Actions</div>
        <div className="quick-actions">
          <button className="quick-action" onClick={() => router.push('/dashboard/transportation/shipments')}>
            <div className="quick-action-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
              <Plus size={18} />
            </div>
            New Shipment
          </button>
          <button className="quick-action" onClick={() => router.push('/dashboard/transportation/vehicles')}>
            <div className="quick-action-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
              <Car size={18} />
            </div>
            Add Vehicle
          </button>
          <button className="quick-action" onClick={() => router.push('/dashboard/transportation/expenses')}>
            <div className="quick-action-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <Receipt size={18} />
            </div>
            Add Expense
          </button>
          <button className="quick-action" onClick={() => router.push('/dashboard/transportation/analytics')}>
            <div className="quick-action-icon" style={{ background: '#d1fae5', color: '#059669' }}>
              <BarChart3 size={18} />
            </div>
            Analytics
          </button>
        </div>
      </div>

      {/* Shipment Status */}
      <div className="app-card">
        <div className="app-card-header">
          <span className="app-card-title">Shipment Status</span>
          <button className="section-link" onClick={() => router.push('/dashboard/transportation/shipments')}>See all</button>
        </div>
        {Object.entries(s.shipmentsByStatus || {}).map(([status, count]) => (
          <div key={status} className="detail-row">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className={`status-dot ${status === 'delivered' || status === 'completed' ? 'green' : status === 'in_transit' ? 'blue' : status === 'scheduled' ? 'yellow' : 'gray'}`} />
              <span className="detail-label">{status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
            </div>
            <span className="detail-value">{String(count)}</span>
          </div>
        ))}
      </div>

      {/* Cost Summary */}
      <div className="app-card">
        <div className="app-card-title" style={{ marginBottom: 8 }}>Cost Summary</div>
        <div className="detail-row">
          <span className="detail-label">Shipment Cost</span>
          <span className="detail-value">₹{(s.totalShipmentCost || 0).toLocaleString('en-IN')}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Total Expenses</span>
          <span className="detail-value">₹{(s.totalExpenses || 0).toLocaleString('en-IN')}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Pending Payments</span>
          <span className="detail-value" style={{ color: '#dc2626' }}>₹{(s.pendingPayments || 0).toLocaleString('en-IN')}</span>
        </div>
        <div className="detail-row" style={{ borderBottom: 'none' }}>
          <span className="detail-label" style={{ fontWeight: 600, color: 'var(--app-text)' }}>Total</span>
          <span className="detail-value" style={{ fontSize: 16 }}>₹{(s.totalCost || 0).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Active Vehicles */}
      <div className="app-card">
        <div className="app-card-header">
          <span className="app-card-title">Fleet Overview</span>
          <button className="section-link" onClick={() => router.push('/dashboard/transportation/vehicles')}>Manage</button>
        </div>
        <div className="detail-row">
          <span className="detail-label">Active Vehicles</span>
          <span className="list-card-badge badge-green">{s.activeVehicles || 0}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Delivered</span>
          <span className="list-card-badge badge-blue">{s.deliveredShipments || 0}</span>
        </div>
      </div>
    </div>
  )
}
