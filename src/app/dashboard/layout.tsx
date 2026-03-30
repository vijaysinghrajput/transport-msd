'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authProvider } from '../../lib/authProvider'
import MobileAppLayout from '../../components/MobileAppLayout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const authResult = await authProvider.check()
      if (!authResult.authenticated) {
        router.push('/login')
        return
      }
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <span>Loading...</span>
      </div>
    )
  }

  return <MobileAppLayout>{children}</MobileAppLayout>
}