'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Form, Input, Button, Alert, Typography, Spin, Space, Tooltip, Switch } from 'antd'
import { MailOutlined, LockOutlined, CarOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { authProvider } from '../../lib/authProvider'

const { Title, Text } = Typography


export default function LoginPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await authProvider.check()
        if (result.authenticated) {
          router.push('/dashboard')
          return
        }
      } catch (err) {
        console.log('No active session found')
      } finally {
        setCheckingSession(false)
      }
    }

    checkAuth()
  }, [router])

  // Load saved credentials if remember me was enabled
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true'
    
    if (savedEmail && savedRememberMe) {
      form.setFieldsValue({ email: savedEmail })
      setRememberMe(true)
    }
  }, [form])

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true)
    setError(null)

    try {
      const result = await authProvider.login(values)
      
      if (result.success) {
        console.log('Login successful, redirecting...')
        
        // Save credentials if remember me is enabled
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', values.email)
          localStorage.setItem('rememberMe', 'true')
        } else {
          localStorage.removeItem('rememberedEmail')
          localStorage.removeItem('rememberMe')
        }
        
        // Force a small delay to ensure session is saved
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      } else {
        console.error('Login failed:', result.error)
        setError(result.error?.message || 'Login failed')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Text>Checking authentication...</Text>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .login-card {
          animation: fadeInUp 0.6s ease-out;
        }
        
        
        .logo-icon {
          animation: pulse 2s infinite;
        }
      `}</style>
      <div className="w-full max-w-lg">
        <Card className="login-card shadow-2xl border-0 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 -mx-6 -mt-6 px-6 py-8 text-white">
            <div className="mb-4">
              <CarOutlined className="text-5xl logo-icon" />
            </div>
            <Title level={2} className="text-white mb-2">
              Mudrabase Transportation
            </Title>
            <Text className="text-blue-100">
              Transportation & Vehicle Management System
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-4 rounded-lg"
              closable
              onClose={() => setError(null)}
            />
          )}

          {/* Login Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="text-gray-400" />} 
                placeholder="Enter your email address"
                autoComplete="email"
                disabled={loading}
                className="h-12 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />} 
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                className="h-12 rounded-lg"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            {/* Remember Me */}
            <Form.Item>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Switch 
                    checked={rememberMe} 
                    onChange={setRememberMe}
                    size="small"
                  />
                  <Text className="ml-2">Remember me</Text>
                </div>
                <Tooltip title="Contact admin for password reset">
                  <Button type="link" size="small" className="p-0">
                    Forgot password?
                  </Button>
                </Tooltip>
              </div>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                className="h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 border-0 font-medium text-lg"
                disabled={loading}
              >
                {loading ? (
                  <Space>
                    <Spin size="small" />
                    Signing in...
                  </Space>
                ) : (
                  <Space>
                    <UserOutlined />
                    Sign In
                  </Space>
                )}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <div className="text-center mt-6 pt-4 border-t border-gray-100">
            <Text type="secondary" className="text-xs">
              © 2026 Mudrabase Transportation. All rights reserved.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  )
}
