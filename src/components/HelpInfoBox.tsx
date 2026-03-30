'use client'

import React, { useState } from 'react'
import { Alert, Button, Space, Typography } from 'antd'
import { InfoCircleOutlined, CloseOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

interface HelpInfoBoxProps {
  titleEn: string
  titleHi: string
  stepsEn: string[]
  stepsHi: string[]
  tipsEn?: string[]
  tipsHi?: string[]
}

export default function HelpInfoBox({ 
  titleEn, 
  titleHi, 
  stepsEn, 
  stepsHi, 
  tipsEn, 
  tipsHi 
}: HelpInfoBoxProps) {
  const [visible, setVisible] = useState(true)
  const [language, setLanguage] = useState<'en' | 'hi'>('en')

  if (!visible) {
    return (
      <Button
        icon={<InfoCircleOutlined />}
        onClick={() => setVisible(true)}
        style={{ marginBottom: 16 }}
      >
        {language === 'en' ? 'Show Help' : 'मदद दिखाएं'}
      </Button>
    )
  }

  return (
    <Alert
      message={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <InfoCircleOutlined style={{ fontSize: 20 }} />
            <Title level={5} style={{ margin: 0 }}>
              {language === 'en' ? titleEn : titleHi}
            </Title>
          </Space>
          <Space>
            <Button
              size="small"
              type={language === 'en' ? 'primary' : 'default'}
              onClick={() => setLanguage('en')}
            >
              English
            </Button>
            <Button
              size="small"
              type={language === 'hi' ? 'primary' : 'default'}
              onClick={() => setLanguage('hi')}
            >
              हिंदी
            </Button>
            <Button
              size="small"
              icon={<CloseOutlined />}
              onClick={() => setVisible(false)}
            />
          </Space>
        </div>
      }
      description={
        <div style={{ marginTop: 12 }}>
          <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
            {language === 'en' ? '📋 How to Use:' : '📋 उपयोग कैसे करें:'}
          </Text>
          <ol style={{ paddingLeft: 20, marginBottom: 12 }}>
            {(language === 'en' ? stepsEn : stepsHi).map((step, index) => (
              <li key={index} style={{ marginBottom: 6 }}>
                <Text>{step}</Text>
              </li>
            ))}
          </ol>
          {tipsEn && tipsHi && (tipsEn.length > 0 || tipsHi.length > 0) && (
            <>
              <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
                {language === 'en' ? '💡 Tips:' : '💡 सुझाव:'}
              </Text>
              <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                {(language === 'en' ? tipsEn : tipsHi).map((tip, index) => (
                  <li key={index} style={{ marginBottom: 6 }}>
                    <Text>{tip}</Text>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      }
      type="info"
      style={{ marginBottom: 24 }}
      showIcon={false}
    />
  )
}
