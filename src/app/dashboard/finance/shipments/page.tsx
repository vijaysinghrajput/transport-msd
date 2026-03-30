'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Button, 
  Modal, 
  Form, 
  Select, 
  Tag,
  Row, 
  Col, 
  Typography,
  Card,
  message,
  Statistic,
  InputNumber,
  Input,
  Descriptions,
  Divider,
} from 'antd'
import { 
  TruckOutlined,
  EyeOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  SwapOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { shipmentService } from '@/services/operations-finance.service'
import { Shipment } from '@/types/operations-finance.types'
import { useState, useEffect, useMemo } from 'react'
import FinanceGuard from '@/components/FinanceGuard'
import { 
  PageHeader, 
  DataTable,
} from '@/components/finance'
import type { DateRange } from '@/components/finance'
import dayjs from 'dayjs'

const { Text } = Typography

// Status colors
const STATUS_COLORS: Record<string, string> = {
  scheduled: 'orange',
  in_transit: 'blue',
  delivered: 'cyan',
  completed: 'green',
  cancelled: 'red',
}

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: 'orange',
  partial: 'blue',
  paid: 'green',
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Scheduled',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const SHIPMENT_TYPE_LABELS: Record<string, string> = {
  distributor_to_warehouse: 'Dist → WH',
  distributor_to_site: 'Dist → Site',
  warehouse_to_site: 'WH → Site',
  warehouse_to_warehouse: 'WH → WH',
}

const SHIPMENT_TYPE_FULL_LABELS: Record<string, string> = {
  distributor_to_warehouse: 'Distributor to Warehouse',
  distributor_to_site: 'Distributor to Site',
  warehouse_to_site: 'Warehouse to Site',
  warehouse_to_warehouse: 'Warehouse to Warehouse',
}

