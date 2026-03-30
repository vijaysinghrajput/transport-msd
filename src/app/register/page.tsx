"use client"

import { Card, Typography, Button, Form, Input, message } from "antd"
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons"
import { useRouter } from "next/navigation"

const { Title, Text } = Typography

export default function RegisterPage() {
  const router = useRouter()
  const [form] = Form.useForm()

  const handleRegister = async (values: any) => {
    try {
      message.info('Registration is currently disabled. Please contact administrator.')
      router.push('/login')
    } catch (error) {
      message.error('Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <Title level={2} className="text-blue-600 mb-2">
            🌞 Mudrabase Solar CRM
          </Title>
          <Text type="secondary">
            Create New Account
          </Text>
        </div>
        
        <Form
          form={form}
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter your full name!' },
              { min: 2, message: 'Name must be at least 2 characters!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Enter your full name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Enter email address"
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
              prefix={<LockOutlined />} 
              placeholder="Enter password"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              className="h-12"
            >
              Register
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text type="secondary">
              Already have an account?{' '}
              <Button type="link" onClick={() => router.push('/login')}>
                Sign In
              </Button>
            </Text>
          </div>

          <div className="mt-6 text-center">
            <Text type="secondary" className="text-xs">
              Contact admin for role assignment after registration
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}