import { supabase } from '@/lib/supabaseClient'

// ============ Vehicle Service ============
export const vehicleService = {
  async getAll(filters?: { status?: string; branchId?: string; vehicleType?: string }) {
    let query = supabase
      .from('solar_transportation_vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.status === 'active') query = query.eq('is_active', true)
    if (filters?.status === 'inactive') query = query.eq('is_active', false)
    if (filters?.branchId) query = query.eq('branch_id', filters.branchId)
    if (filters?.vehicleType) query = query.eq('vehicle_type', filters.vehicleType)

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('solar_transportation_vehicles')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(vehicle: Record<string, any>) {
    const insertData = {
      vehicle_number: vehicle.vehicle_number,
      vehicle_type: vehicle.vehicle_type || null,
      vehicle_model: vehicle.vehicle_model || null,
      capacity_kg: vehicle.capacity_kg || null,
      capacity_cubic_meters: vehicle.capacity_cubic_meters || null,
      driver_name: vehicle.driver_name || null,
      driver_contact: vehicle.driver_contact || null,
      driver_license_number: vehicle.driver_license_number || null,
      owner_type: vehicle.owner_type || 'company',
      vendor_name: vehicle.vendor_name || null,
      vendor_contact: vehicle.vendor_contact || null,
      is_active: vehicle.is_active ?? true,
      notes: vehicle.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('solar_transportation_vehicles')
      .insert(insertData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, vehicle: Record<string, any>) {
    const { data, error } = await supabase
      .from('solar_transportation_vehicles')
      .update({ ...vehicle, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('solar_transportation_vehicles')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async getStats() {
    const { data, error } = await supabase
      .from('solar_transportation_vehicles')
      .select('*')
    if (error) throw error

    const vehicles = data || []
    const now = new Date()
    return {
      total: vehicles.length,
      active: vehicles.filter(v => v.is_active).length,
      inactive: vehicles.filter(v => !v.is_active).length,
      insuranceExpiring: vehicles.filter(v => {
        if (!v.insurance_expiry) return false
        const diff = new Date(v.insurance_expiry).getTime() - now.getTime()
        return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000
      }).length,
      fitnessExpiring: vehicles.filter(v => {
        if (!v.fitness_expiry) return false
        const diff = new Date(v.fitness_expiry).getTime() - now.getTime()
        return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000
      }).length,
      byType: vehicles.reduce((acc: Record<string, number>, v) => {
        const type = v.vehicle_type || 'unknown'
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {}),
    }
  },
}

// ============ Shipment Service ============
export const shipmentService = {
  async getAll(filters?: {
    searchQuery?: string
    shipmentType?: string
    status?: string
    paymentStatus?: string
    dateRange?: { start: string; end: string }
  }) {
    const { data, error } = await supabase
      .from('solar_shipments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    let records = data || []

    if (filters?.shipmentType) records = records.filter(r => r.shipment_type === filters.shipmentType)
    if (filters?.status) records = records.filter(r => r.status === filters.status)
    if (filters?.paymentStatus) records = records.filter(r => r.payment_status === filters.paymentStatus)
    if (filters?.dateRange) {
      records = records.filter(r => {
        const created = new Date(r.created_at)
        return created >= new Date(filters.dateRange!.start) && created <= new Date(filters.dateRange!.end)
      })
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      records = records.filter(r =>
        r.shipment_number?.toLowerCase().includes(q) ||
        r.from_name?.toLowerCase().includes(q) ||
        r.to_name?.toLowerCase().includes(q)
      )
    }

    return records
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('solar_shipments')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(payload: Record<string, any>) {
    const timestamp = Date.now().toString().slice(-6)
    const shipmentNumber = `TR-${timestamp}`

    const insertData: Record<string, any> = {
      shipment_number: shipmentNumber,
      shipment_type: payload.shipment_type || 'trip',
      from_name: payload.from_name || null,
      to_id: payload.to_id || null,
      to_type: payload.to_type || null,
      to_name: payload.to_name || null,
      vehicle_id: payload.vehicle_id || null,
      payment_type: payload.payment_type || 'per_km',
      per_km_rate: payload.per_km_rate || 0,
      total_distance_km: payload.total_distance_km || 0,
      loading_charge: payload.loading_charge || 0,
      unloading_charge: payload.unloading_charge || 0,
      total_cost: payload.total_cost || 0,
      payment_status: payload.payment_status || 'pending',
      status: payload.status || 'scheduled',
      dispatch_date: payload.dispatch_date || null,
      starting_meter: payload.starting_meter || 0,
      closing_meter: payload.closing_meter || 0,
      starting_meter_image: payload.starting_meter_image || null,
      closing_meter_image: payload.closing_meter_image || null,
      driver_name: payload.driver_name || null,
      driver_contact: payload.driver_contact || null,
      owner_name: payload.owner_name || null,
      owner_contact: payload.owner_contact || null,
      notes: payload.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: newShipment, error } = await supabase
      .from('solar_shipments')
      .insert(insertData)
      .select()
      .single()
    if (error) throw error
    return newShipment
  },

  async update(id: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('solar_shipments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getAnalysis(filters?: { shipmentType?: string }) {
    const { data, error } = await supabase.from('solar_shipments').select('*')
    if (error) throw error

    let records = data || []
    if (filters?.shipmentType) records = records.filter(r => r.shipment_type === filters.shipmentType)

    const total = records.reduce((sum, r) => sum + (r.total_cost || 0), 0)
    const paid = records.filter(r => r.payment_status === 'paid')
    const pending = records.filter(r => r.payment_status === 'pending')

    return {
      totalRecords: records.length,
      total,
      paid: { count: paid.length, amount: paid.reduce((s, r) => s + (r.total_cost || 0), 0) },
      pending: { count: pending.length, amount: pending.reduce((s, r) => s + (r.total_cost || 0), 0) },
      byStatus: {
        scheduled: records.filter(r => r.status === 'scheduled').length,
        in_transit: records.filter(r => r.status === 'in_transit').length,
        delivered: records.filter(r => r.status === 'delivered').length,
        completed: records.filter(r => r.status === 'completed').length,
      },
      byType: {
        distributor_to_warehouse: records.filter(r => r.shipment_type === 'distributor_to_warehouse').length,
        distributor_to_site: records.filter(r => r.shipment_type === 'distributor_to_site').length,
        warehouse_to_site: records.filter(r => r.shipment_type === 'warehouse_to_site').length,
        warehouse_to_warehouse: records.filter(r => r.shipment_type === 'warehouse_to_warehouse').length,
      },
    }
  },

  async getDistributors() {
    const { data, error } = await supabase
      .from('distributors')
      .select('id, company_name, city, contact_person')
      .eq('is_active', true)
      .order('company_name')
    if (error) throw error
    return (data || []).map(d => ({ id: d.id, name: d.company_name, city: d.city, contact: d.contact_person }))
  },

  async getWarehouses() {
    const { data, error } = await supabase
      .from('solar_warehouses')
      .select('id, warehouse_name, city, manager_name')
      .eq('is_active', true)
      .order('warehouse_name')
    if (error) throw error
    return (data || []).map(w => ({ id: w.id, name: w.warehouse_name, city: w.city, manager: w.manager_name }))
  },

  async getVehicles() {
    const { data, error } = await supabase
      .from('solar_transportation_vehicles')
      .select('id, vehicle_number, vehicle_type, driver_name, driver_contact, driver_license_number, owner_type, vendor_name, vendor_contact')
      .eq('is_active', true)
      .order('vehicle_number')
    if (error) throw error
    return (data || []).map(v => ({
      id: v.id,
      name: `${v.vehicle_number} - ${v.vehicle_type || ''} (${v.driver_name || 'No driver'})`,
      vehicleNumber: v.vehicle_number,
      vehicleType: v.vehicle_type,
      driverName: v.driver_name,
      driverContact: v.driver_contact,
      driverLicense: v.driver_license_number,
      ownerType: v.owner_type,
      ownerName: v.vendor_name,
      ownerContact: v.vendor_contact,
    }))
  },

  async getLeadsForDelivery() {
    const { data, error } = await supabase
      .from('leads')
      .select('id, customer_name, mobile, city, address, pincode, state, source, source_user_name, capacity_kw, system_type, status, branch_id, branches:branch_id(name)')
      .order('customer_name')
    if (error) throw error
    return (data || []).map((l: any) => ({
      id: l.id,
      name: l.customer_name || 'Unknown',
      mobile: l.mobile || '',
      address: l.address || '',
      city: l.city || '',
      state: l.state || '',
      pincode: l.pincode || '',
      source: l.source || 'N/A',
      sourceName: l.source_user_name || 'N/A',
      capacityKw: l.capacity_kw || 0,
      systemType: l.system_type || 'N/A',
      status: l.status || 'N/A',
      branchName: l.branches?.name || 'N/A',
    }))
  },
}

// ============ Transportation Expense Service ============
export const transportationExpenseService = {
  async getAll(filters?: { vehicleId?: string; branchId?: string; expenseType?: string; dateRange?: { start: string; end: string } }) {
    let query = supabase
      .from('transportation_expenses')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.vehicleId) query = query.eq('vehicle_id', filters.vehicleId)
    if (filters?.branchId) query = query.eq('branch_id', filters.branchId)
    if (filters?.expenseType) query = query.eq('expense_type', filters.expenseType)
    if (filters?.dateRange) {
      query = query.gte('expense_date', filters.dateRange.start).lte('expense_date', filters.dateRange.end)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async create(expense: Record<string, any>) {
    const timestamp = Date.now().toString().slice(-6)
    const { data, error } = await supabase
      .from('transportation_expenses')
      .insert([{
        ...expense,
        expense_number: `TE-${timestamp}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, expense: Record<string, any>) {
    const { data, error } = await supabase
      .from('transportation_expenses')
      .update({ ...expense, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from('transportation_expenses').delete().eq('id', id)
    if (error) throw error
  },

  async getStats(filters?: { dateRange?: { start: string; end: string } }) {
    let query = supabase.from('transportation_expenses').select('*')
    if (filters?.dateRange) {
      query = query.gte('expense_date', filters.dateRange.start).lte('expense_date', filters.dateRange.end)
    }

    const { data, error } = await query
    if (error) throw error
    const expenses = data || []

    return {
      total: expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0),
      count: expenses.length,
      byType: expenses.reduce((acc: Record<string, number>, e) => {
        const type = e.expense_type || 'other'
        acc[type] = (acc[type] || 0) + (Number(e.amount) || 0)
        return acc
      }, {}),
      byVehicle: expenses.reduce((acc: Record<string, number>, e) => {
        const vn = e.vehicle_number || 'unknown'
        acc[vn] = (acc[vn] || 0) + (Number(e.amount) || 0)
        return acc
      }, {}),
      pending: expenses.filter(e => e.status === 'pending').reduce((s, e) => s + (Number(e.amount) || 0), 0),
      approved: expenses.filter(e => e.status === 'approved').reduce((s, e) => s + (Number(e.amount) || 0), 0),
    }
  },
}

// ============ Delivery Points Service ============
export const deliveryPointService = {
  async getAll(filters?: { shipmentId?: string; status?: string }) {
    let query = supabase
      .from('shipment_delivery_points')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.shipmentId) query = query.eq('shipment_id', filters.shipmentId)
    if (filters?.status) query = query.eq('delivery_status', filters.status)

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async update(id: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('shipment_delivery_points')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
}

// ============ Trip Materials Service ============
export const tripMaterialService = {
  async getAll(filters?: { tripId?: string }) {
    let query = supabase
      .from('solar_trip_materials')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.tripId) query = query.eq('trip_id', filters.tripId)

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async create(material: Record<string, any>) {
    const { data, error } = await supabase
      .from('solar_trip_materials')
      .insert([{ ...material, created_at: new Date().toISOString() }])
      .select()
      .single()
    if (error) throw error
    return data
  },
}

// ============ Shipment Analytics Service ============
export const shipmentAnalyticsService = {
  async getAnalytics() {
    const { data, error } = await supabase
      .from('shipment_ai_analytics')
      .select('*')
      .order('analytics_date', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getInsights(shipmentId?: string) {
    let query = supabase
      .from('shipment_ai_insights')
      .select('*')
      .order('created_at', { ascending: false })

    if (shipmentId) query = query.eq('shipment_id', shipmentId)

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getDashboardStats() {
    const [shipments, vehicles, expenses, analytics] = await Promise.all([
      supabase.from('solar_shipments').select('*'),
      supabase.from('solar_transportation_vehicles').select('*'),
      supabase.from('transportation_expenses').select('*'),
      supabase.from('shipment_ai_analytics').select('*').order('analytics_date', { ascending: false }).limit(1),
    ])

    const shipmentData = shipments.data || []
    const vehicleData = vehicles.data || []
    const expenseData = expenses.data || []
    const latestAnalytics = analytics.data?.[0] || null

    const totalShipmentCost = shipmentData.reduce((s, r) => s + (Number(r.total_cost) || 0), 0)
    const totalExpenses = expenseData.reduce((s, e) => s + (Number(e.amount) || 0), 0)

    return {
      totalShipments: shipmentData.length,
      activeShipments: shipmentData.filter(s => s.status === 'scheduled' || s.status === 'in_transit').length,
      deliveredShipments: shipmentData.filter(s => s.status === 'delivered' || s.status === 'completed').length,
      totalVehicles: vehicleData.length,
      activeVehicles: vehicleData.filter(v => v.is_active).length,
      totalShipmentCost,
      totalExpenses,
      totalCost: totalShipmentCost + totalExpenses,
      pendingPayments: shipmentData.filter(s => s.payment_status === 'pending').reduce((s, r) => s + (Number(r.total_cost) || 0), 0),
      latestAnalytics,
      shipmentsByStatus: {
        scheduled: shipmentData.filter(s => s.status === 'scheduled').length,
        in_transit: shipmentData.filter(s => s.status === 'in_transit').length,
        delivered: shipmentData.filter(s => s.status === 'delivered').length,
        completed: shipmentData.filter(s => s.status === 'completed').length,
      },
      expensesByType: expenseData.reduce((acc: Record<string, number>, e) => {
        const type = e.expense_type || 'other'
        acc[type] = (acc[type] || 0) + (Number(e.amount) || 0)
        return acc
      }, {}),
    }
  },
}

// ============ Warehouse Service ============
export const warehouseService = {
  async getAll() {
    const { data, error } = await supabase
      .from('solar_warehouses')
      .select('*')
      .order('warehouse_name')
    if (error) throw error
    return data || []
  },
}
