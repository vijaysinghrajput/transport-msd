'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Alert, Button, Spin } from 'antd'
import { ShieldCheckIcon, ArrowLeft } from 'lucide-react'
import { UserRole } from '@/config/roles'

interface AdminGuardProps {
  children: React.ReactNode
  allowedRoles?: (UserRole | string)[]
}

const DEFAULT_ALLOWED_ROLES: (UserRole | string)[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
]

export default function AdminGuard({ children, allowedRoles = DEFAULT_ALLOWED_ROLES }: AdminGuardProps) {
  const [loading, setLoading] = useState(true)
  const [isAllowed, setIsAllowed] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    verifyRole()
  }, [])

  const verifyRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      setUserInfo(user)

      if (!user.id) {
        router.push('/login')
        return
      }

      // Check if user role matches any allowed role (supports both enum and string)
      const userRole = user.role?.toLowerCase()
      const allowed = allowedRoles.some(role => 
        typeof role === 'string' ? role.toLowerCase() === userRole : role === userRole
      )
      setIsAllowed(allowed)
    } catch (err) {
      console.error('AdminGuard role verification failed', err)
      setIsAllowed(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!isAllowed) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: 24 }}>
        <Card style={{ maxWidth: 500, textAlign: 'center' }}>
          <div style={{ marginBottom: 16 }}>
            <ShieldCheckIcon style={{ width: 48, height: 48, color: '#ff4d4f' }} />
          </div>
          <Alert
            message="Access Denied"
            description={
              <div>
                <p>You don&apos;t have permission to access this page.</p>
                {userInfo && (
                  <p style={{ color: '#8c8c8c', fontSize: 12, marginTop: 8 }}>
                    Current role: <strong>{userInfo.role || 'Unknown'}</strong>
                  </p>
                )}
              </div>
            }
            type="error"
            showIcon={false}
            style={{ marginBottom: 16 }}
          />
          <Button type="primary" icon={<ArrowLeft size={16} />} onClick={() => router.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
