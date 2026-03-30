'use client'

import { useState, useEffect } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Avatar, 
  Divider,
  Space,
  Tag,
  App
} from 'antd'
import { 
  UserOutlined, 
  LockOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  SaveOutlined,
  KeyOutlined
} from '@ant-design/icons'
import { supabase } from '@/lib/supabaseClient'

const { Title, Text } = Typography

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  employee_id?: string
  branch_id?: string
  created_at: string
}

interface PasswordChangeForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfilePage() {
  const { message } = App.useApp()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      
      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      if (!user.id) {
        message.error('User not found. Please login again.')
        return
      }

      // Fetch complete user profile from database
      const { data: profile, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          phone,
          role,
          employee_id,
          branch_id,
          created_at,
          branches:branch_id(name, branch_number)
        `)
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        message.error('Failed to load profile information')
        return
      }

      setUserProfile(profile)
      
      // Set form values
      profileForm.setFieldsValue({
        name: profile.name,
        email: profile.email,
        phone: profile.phone
      })

    } catch (error) {
      console.error('Error loading profile:', error)
      message.error('Failed to load profile information')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (values: any) => {
    try {
      if (!userProfile) return

      const { error } = await supabase
        .from('users')
        .update({
          name: values.name,
          phone: values.phone
        })
        .eq('id', userProfile.id)

      if (error) {
        console.error('Error updating profile:', error)
        message.error('Failed to update profile')
        return
      }

      // Update localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      user.name = values.name
      localStorage.setItem('user', JSON.stringify(user))

      message.success('Profile updated successfully!')
      loadUserProfile() // Reload to get fresh data
    } catch (error) {
      console.error('Error updating profile:', error)
      message.error('Failed to update profile')
    }
  }

  const handlePasswordChange = async (values: PasswordChangeForm) => {
    try {
      setPasswordLoading(true)

      if (!userProfile) {
        message.error('User profile not loaded')
        return
      }

      // Call our API endpoint for password change
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userProfile.id,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        })
      })

      const result = await response.json()

      if (!response.ok) {
        message.error(result.error || 'Failed to change password')
        return
      }

      message.success('Password updated successfully!')
      passwordForm.resetFields()
    } catch (error) {
      console.error('Error changing password:', error)
      message.error('Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: '#f50',
      branch_manager: '#2db7f5',
      staff: '#87d068',
      agent: '#108ee9',
      salesperson: '#722ed1',
      installation_team: '#fa8c16',
      subsidy_team: '#13c2c2',
      sales_manager: '#eb2f96'
    }
    return colors[role] || '#666'
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text>Loading profile...</Text>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text type="danger">Failed to load profile information</Text>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <UserOutlined style={{ marginRight: 8 }} />
        Profile Settings
      </Title>

      <Row gutter={[24, 24]}>
        {/* Profile Information */}
        <Col xs={24} lg={12}>
          <Card title="Profile Information" style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                style={{ 
                  backgroundColor: getRoleBadgeColor(userProfile.role),
                  marginBottom: 16
                }}
              >
                {userProfile.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {userProfile.name}
                </Title>
                <Text type="secondary">{userProfile.email}</Text>
                <br />
                <Tag 
                  color={getRoleBadgeColor(userProfile.role)}
                  style={{ marginTop: 8 }}
                >
                  {userProfile.role?.replace('_', ' ').toUpperCase()}
                </Tag>
              </div>
            </div>

            <Divider />

            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleProfileUpdate}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  { required: true, message: 'Please enter your name' },
                  { min: 2, message: 'Name must be at least 2 characters' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />}
                  placeholder="Enter your full name"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
              >
                <Input 
                  prefix={<UserOutlined />}
                  disabled
                  placeholder="Email cannot be changed"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' }
                ]}
              >
                <Input 
                  placeholder="Enter your phone number"
                  maxLength={10}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  block
                >
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Change Password */}
        <Col xs={24} lg={12}>
          <Card title="Change Password" style={{ height: '100%' }}>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">
                Update your password to keep your account secure. Make sure to use a strong password.
              </Text>
            </div>

            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[
                  { required: true, message: 'Please enter your current password' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter current password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter a new password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                  }
                ]}
              >
                <Input.Password
                  prefix={<KeyOutlined />}
                  placeholder="Enter new password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Passwords do not match'))
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<KeyOutlined />}
                  placeholder="Confirm new password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  icon={<LockOutlined />}
                  loading={passwordLoading}
                  block
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Additional Information */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Account Information">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text strong>Employee ID:</Text>
                  <br />
                  <Text>{userProfile.employee_id || 'Not assigned'}</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text strong>Role:</Text>
                  <br />
                  <Tag color={getRoleBadgeColor(userProfile.role)}>
                    {userProfile.role?.replace('_', ' ').toUpperCase()}
                  </Tag>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text strong>Branch:</Text>
                  <br />
                  <Text>{(userProfile as any).branches?.name || 'Not assigned'}</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text strong>Member Since:</Text>
                  <br />
                  <Text>
                    {new Date(userProfile.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
