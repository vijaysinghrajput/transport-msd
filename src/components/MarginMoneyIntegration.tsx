/**
 * Margin Money Integration Component for Quotations
 * Allows seamless integration of bank margin requirements into quotations
 */

'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Select, 
  InputNumber, 
  Switch, 
  Button, 
  Alert, 
  Descriptions, 
  Typography, 
  Space, 
  Tag, 
  Divider,
  Tooltip,
  Modal,
  Table,
  Row,
  Col
} from 'antd'
import { 
  BankOutlined, 
  CalculatorOutlined, 
  InfoCircleOutlined,
  DollarOutlined,
  PercentageOutlined
} from '@ant-design/icons'
import { MarginMoneyService, formatCurrency, formatPercentage } from '@/lib/marginMoneyService'
import { 
  MarginMoneyConfig, 
  MarginDistributionStrategy,
  MARGIN_DISTRIBUTION_STRATEGIES,
  MarginMoneyCalculation 
} from '@/types/margin-money'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

interface MarginMoneyIntegrationProps {
  quotationData: {
    total_amount: number
    installation_cost: number
    raw_material_cost: number
    system_capacity_kw: number
    application_type: 'residential' | 'commercial' | 'industrial'
  }
  onMarginApplied: (updatedQuotation: any) => void
  disabled?: boolean
}

