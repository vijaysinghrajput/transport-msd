'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Layout, Menu, Avatar, Dropdown, Button, Typography, Badge } from 'antd'
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined
} from '@ant-design/icons'
import { getMenuForRole } from '../config/menuConfig'
import { UserRole, ROLE_BADGE_COLORS, ROLE_DISPLAY_NAMES, getRoleHierarchyPath } from '../config/roles'
import { authProvider } from '../lib/authProvider'
import ConnectionStatus from './ConnectionStatus'

const { Sider, Header, Content } = Layout
const { Text } = Typography

interface SidebarProps {
  children: React.ReactNode
}

interface UserInfo {
  id: string
  name: string
  email: string
  role: UserRole
  branch_id?: string
}

export default function Sidebar({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.id) {
      setUserInfo(user)
    }
  }, [])

  const handleLogout = async () => {
    const result = await authProvider.logout({})
    if (result.success) {
      router.push('/login')
    }
  }

  const menuData = userInfo ? getMenuForRole(userInfo.role as any) : []

  const groupOrder = [
    'Transportation',
    'Fleet Management',
    'Logistics',
    'Finance',
    'Analytics',
    'Other'
  ]

  const groupedMenus = menuData.reduce<Map<string, typeof menuData>>((acc, item) => {
    const groupLabel = item.group || 'Other'
    if (!acc.has(groupLabel)) {
      acc.set(groupLabel, [])
    }
    acc.get(groupLabel)!.push(item)
    return acc
  }, new Map())

  const sortedGroups = Array.from(groupedMenus.entries()).sort((a, b) => {
    const indexA = groupOrder.indexOf(a[0]) === -1 ? groupOrder.length : groupOrder.indexOf(a[0])
    const indexB = groupOrder.indexOf(b[0]) === -1 ? groupOrder.length : groupOrder.indexOf(b[0])
    return indexA - indexB
  })

  const menuItems = sortedGroups.map(([groupLabel, items]) => ({
    type: 'group' as const,
    key: `group-${groupLabel}`,
    label: <span className="text-[11px] uppercase tracking-wide text-gray-500">{groupLabel}</span>,
    children: items.map(item => {
      const childItem: any = {
        key: item.href,
        icon: <item.icon size={18} />,
        label: item.title,
      }

      if (item.children && item.children.length > 0) {
        childItem.children = item.children.map(child => ({
          key: child.href,
          icon: <child.icon size={16} />,
          label: child.title,
        }))
      }

      return childItem
    })
  }))

  const userMenuItems = [
    {
      key: '/dashboard/profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key)
  }

  const getRoleBadgeColor = (role: string) => {
    const typedRole = role as UserRole
    return ROLE_BADGE_COLORS[typedRole] || '#666666'
  }

  const getRoleDisplayName = (role: string) => {
    const typedRole = role as UserRole
    return ROLE_DISPLAY_NAMES[typedRole] || role
  }

  const hierarchyText = userInfo
    ? getRoleHierarchyPath(userInfo.role as UserRole)
        .map(role => ROLE_DISPLAY_NAMES[role])
        .join(' → ')
    : ''

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo Area */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              MT
            </div>
            {!collapsed && (
              <div className="ml-3">
                <Text strong className="text-gray-800">Mudrabase Transport</Text>
                <div className="text-xs text-gray-500">Transportation & Logistics</div>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        {userInfo && !collapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <Avatar 
                size={40} 
                style={{ backgroundColor: getRoleBadgeColor(userInfo.role) }}
              >
                {userInfo.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div className="ml-3 flex-1">
                <div className="font-medium text-gray-800 text-sm">
                  {userInfo.name}
                </div>
                <Badge 
                  color={getRoleBadgeColor(userInfo.role)}
                  text={getRoleDisplayName(userInfo.role)}
                  className="text-xs"
                />
                <div className="text-[11px] text-gray-500 mt-2 leading-snug">
                  <span className="font-medium text-gray-600">Hierarchy</span>
                  <div className="text-[11px] text-gray-600 mt-1">
                    {hierarchyText}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="flex-1">
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ border: 'none' }}
            className="h-full"
          />
        </div>

        {/* Connection Status */}
        {!collapsed ? (
          <div className="p-4 border-t border-gray-200">
            <ConnectionStatus showDetails />
          </div>
        ) : (
          <div className="p-2 border-t border-gray-200 flex justify-center">
            <ConnectionStatus />
          </div>
        )}
      </Sider>

      <Layout>
        {/* Header */}
        <Header 
          style={{ 
            padding: '0 24px', 
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px' }}
            />
            
            <div className="ml-4">
              <Text strong className="text-lg text-gray-800">
                Dashboard
              </Text>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              type="text" 
              icon={<BellOutlined />} 
              size="large"
            />
            
            {userInfo && (
              <Dropdown 
                menu={{ 
                  items: userMenuItems,
                  onClick: ({ key }) => {
                    if (key !== 'logout' && key !== 'notifications') {
                      router.push(key)
                    }
                  }
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                  <Avatar 
                    size={32} 
                    style={{ backgroundColor: getRoleBadgeColor(userInfo.role) }}
                  >
                    {userInfo.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div className="ml-2 hidden md:block">
                    <Text className="text-sm font-medium">{userInfo.name}</Text>
                  </div>
                </div>
              </Dropdown>
            )}
          </div>
        </Header>

        {/* Main Content */}
        <Content
          style={{
            margin: '16px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
