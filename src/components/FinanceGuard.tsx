'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Alert, Button, Spin } from 'antd'
import { ShieldCheckIcon, ArrowLeft } from 'lucide-react'
import { UserRole } from '@/config/roles'

interface FinanceGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

const DEFAULT_ALLOWED_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.OPS_HEAD,
  UserRole.BRANCH_MANAGER,
  UserRole.INSTALLATION_TEAM
]

export default function FinanceGuard({ children, allowedRoles = DEFAULT_ALLOWED_ROLES }: FinanceGuardProps) {
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

      setIsAllowed(allowedRoles.includes(user.role))
    } catch (err) {
      console.error('FinanceGuard role verification failed', err)
      setIsAllowed(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <div className="text-center">
            <ShieldCheckIcon className="mx-auto mb-4 text-red-500" size={54} />
            <h2 className="text-xl font-semibold mb-2">Restricted Access</h2>
            <p className="text-gray-600 mb-4">
              Only authorised finance leadership can manage these records.
            </p>
            {userInfo && (
              <Alert
                message={`Current Role: ${userInfo.role || 'unknown'}`}
                type="warning"
                className="mb-4"
              />
            )}
            <Button
              type="primary"
              icon={<ArrowLeft size={16} />}
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