export default function MarginMoneyIntegration({ 
  quotationData, 
  onMarginApplied, 
  disabled = false 
}: MarginMoneyIntegrationProps) {
  const [marginConfigs, setMarginConfigs] = useState<MarginMoneyConfig[]>([])
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [customMarginPercentage, setCustomMarginPercentage] = useState<number>(10)
  const [selectedMarginConfig, setSelectedMarginConfig] = useState<MarginMoneyConfig | null>(null)
  const [distributionStrategy, setDistributionStrategy] = useState<MarginDistributionStrategy>('additional_costs')
  const [marginEnabled, setMarginEnabled] = useState(false)
  const [calculation, setCalculation] = useState<MarginMoneyCalculation | null>(null)
  const [previewModalVisible, setPreviewModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Common banks list for display
  const commonBanks = [
    'State Bank of India',
    'HDFC Bank', 
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'Indian Bank',
    'Central Bank of India',
    'IDFC First Bank',
    'Kotak Mahindra Bank',
    'Yes Bank',
    'IndusInd Bank',
    'Federal Bank'
  ]

  // Preset margin percentages
  const presetMarginPercentages = [
    { label: '5%', value: 5 },
    { label: '10%', value: 10 },
    { label: '15%', value: 15 },
    { label: '20%', value: 20 },
    { label: 'Custom', value: 'custom' }
  ]

  // Load margin configurations on component mount
  useEffect(() => {
    loadMarginConfigs()
  }, [quotationData])

  const loadMarginConfigs = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/margin-money?loanAmount=${quotationData.total_amount}&systemType=${quotationData.application_type}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch margin configurations')
      }
      
      const data = await response.json()
      setMarginConfigs(data)
    } catch (error) {
      console.error('Error loading margin configs:', error)
      // Fallback to service method for demo
      const applicableBanks = MarginMoneyService.getApplicableBanks(
        quotationData.total_amount,
        quotationData.application_type
      )
      setMarginConfigs(applicableBanks)
    } finally {
      setLoading(false)
    }
  }

  const handleBankSelection = (bankName: string) => {
    setSelectedBank(bankName)
    // Create a simple config for calculation
    const config: MarginMoneyConfig = {
      id: 'temp',
      bank_name: bankName,
      margin_percentage: customMarginPercentage,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setSelectedMarginConfig(config)
    
    if (marginEnabled) {
      calculateMargin(config)
    }
  }

  const handleMarginPercentageChange = (percentage: number) => {
    setCustomMarginPercentage(percentage)
    
    if (selectedMarginConfig && marginEnabled) {
      const updatedConfig = { ...selectedMarginConfig, margin_percentage: percentage }
      setSelectedMarginConfig(updatedConfig)
      calculateMargin(updatedConfig)
    }
  }

  const handleDistributionStrategyChange = (strategy: MarginDistributionStrategy) => {
    setDistributionStrategy(strategy)
    if (selectedMarginConfig && marginEnabled) {
      calculateMargin(selectedMarginConfig)
    }
  }

  const calculateMargin = (config: MarginMoneyConfig) => {
    const calc = MarginMoneyService.calculateMarginMoney(
      quotationData.total_amount,
      config.margin_percentage,
      quotationData.raw_material_cost,
      quotationData.installation_cost,
      quotationData.raw_material_cost,
      distributionStrategy
    )
    
    calc.bank_name = config.bank_name
    setCalculation(calc)
  }

  const handleMarginToggle = (enabled: boolean) => {
    setMarginEnabled(enabled)
    
    if (enabled && selectedMarginConfig) {
      calculateMargin(selectedMarginConfig)
    } else {
      setCalculation(null)
      // Reset quotation to original values
      onMarginApplied(quotationData)
    }
  }

  const applyMargin = () => {
    if (!selectedMarginConfig || !calculation) return

    const updatedQuotation = MarginMoneyService.applyMarginToQuotation(
      quotationData,
      selectedMarginConfig.margin_percentage,
      selectedMarginConfig.bank_name,
      distributionStrategy
    )

    onMarginApplied(updatedQuotation)
    setPreviewModalVisible(false)
  }

  const previewQuotation = () => {
    if (!selectedMarginConfig || !calculation) return
    setPreviewModalVisible(true)
  }

  const getStrategyDescription = (strategy: MarginDistributionStrategy) => {
    switch (strategy) {
      case 'additional_costs':
        return 'Add as separate line item: Bank processing & documentation charges'
      case 'installation_cost':
        return 'Include in installation cost: Enhanced installation package with premium services'
      case 'proportional':
        return 'Distribute proportionally: Spread across system components and installation'
      case 'mixed':
        return 'Mixed approach: 60% in installation cost, 40% as additional charges'
      default:
        return 'Additional charges will be added to the quotation'
    }
  }

  // Update MARGIN_DISTRIBUTION_STRATEGIES for legitimate business reasons
  const updatedDistributionStrategies = [
    {
      strategy: 'additional_costs' as MarginDistributionStrategy,
      display_name: 'Transportation & Logistics',
      description: 'Additional charges for specialized transportation and logistics'
    },
    {
      strategy: 'installation_cost' as MarginDistributionStrategy, 
      display_name: 'Enhanced Installation Package',
      description: 'Premium installation services with extended warranty'
    },
    {
      strategy: 'proportional' as MarginDistributionStrategy,
      display_name: 'Quality Upgrade Package',
      description: 'Enhanced components and premium system configuration'
    },
    {
      strategy: 'mixed' as MarginDistributionStrategy,
      display_name: 'Comprehensive Service Package',
      description: 'Complete package with premium installation + logistics (60/40 split)'
    }
  ]

  const generateLineItems = () => {
    if (!selectedMarginConfig || !calculation) return []

    return MarginMoneyService.generateQuotationLineItems(
      quotationData,
      {
        bank_name: selectedMarginConfig.bank_name,
        margin_percentage: selectedMarginConfig.margin_percentage,
        distribution_strategy: distributionStrategy
      }
    )
  }

  return (
    <Card 
      title={
        <Space>
          <BankOutlined />
          <span>Bank Margin Money Integration</span>
          <Tooltip title="Seamlessly include bank margin requirements in quotation pricing">
            <InfoCircleOutlined style={{ color: '#1890ff' }} />
          </Tooltip>
        </Space>
      }
      size="small"
    >
      {/* Margin Money Toggle */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Switch
            checked={marginEnabled}
            onChange={handleMarginToggle}
            disabled={disabled}
          />
          <Text strong>Include Bank Margin Money</Text>
          {marginEnabled && (
            <Tag color="blue">Margin Applied</Tag>
          )}
        </Space>
        <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
          Add bank margin requirements as additional costs in the quotation
        </Paragraph>
      </div>

      {marginEnabled && (
        <>
          {/* Bank Selection */}
          <div style={{ marginBottom: 16 }}>
            <Text strong>Select Bank:</Text>
            <Select
              value={selectedBank}
              onChange={handleBankSelection}
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Choose financing bank"
              disabled={disabled}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {commonBanks.map(bankName => (
                <Option key={bankName} value={bankName}>
                  <Space>
                    <BankOutlined />
                    <span>{bankName}</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </div>

          {/* Margin Percentage Selection */}
          {selectedBank && (
            <div style={{ marginBottom: 16 }}>
              <Text strong>Margin Percentage:</Text>
              <Row gutter={8} style={{ marginTop: 8 }}>
                {presetMarginPercentages.map(preset => (
                  <Col key={preset.value} span={4}>
                    <Button
                      type={customMarginPercentage === preset.value ? 'primary' : 'default'}
                      onClick={() => preset.value !== 'custom' && handleMarginPercentageChange(preset.value as number)}
                      style={{ width: '100%' }}
                      disabled={disabled}
                    >
                      {preset.label}
                    </Button>
                  </Col>
                ))}
                <Col span={4}>
                  <InputNumber
                    value={customMarginPercentage}
                    onChange={(value) => value && handleMarginPercentageChange(value)}
                    min={1}
                    max={50}
                    style={{ width: '100%' }}
                    placeholder="Custom %"
                    disabled={disabled}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value?.replace('%', '') as any}
                  />
                </Col>
              </Row>
            </div>
          )}

          {/* Distribution Strategy */}
          {selectedMarginConfig && (
            <div style={{ marginBottom: 16 }}>
              <Text strong>Integration Method:</Text>
              <Text type="secondary" style={{ display: 'block', fontSize: 12, marginBottom: 8 }}>
                Choose how to include margin money in the quotation
              </Text>
              <Select
                value={distributionStrategy}
                onChange={handleDistributionStrategyChange}
                style={{ width: '100%' }}
                disabled={disabled}
              >
                {updatedDistributionStrategies.map(strategy => (
                  <Option key={strategy.strategy} value={strategy.strategy}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{strategy.display_name}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{strategy.description}</div>
                    </div>
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {/* Calculation Summary */}
          {calculation && (
            <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9' }}>
              <Row gutter={16}>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#666' }}>Original Amount</div>
                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {formatCurrency(calculation.base_quotation_amount)}
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#666' }}>Margin ({calculation.margin_percentage}%)</div>
                    <div style={{ fontSize: 16, fontWeight: 'bold', color: '#f59e0b' }}>
                      +{formatCurrency(calculation.margin_amount)}
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#666' }}>Bank</div>
                    <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                      {selectedBank}
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#666' }}>Final Amount</div>
                    <div style={{ fontSize: 18, fontWeight: 'bold', color: '#0ea5e9' }}>
                      {formatCurrency(calculation.adjusted_quotation_amount)}
                    </div>
                  </div>
                </Col>
              </Row>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {getStrategyDescription(distributionStrategy)}
                </Text>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Space>
                  <Button 
                    type="primary" 
                    size="small"
                    icon={<CalculatorOutlined />}
                    onClick={previewQuotation}
                  >
                    Preview Quotation
                  </Button>
                  <Button 
                    type="default" 
                    size="small"
                    onClick={applyMargin}
                    style={{ backgroundColor: '#10b981', borderColor: '#10b981', color: 'white' }}
                  >
                    Apply to Quotation
                  </Button>
                </Space>
              </div>
            </Card>
          )}

          {/* Information Alert */}
          {selectedBank && !calculation && (
            <Alert
              message={`${selectedBank} Financing`}
              description={`Adding ${customMarginPercentage}% margin for ${selectedBank} loan requirements. The margin will be seamlessly integrated into the quotation pricing.`}
              type="info"
              icon={<BankOutlined />}
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Success Message after calculation */}
          {calculation && selectedBank && (
            <Alert
              message="Margin Successfully Calculated"
              description={`${formatCurrency(calculation.margin_amount)} margin for ${selectedBank} has been calculated and is ready to be integrated into the quotation.`}
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
        </>
      )}

      {/* Preview Modal */}
      <Modal
        title={
          <Space>
            <BankOutlined style={{ color: '#0ea5e9' }} />
            <span>Quotation Preview with {selectedBank} Margin</span>
          </Space>
        }
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        onOk={applyMargin}
        okText="Apply to Quotation"
        width={800}
      >
        {calculation && selectedMarginConfig && (
          <div>
            <Alert
              message="Margin Money Integration Summary"
              description={`${formatCurrency(calculation.margin_amount)} (${calculation.margin_percentage}%) for ${selectedBank} financing has been seamlessly integrated into the quotation.`}
              type="success"
              style={{ marginBottom: 16 }}
            />

            <div style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>What will be added to quotation:</Text>
              {distributionStrategy === 'additional_costs' && (
                <div>• Bank Processing & Documentation Charges: {formatCurrency(calculation.margin_amount)}</div>
              )}
              {distributionStrategy === 'installation_cost' && (
                <div>• Enhanced Installation Package: {formatCurrency(calculation.margin_amount)} added to installation cost</div>
              )}
              {distributionStrategy === 'proportional' && (
                <div>• System Enhancement: {formatCurrency(calculation.margin_amount)} distributed across all components</div>
              )}
              {distributionStrategy === 'mixed' && (
                <div>
                  <div>• Enhanced Installation: {formatCurrency(calculation.margin_amount * 0.6)}</div>
                  <div>• Processing Charges: {formatCurrency(calculation.margin_amount * 0.4)}</div>
                </div>
              )}
            </div>
            
            <Table
              dataSource={generateLineItems()}
              columns={[
                {
                  title: 'Description',
                  dataIndex: 'description',
                  key: 'description',
                  render: (text, record: any) => (
                    <div>
                      <div style={{ fontWeight: 500 }}>{text}</div>
                      {record.details && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {record.details}
                        </Text>
                      )}
                    </div>
                  )
                },
                {
                  title: 'Amount',
                  dataIndex: 'amount',
                  key: 'amount',
                  align: 'right',
                  render: (amount) => (
                    <Text strong style={{ fontSize: 16 }}>
                      {formatCurrency(amount)}
                    </Text>
                  )
                }
              ]}
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row style={{ backgroundColor: '#f0f9ff' }}>
                  <Table.Summary.Cell index={0}>
                    <Text strong style={{ fontSize: 16 }}>Total Quotation Amount</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <Text strong style={{ fontSize: 18, color: '#0ea5e9' }}>
                      {formatCurrency(calculation.adjusted_quotation_amount)}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />

            <div style={{ marginTop: 16, padding: 12, backgroundColor: '#fffbeb', borderRadius: 6, border: '1px solid #fbbf24' }}>
              <Text style={{ fontSize: 12, color: '#92400e' }}>
                <strong>Note:</strong> The margin amount will appear as justified business costs in the quotation, 
                making the financing process smooth for the customer while meeting {selectedBank}'s requirements.
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  )
}