export default function ShipmentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<Shipment | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [shipmentTypeFilter, setShipmentTypeFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | undefined>()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  
  // Create modal state
  const [selectedShipmentType, setSelectedShipmentType] = useState<string>('distributor_to_warehouse')
  const [selectedFromId, setSelectedFromId] = useState<string>('')
  const [selectedToId, setSelectedToId] = useState<string>('')
  const [selectedSites, setSelectedSites] = useState<any[]>([])
  const [paymentType, setPaymentType] = useState<string>('fixed')
  
  const [createForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const queryClient = useQueryClient()

  const { data: records, isLoading, refetch } = useQuery({
    queryKey: ['shipments', searchQuery, shipmentTypeFilter, statusFilter, paymentStatusFilter, dateRange],
    queryFn: () => shipmentService.getAll({ 
      searchQuery: searchQuery || undefined,
      shipmentType: shipmentTypeFilter,
      status: statusFilter,
      paymentStatus: paymentStatusFilter,
      dateRange,
    }),
  })

  const { data: analysis } = useQuery({
    queryKey: ['shipments-analysis', shipmentTypeFilter],
    queryFn: () => shipmentService.getAnalysis({ shipmentType: shipmentTypeFilter }),
  })

  const { data: shipmentTypes } = useQuery({
    queryKey: ['shipment-types'],
    queryFn: () => shipmentService.getShipmentTypes(),
  })

  // Queries for create modal
  const { data: distributors } = useQuery({
    queryKey: ['shipment-distributors'],
    queryFn: () => shipmentService.getDistributors(),
    enabled: isCreateModalOpen,
  })

  const { data: warehouses } = useQuery({
    queryKey: ['shipment-warehouses'],
    queryFn: () => shipmentService.getWarehouses(),
    enabled: isCreateModalOpen,
  })

  const { data: vehicles } = useQuery({
    queryKey: ['shipment-vehicles'],
    queryFn: () => shipmentService.getVehicles(),
    enabled: isCreateModalOpen,
  })

  const { data: leads } = useQuery({
    queryKey: ['shipment-leads'],
    queryFn: () => shipmentService.getLeadsForDelivery(),
    enabled: isCreateModalOpen && (selectedShipmentType === 'distributor_to_site' || selectedShipmentType === 'warehouse_to_site'),
  })

  // Derived from/to types based on shipment type
  const fromType = useMemo(() => {
    if (selectedShipmentType === 'distributor_to_warehouse' || selectedShipmentType === 'distributor_to_site') {
      return 'distributor'
    }
    return 'warehouse'
  }, [selectedShipmentType])

  const toType = useMemo(() => {
    if (selectedShipmentType === 'distributor_to_site' || selectedShipmentType === 'warehouse_to_site') {
      return 'site'
    }
    return 'warehouse'
  }, [selectedShipmentType])

  const fromLocations = useMemo(() => {
    return fromType === 'distributor' ? distributors || [] : warehouses || []
  }, [fromType, distributors, warehouses])

  // Reset from/to when shipment type changes
  useEffect(() => {
    setSelectedFromId('')
    setSelectedToId('')
    setSelectedSites([])
  }, [selectedShipmentType])

  // Auto-calculate total cost when payment type is per_km
  const watchedValues = Form.useWatch([], createForm)
  useEffect(() => {
    if (paymentType === 'per_km' && watchedValues) {
      const rate = watchedValues.per_km_rate || 0
      const distance = watchedValues.total_distance_km || 0
      const loading = watchedValues.loading_charge || 0
      const unloading = watchedValues.unloading_charge || 0
      const total = (rate * distance) + loading + unloading
      createForm.setFieldValue('total_cost', total)
    }
  }, [watchedValues?.per_km_rate, watchedValues?.total_distance_km, watchedValues?.loading_charge, watchedValues?.unloading_charge, paymentType, createForm])

  const createMutation = useMutation({
    mutationFn: (values: any) => {
      const fromLocation = fromLocations.find((l: any) => l.id === selectedFromId)
      const toLocation = toType === 'warehouse' ? warehouses?.find(w => w.id === selectedToId) : null
      
      return shipmentService.create({
        shipment_type: selectedShipmentType,
        from_type: fromType,
        from_id: selectedFromId,
        from_name: fromLocation?.name,
        to_type: toType,
        to_id: toType === 'warehouse' ? selectedToId : (selectedSites[0]?.id || ''),
        to_name: toType === 'warehouse' ? toLocation?.name : selectedSites.map(s => s.name).join(', '),
        to_address: values.to_address,
        vehicle_id: values.vehicle_id,
        payment_type: paymentType,
        per_km_rate: paymentType === 'per_km' ? values.per_km_rate : undefined,
        total_distance_km: paymentType === 'per_km' ? values.total_distance_km : undefined,
        loading_charge: values.loading_charge,
        unloading_charge: values.unloading_charge,
        total_cost: values.total_cost,
        payment_status: values.payment_status || 'pending',
        status: values.status || 'scheduled',
        notes: values.notes,
        selectedSites: selectedSites,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
      queryClient.invalidateQueries({ queryKey: ['shipments-analysis'] })
      setIsCreateModalOpen(false)
      setSelectedFromId('')
      setSelectedToId('')
      setSelectedSites([])
      setPaymentType('fixed')
      createForm.resetFields()
      message.success('Shipment created successfully')
    },
    onError: (error: any) => message.error(error.message || 'Failed to create shipment'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => shipmentService.update(id, {
      status: data.status,
      payment_status: data.payment_status,
      total_cost: data.total_cost,
      notes: data.notes,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
      queryClient.invalidateQueries({ queryKey: ['shipments-analysis'] })
      setIsEditModalOpen(false)
      setIsDetailModalOpen(false)
      editForm.resetFields()
      message.success('Record updated')
    },
    onError: () => message.error('Failed to update'),
  })

  const openEditModal = (record: Shipment) => {
    setSelectedRecord(record)
    editForm.setFieldsValue({
      status: record.status || 'scheduled',
      payment_status: record.payment_status || 'pending',
      total_cost: record.total_cost || 0,
      notes: record.notes,
    })
    setIsEditModalOpen(true)
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return '₹0'
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const columns = [
    {
      title: 'Shipment',
      key: 'shipment_number',
      width: 130,
      render: (_: any, r: Shipment) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1890ff' }}>{r.shipment_number}</div>
          <Tag color="default" style={{ margin: '4px 0 0', fontSize: 10 }}>
            {SHIPMENT_TYPE_LABELS[r.shipment_type] || r.shipment_type}
          </Tag>
        </div>
      ),
    },
    {
      title: 'From',
      key: 'from',
      width: 140,
      render: (_: any, r: Shipment) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: 12 }}>{r.from_name || '—'}</div>
          <div style={{ fontSize: 10, color: '#8c8c8c' }}>{r.from_type}</div>
        </div>
      ),
    },
    {
      title: 'To',
      key: 'to',
      width: 140,
      render: (_: any, r: Shipment) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: 12 }}>{r.to_name || '—'}</div>
          <div style={{ fontSize: 10, color: '#8c8c8c' }}>{r.to_type}</div>
        </div>
      ),
    },
    {
      title: 'Dates',
      width: 110,
      render: (_: any, r: Shipment) => (
        <div>
          {r.dispatch_date && (
            <div style={{ fontSize: 11 }}>
              <Text type="secondary">Dispatch: </Text>
              {formatDate(r.dispatch_date)}
            </div>
          )}
          {r.expected_delivery_date && (
            <div style={{ fontSize: 11 }}>
              <Text type="secondary">Expected: </Text>
              {formatDate(r.expected_delivery_date)}
            </div>
          )}
          {!r.dispatch_date && !r.expected_delivery_date && <Text type="secondary">—</Text>}
        </div>
      ),
    },
    {
      title: 'Cost',
      width: 100,
      render: (_: any, r: Shipment) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{formatCurrency(r.total_cost)}</div>
          {r.total_distance_km && (
            <div style={{ fontSize: 10, color: '#8c8c8c' }}>{r.total_distance_km} km</div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      width: 100,
      render: (_: any, r: Shipment) => (
        <Tag color={STATUS_COLORS[r.status || 'scheduled']} style={{ margin: 0, fontSize: 11 }}>
          {STATUS_LABELS[r.status || 'scheduled']}
        </Tag>
      ),
    },
    {
      title: 'Payment',
      width: 80,
      render: (_: any, r: Shipment) => (
        <Tag color={PAYMENT_STATUS_COLORS[r.payment_status || 'pending']} style={{ margin: 0 }}>
          {(r.payment_status || 'pending').charAt(0).toUpperCase() + (r.payment_status || 'pending').slice(1)}
        </Tag>
      ),
    },
    {
      title: '',
      width: 60,
      render: (_: any, r: Shipment) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedRecord(r); setIsDetailModalOpen(true) }}>
          View
        </Button>
      ),
    },
  ]

  const clearFilters = () => {
    setShipmentTypeFilter(undefined)
    setStatusFilter(undefined)
    setPaymentStatusFilter(undefined)
    setSearchQuery('')
    setDateRange(undefined)
  }

  const hasFilters = shipmentTypeFilter || statusFilter || paymentStatusFilter || searchQuery || dateRange

  const SHIPMENT_TYPE_OPTIONS = [
    { value: 'distributor_to_warehouse', label: 'Distributor → Warehouse', description: 'Ship inventory from distributor to warehouse' },
    { value: 'distributor_to_site', label: 'Distributor → Site', description: 'Ship directly from distributor to installation sites' },
    { value: 'warehouse_to_site', label: 'Warehouse → Site', description: 'Ship from warehouse to installation sites' },
    { value: 'warehouse_to_warehouse', label: 'Warehouse → Warehouse', description: 'Transfer between warehouses' },
  ]

  return (
    <FinanceGuard>
      <div style={{ padding: '16px 20px' }}>
        <PageHeader
          title="Shipments"
          subtitle="Manage shipments and transportation costs"
          icon={<TruckOutlined />}
          breadcrumbs={[{ label: 'Finance', href: '/dashboard/finance-operations' }, { label: 'Shipments' }]}
          actions={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
              Create Shipment
            </Button>
          }
        />

        {/* Filters */}
        <Card size="small" style={{ marginBottom: 12 }}>
          <Row gutter={[8, 8]} align="middle">
            <Col flex="auto">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <Select
                  placeholder="Type"
                  value={shipmentTypeFilter}
                  onChange={setShipmentTypeFilter}
                  allowClear
                  style={{ minWidth: 160 }}
                  size="small"
                  options={shipmentTypes?.map(t => ({ value: t, label: SHIPMENT_TYPE_FULL_LABELS[t] || t }))}
                />
                <Select
                  placeholder="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  allowClear
                  style={{ minWidth: 120 }}
                  size="small"
                  options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))}
                />
                <Select
                  placeholder="Payment"
                  value={paymentStatusFilter}
                  onChange={setPaymentStatusFilter}
                  allowClear
                  style={{ minWidth: 100 }}
                  size="small"
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'partial', label: 'Partial' },
                    { value: 'paid', label: 'Paid' },
                  ]}
                />
                {hasFilters && (
                  <Button size="small" type="link" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            </Col>
            <Col>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {records?.length || 0} records
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Stats Cards */}
        <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
          <Col xs={24} md={6}>
            <Card size="small" style={{ background: 'linear-gradient(135deg, #fff7e6 0%, #fff 100%)' }}>
              <Row gutter={8}>
                <Col span={12}>
                  <Statistic 
                    title={<Text style={{ fontSize: 11 }}>Shipments</Text>} 
                    value={analysis?.totalRecords || 0} 
                    valueStyle={{ fontSize: 18, fontWeight: 600 }} 
                  />
                </Col>
                <Col span={12}>
                  <Text style={{ fontSize: 11, color: '#8c8c8c' }}>Total Cost</Text>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fa8c16' }}>
                    ₹{((analysis?.total || 0) / 1000).toFixed(1)}K
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} md={18}>
            <Card size="small">
              <Row gutter={[16, 4]}>
                <Col span={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 14 }} />
                    <div>
                      <Text style={{ fontSize: 10, color: '#8c8c8c' }}>Completed</Text>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{analysis?.byStatus?.completed || 0}</div>
                    </div>
                  </div>
                </Col>
                <Col span={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TruckOutlined style={{ color: '#1890ff', fontSize: 14 }} />
                    <div>
                      <Text style={{ fontSize: 10, color: '#8c8c8c' }}>Delivered</Text>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{analysis?.byStatus?.delivered || 0}</div>
                    </div>
                  </div>
                </Col>
                <Col span={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ClockCircleOutlined style={{ color: '#faad14', fontSize: 14 }} />
                    <div>
                      <Text style={{ fontSize: 10, color: '#8c8c8c' }}>Scheduled</Text>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{analysis?.byStatus?.scheduled || 0}</div>
                    </div>
                  </div>
                </Col>
                <Col span={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <SwapOutlined style={{ color: '#722ed1', fontSize: 12 }} />
                    <div>
                      <Text style={{ fontSize: 9, color: '#8c8c8c' }}>Dist→WH</Text>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{analysis?.byType?.distributor_to_warehouse || 0}</div>
                    </div>
                  </div>
                </Col>
                <Col span={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <EnvironmentOutlined style={{ color: '#13c2c2', fontSize: 12 }} />
                    <div>
                      <Text style={{ fontSize: 9, color: '#8c8c8c' }}>WH→Site</Text>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{analysis?.byType?.warehouse_to_site || 0}</div>
                    </div>
                  </div>
                </Col>
                <Col span={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <DollarOutlined style={{ color: '#52c41a', fontSize: 12 }} />
                    <div>
                      <Text style={{ fontSize: 9, color: '#8c8c8c' }}>Paid</Text>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{analysis?.paid?.count || 0}</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <DataTable
          title="Shipments"
          dataSource={records}
          columns={columns}
          loading={isLoading}
          rowKey="id"
          onSearch={setSearchQuery}
          onRefresh={() => refetch()}
          searchPlaceholder="Search shipment, from, to..."
        />

        {/* Detail Modal */}
        <Modal
          title={`Shipment: ${selectedRecord?.shipment_number}`}
          open={isDetailModalOpen}
          onCancel={() => { setIsDetailModalOpen(false); setSelectedRecord(null) }}
          footer={[
            <Button key="edit" icon={<EditOutlined />} onClick={() => selectedRecord && openEditModal(selectedRecord)}>
              Edit
            </Button>,
            <Button key="close" type="primary" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>,
          ]}
          width={700}
        >
          {selectedRecord && (
            <>
              <Descriptions column={2} size="small" bordered>
                <Descriptions.Item label="Shipment Number">{selectedRecord.shipment_number}</Descriptions.Item>
                <Descriptions.Item label="Type">
                  <Tag>{SHIPMENT_TYPE_FULL_LABELS[selectedRecord.shipment_type] || selectedRecord.shipment_type}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="From">{selectedRecord.from_name || '—'}</Descriptions.Item>
                <Descriptions.Item label="To">{selectedRecord.to_name || '—'}</Descriptions.Item>
                <Descriptions.Item label="To Address" span={2}>{selectedRecord.to_address || '—'}</Descriptions.Item>
              </Descriptions>
              
              <Divider style={{ margin: '16px 0' }} />
              
              <Row gutter={16}>
                <Col span={8}>
                  <Card size="small" title="Status">
                    <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                      <Tag color={STATUS_COLORS[selectedRecord.status || 'scheduled']} style={{ fontSize: 12, width: 'fit-content' }}>
                        {STATUS_LABELS[selectedRecord.status || 'scheduled']}
                      </Tag>
                      <Tag color={PAYMENT_STATUS_COLORS[selectedRecord.payment_status || 'pending']} style={{ width: 'fit-content' }}>
                        {(selectedRecord.payment_status || 'pending').toUpperCase()}
                      </Tag>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="Cost">
                    <div>
                      <Text type="secondary">Total: </Text>
                      <Text strong style={{ fontSize: 16 }}>{formatCurrency(selectedRecord.total_cost)}</Text>
                    </div>
                    {selectedRecord.total_distance_km && (
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary">Distance: </Text>
                        <Text>{selectedRecord.total_distance_km} km</Text>
                      </div>
                    )}
                    {selectedRecord.per_km_rate && (
                      <div>
                        <Text type="secondary">Rate: </Text>
                        <Text>₹{selectedRecord.per_km_rate}/km</Text>
                      </div>
                    )}
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="Dates">
                    <div>
                      <Text type="secondary">Dispatch: </Text>
                      <Text>{formatDate(selectedRecord.dispatch_date)}</Text>
                    </div>
                    <div>
                      <Text type="secondary">Expected: </Text>
                      <Text>{formatDate(selectedRecord.expected_delivery_date)}</Text>
                    </div>
                    <div>
                      <Text type="secondary">Actual: </Text>
                      <Text>{formatDate(selectedRecord.actual_delivery_date)}</Text>
                    </div>
                  </Card>
                </Col>
              </Row>

              {(selectedRecord.loading_charge || selectedRecord.unloading_charge || selectedRecord.vehicle_payment_amount) && (
                <>
                  <Divider style={{ margin: '16px 0' }} />
                  <Card size="small" title="Charges">
                    <Row gutter={16}>
                      {selectedRecord.loading_charge && (
                        <Col span={8}>
                          <Text type="secondary">Loading: </Text>
                          <Text strong>{formatCurrency(selectedRecord.loading_charge)}</Text>
                        </Col>
                      )}
                      {selectedRecord.unloading_charge && (
                        <Col span={8}>
                          <Text type="secondary">Unloading: </Text>
                          <Text strong>{formatCurrency(selectedRecord.unloading_charge)}</Text>
                        </Col>
                      )}
                      {selectedRecord.vehicle_payment_amount && (
                        <Col span={8}>
                          <Text type="secondary">Vehicle: </Text>
                          <Text strong>{formatCurrency(selectedRecord.vehicle_payment_amount)}</Text>
                        </Col>
                      )}
                    </Row>
                  </Card>
                </>
              )}

              {selectedRecord.notes && (
                <>
                  <Divider style={{ margin: '16px 0' }} />
                  <Card size="small" title="Notes">
                    <Text>{selectedRecord.notes}</Text>
                  </Card>
                </>
              )}

              {selectedRecord.bill_document_url && (
                <>
                  <Divider style={{ margin: '16px 0' }} />
                  <Button 
                    type="link" 
                    icon={<FileTextOutlined />}
                    onClick={() => window.open(selectedRecord.bill_document_url, '_blank')}
                  >
                    View Document
                  </Button>
                </>
              )}
            </>
          )}
        </Modal>

        {/* Edit Modal */}
        <Modal
          title="Edit Shipment"
          open={isEditModalOpen}
          onCancel={() => { setIsEditModalOpen(false); editForm.resetFields() }}
          onOk={() => editForm.submit()}
          okText="Update"
          confirmLoading={updateMutation.isPending}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={(values) => selectedRecord && updateMutation.mutate({ id: selectedRecord.id, data: values })}
          >
            <Form.Item name="status" label="Status">
              <Select options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))} />
            </Form.Item>
            <Form.Item name="payment_status" label="Payment Status">
              <Select
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'partial', label: 'Partial' },
                  { value: 'paid', label: 'Paid' },
                ]}
              />
            </Form.Item>
            <Form.Item name="total_cost" label="Total Cost">
              <InputNumber
                style={{ width: '100%' }}
                formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/₹\s?|(,*)/g, '') as any}
              />
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Create Shipment Modal */}
        <Modal
          title="Create Shipment"
          open={isCreateModalOpen}
          onCancel={() => {
            setIsCreateModalOpen(false)
            setSelectedFromId('')
            setSelectedToId('')
            setSelectedSites([])
            setPaymentType('fixed')
            createForm.resetFields()
          }}
          onOk={() => createForm.submit()}
          confirmLoading={createMutation.isPending}
          width={700}
          destroyOnClose
        >
          <Form
            form={createForm}
            layout="vertical"
            onFinish={(values) => createMutation.mutate(values)}
            initialValues={{
              payment_status: 'pending',
              status: 'scheduled',
              per_km_rate: 0,
              total_distance_km: 0,
              loading_charge: 0,
              unloading_charge: 0,
              total_cost: 0,
            }}
          >
            {/* Shipment Type */}
            <Form.Item label="Shipment Type" required>
              <Select
                value={selectedShipmentType}
                onChange={setSelectedShipmentType}
                placeholder="Select shipment type"
                options={SHIPMENT_TYPE_OPTIONS}
                optionRender={(option) => (
                  <div>
                    <div style={{ fontWeight: 500 }}>{option.data.label}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{option.data.description}</Text>
                  </div>
                )}
              />
            </Form.Item>

            <Row gutter={16}>
              {/* From Location */}
              <Col span={12}>
                <Form.Item 
                  label={`From (${fromType === 'distributor' ? 'Distributor' : 'Warehouse'})`} 
                  required
                >
                  <Select
                    value={selectedFromId}
                    onChange={setSelectedFromId}
                    placeholder={`Select ${fromType}`}
                    options={fromLocations.map((loc: any) => ({
                      value: loc.id,
                      label: loc.name,
                      description: loc.city,
                    }))}
                    optionRender={(option) => (
                      <div>
                        <div>{option.data.label}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{option.data.description}</Text>
                      </div>
                    )}
                    loading={!distributors && !warehouses}
                  />
                </Form.Item>
              </Col>

              {/* To Location */}
              <Col span={12}>
                {toType === 'warehouse' ? (
                  <Form.Item label="To (Warehouse)" required>
                    <Select
                      value={selectedToId}
                      onChange={setSelectedToId}
                      placeholder="Select destination warehouse"
                      options={warehouses?.filter(w => w.id !== selectedFromId).map(w => ({
                        value: w.id,
                        label: w.name,
                        description: w.city,
                      }))}
                      optionRender={(option) => (
                        <div>
                          <div>{option.data.label}</div>
                          <Text type="secondary" style={{ fontSize: 12 }}>{option.data.description}</Text>
                        </div>
                      )}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item label="To (Installation Sites)" required>
                    <Select
                      mode="multiple"
                      value={selectedSites.map(s => s.id)}
                      onChange={(values: string[]) => {
                        const selected = leads?.filter((l: any) => values.includes(l.id)).map((l: any) => ({
                          id: l.id,
                          name: l.customer_name || l.name,
                          address: l.address,
                        })) || []
                        setSelectedSites(selected)
                      }}
                      placeholder="Select installation sites"
                      options={leads?.map((l: any) => ({
                        value: l.id,
                        label: l.customer_name || l.name,
                        description: l.branch_name,
                      }))}
                      optionRender={(option) => (
                        <div>
                          <div>{option.data.label}</div>
                          <Text type="secondary" style={{ fontSize: 12 }}>{option.data.description}</Text>
                        </div>
                      )}
                      loading={!leads}
                      maxTagCount={3}
                    />
                  </Form.Item>
                )}
              </Col>
            </Row>

            {/* Selected Sites Display */}
            {selectedSites.length > 0 && (
              <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
                <Text strong style={{ marginBottom: 8, display: 'block' }}>Delivery Points ({selectedSites.length})</Text>
                {selectedSites.map((site, index) => (
                  <div key={site.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontSize: 13 }}>{index + 1}. {site.name}</Text>
                    <Button 
                      type="text" 
                      size="small" 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={() => setSelectedSites(selectedSites.filter(s => s.id !== site.id))}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Vehicle */}
            <Form.Item name="vehicle_id" label="Vehicle (Optional)">
              <Select
                placeholder="Select vehicle"
                allowClear
                options={vehicles?.map(v => ({ value: v.id, label: v.name }))}
                loading={!vehicles}
              />
            </Form.Item>

            {/* Payment Type */}
            <Form.Item label="Payment Type" required>
              <Select
                value={paymentType}
                onChange={setPaymentType}
                options={[
                  { value: 'fixed', label: 'Fixed Amount' },
                  { value: 'per_km', label: 'Per Kilometer Rate' },
                ]}
              />
            </Form.Item>

            {/* Payment Details */}
            {paymentType === 'per_km' ? (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="per_km_rate" label="Rate per KM (₹)">
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="total_distance_km" label="Total Distance (KM)">
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="loading_charge" label="Loading (₹)">
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="unloading_charge" label="Unloading (₹)">
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="total_cost" label="Total Cost (₹)">
                      <InputNumber style={{ width: '100%' }} disabled />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ) : (
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="loading_charge" label="Loading (₹)">
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="unloading_charge" label="Unloading (₹)">
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="total_cost" label="Total Cost (₹)" required>
                    <InputNumber 
                      style={{ width: '100%' }} 
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value?.replace(/,/g, '') as any}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="status" label="Status">
                  <Select
                    options={[
                      { value: 'scheduled', label: 'Scheduled' },
                      { value: 'in_transit', label: 'In Transit' },
                      { value: 'delivered', label: 'Delivered' },
                      { value: 'cancelled', label: 'Cancelled' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="payment_status" label="Payment Status">
                  <Select
                    options={[
                      { value: 'pending', label: 'Pending' },
                      { value: 'partial', label: 'Partial' },
                      { value: 'paid', label: 'Paid' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="to_address" label="Destination Address">
              <Input.TextArea rows={2} placeholder="Enter destination address (optional)" />
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={2} placeholder="Additional notes..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </FinanceGuard>
  )
}
