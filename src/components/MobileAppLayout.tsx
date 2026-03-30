'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Avatar, Dropdown, Badge } from 'antd'
import {
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Home, Car, Package, Receipt, Menu, X, BarChart3, MapPin, Route, Users, ChevronLeft } from 'lucide-react'
import { authProvider } from '../lib/authProvider'
import { UserRole, ROLE_BADGE_COLORS, ROLE_DISPLAY_NAMES } from '../config/roles'

interface MobileAppLayoutProps {
  children: React.ReactNode
}

interface UserInfo {
  id: string
  name: string
  email: string
  role: UserRole
  branch_id?: string
}

const TAB_ITEMS = [
  { key: '/dashboard/transportation', label: 'Home', icon: Home },
  { key: '/dashboard/transportation/vehicles', label: 'Fleet', icon: Car },
  { key: '/dashboard/transportation/shipments', label: 'Shipments', icon: Package },
  { key: '/dashboard/transportation/expenses', label: 'Expenses', icon: Receipt },
]

const MORE_MENU_ITEMS = [
  { key: '/dashboard/transportation/drivers', label: 'Drivers', icon: Users },
  { key: '/dashboard/transportation/delivery-points', label: 'Delivery Points', icon: MapPin },
  { key: '/dashboard/transportation/trip-materials', label: 'Trip Materials', icon: Route },
  { key: '/dashboard/transportation/analytics', label: 'Analytics', icon: BarChart3 },
]

// Map of routes to page titles
const PAGE_TITLES: Record<string, string> = {
  '/dashboard/transportation': 'Home',
  '/dashboard/transportation/vehicles': 'Vehicles',
  '/dashboard/transportation/drivers': 'Drivers',
  '/dashboard/transportation/shipments': 'Shipments',
  '/dashboard/transportation/delivery-points': 'Delivery Points',
  '/dashboard/transportation/trip-materials': 'Trip Materials',
  '/dashboard/transportation/expenses': 'Expenses',
  '/dashboard/transportation/analytics': 'Analytics',
}

export default function MobileAppLayout({ children }: MobileAppLayoutProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.id) setUserInfo(user)
  }, [])

  const handleLogout = async () => {
    const result = await authProvider.logout({})
    if (result.success) router.push('/login')
  }

  const activeTab = TAB_ITEMS.find(t => pathname === t.key)?.key
    || (MORE_MENU_ITEMS.find(m => pathname === m.key) ? 'more' : TAB_ITEMS[0].key)

  const pageTitle = PAGE_TITLES[pathname] || 'Transportation'
  const isHome = pathname === '/dashboard/transportation'
  const isInMoreMenu = MORE_MENU_ITEMS.some(m => pathname === m.key)

  const getRoleBadgeColor = (role: string) => ROLE_BADGE_COLORS[role as UserRole] || '#666'

  return (
    <div className="app-shell">
      {/* ── Top App Bar ── */}
      <header className="app-header">
        <div className="app-header-left">
          {!isHome && (
            <button className="app-back-btn" onClick={() => router.back()}>
              <ChevronLeft size={22} />
            </button>
          )}
          {isHome ? (
            <div className="app-brand">
              <div className="app-logo">MT</div>
              <div>
                <div className="app-brand-title">Mudrabase Transport</div>
                <div className="app-brand-sub">Transportation & Logistics</div>
              </div>
            </div>
          ) : (
            <span className="app-page-title">{pageTitle}</span>
          )}
        </div>
        <div className="app-header-right">
          {userInfo && (
            <Dropdown
              menu={{
                items: [
                  { key: 'name', label: <div><strong>{userInfo.name}</strong><br/><span style={{fontSize:11,color:'#888'}}>{ROLE_DISPLAY_NAMES[userInfo.role] || userInfo.role}</span></div>, disabled: true },
                  { type: 'divider' },
                  { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
                  { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
                  { type: 'divider' },
                  { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true, onClick: handleLogout },
                ],
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Avatar
                size={32}
                style={{ backgroundColor: getRoleBadgeColor(userInfo.role), cursor: 'pointer' }}
              >
                {userInfo.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Dropdown>
          )}
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="app-content">
        {children}
      </main>

      {/* ── More Menu Overlay ── */}
      {moreOpen && (
        <div className="more-overlay" onClick={() => setMoreOpen(false)}>
          <div className="more-sheet" onClick={e => e.stopPropagation()}>
            <div className="more-sheet-header">
              <span className="more-sheet-title">More</span>
              <button className="more-sheet-close" onClick={() => setMoreOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="more-sheet-items">
              {MORE_MENU_ITEMS.map(item => (
                <button
                  key={item.key}
                  className={`more-sheet-item ${pathname === item.key ? 'active' : ''}`}
                  onClick={() => { router.push(item.key); setMoreOpen(false) }}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Tab Bar ── */}
      <nav className="app-tabbar safe-bottom">
        {TAB_ITEMS.map(tab => {
          const isActive = pathname === tab.key
          return (
            <button
              key={tab.key}
              className={`app-tab ${isActive ? 'active' : ''}`}
              onClick={() => router.push(tab.key)}
            >
              <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>{tab.label}</span>
            </button>
          )
        })}
        <button
          className={`app-tab ${isInMoreMenu || moreOpen ? 'active' : ''}`}
          onClick={() => setMoreOpen(true)}
        >
          <Menu size={20} strokeWidth={isInMoreMenu || moreOpen ? 2.5 : 1.8} />
          <span>More</span>
        </button>
      </nav>
    </div>
  )
}
