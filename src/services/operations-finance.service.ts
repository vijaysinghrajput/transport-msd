import { supabase } from '@/lib/supabaseClient';
import type {
  AssetExpense,
  TransportationExpense,
  PurchaseExpense,
  NetMeteringExpense,
  BankExpense,
  BankExpenseLead,
  BankExpenseSection,
  ExpenseReport,
  ExpenseDashboardMetrics,
} from '@/types/operations-finance.types';

// Asset Expenses Service
export const assetExpenseService = {
  async getAll(filters?: { status?: string; branchId?: string; dateRange?: { start: string; end: string } }) {
    let query = supabase
      .from('operations_asset_expenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('payment_status', filters.status);
    }
    if (filters?.branchId) {
      query = query.eq('branch_id', filters.branchId);
    }
    if (filters?.dateRange) {
      query = query.gte('expense_date', filters.dateRange.start).lte('expense_date', filters.dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as AssetExpense[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('operations_asset_expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as AssetExpense;
  },

  async create(expense: Omit<AssetExpense, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('operations_asset_expenses')
      .insert([expense])
      .select()
      .single();

    if (error) throw error;
    return data as AssetExpense;
  },

  async update(id: string, expense: Partial<AssetExpense>) {
    const { data, error } = await supabase
      .from('operations_asset_expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AssetExpense;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('operations_asset_expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getStatistics(filters?: { branchId?: string; dateRange?: { start: string; end: string } }) {
    let query = supabase.from('operations_asset_expenses').select('amount, payment_status, asset_type');

    if (filters?.branchId) {
      query = query.eq('branch_id', filters.branchId);
    }
    if (filters?.dateRange) {
      query = query.gte('expense_date', filters.dateRange.start).lte('expense_date', filters.dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;

    const expenses = data as AssetExpense[];
    return {
      total: expenses.reduce((sum, e) => sum + e.amount, 0),
      pending: expenses
        .filter((e) => e.payment_status === 'pending')
        .reduce((sum, e) => sum + e.amount - (e.amount_paid || 0), 0),
      byCategory: expenses.reduce(
        (acc, e) => {
          acc[e.asset_type] = (acc[e.asset_type] || 0) + e.amount;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  },
};

// Transportation Expenses Service
export const transportationExpenseService = {
  async getAll(filters?: { vehicleId?: string; branchId?: string; dateRange?: { start: string; end: string } }) {
    let query = supabase
      .from('operations_transportation_expenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.vehicleId) {
      query = query.eq('vehicle_id', filters.vehicleId);
    }
    if (filters?.branchId) {
      query = query.eq('branch_id', filters.branchId);
    }
    if (filters?.dateRange) {
      query = query.gte('expense_date', filters.dateRange.start).lte('expense_date', filters.dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as TransportationExpense[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('operations_transportation_expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as TransportationExpense;
  },

  async create(expense: Omit<TransportationExpense, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('operations_transportation_expenses')
      .insert([expense])
      .select()
      .single();

    if (error) throw error;
    return data as TransportationExpense;
  },

  async update(id: string, expense: Partial<TransportationExpense>) {
    const { data, error } = await supabase
      .from('operations_transportation_expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as TransportationExpense;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('operations_transportation_expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getVehicleStats(vehicleId: string, dateRange?: { start: string; end: string }) {
    let query = supabase
      .from('operations_transportation_expenses')
      .select('amount, expense_type, payment_status')
      .eq('vehicle_id', vehicleId);

    if (dateRange) {
      query = query.gte('expense_date', dateRange.start).lte('expense_date', dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;

    const expenses = data as TransportationExpense[];
    return {
      total: expenses.reduce((sum, e) => sum + e.amount, 0),
      byType: expenses.reduce(
        (acc, e) => {
          acc[e.expense_type] = (acc[e.expense_type] || 0) + e.amount;
          return acc;
        },
        {} as Record<string, number>,
      ),
      pending: expenses
        .filter((e) => e.payment_status === 'pending')
        .reduce((sum, e) => sum + e.amount - (e.amount_paid || 0), 0),
    };
  },
};

// Purchase Expenses Service
export const purchaseExpenseService = {
  async getAll(filters?: { status?: string; distributorId?: string; branchId?: string; dateRange?: { start: string; end: string } }) {
    let query = supabase
      .from('operations_purchase_expenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('payment_status', filters.status);
    }
    if (filters?.distributorId) {
      query = query.eq('distributor_id', filters.distributorId);
    }
    if (filters?.branchId) {
      query = query.eq('branch_id', filters.branchId);
    }
    if (filters?.dateRange) {
      query = query.gte('po_date', filters.dateRange.start).lte('po_date', filters.dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as PurchaseExpense[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('operations_purchase_expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as PurchaseExpense;
  },

  async create(expense: Omit<PurchaseExpense, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('operations_purchase_expenses')
      .insert([expense])
      .select()
      .single();

    if (error) throw error;
    return data as PurchaseExpense;
  },

  async update(id: string, expense: Partial<PurchaseExpense>) {
    const { data, error } = await supabase
      .from('operations_purchase_expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as PurchaseExpense;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('operations_purchase_expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getPaymentStatus(poId: string) {
    const { data, error } = await supabase
      .from('operations_purchase_expenses')
      .select('total_amount, amount_paid, payment_status')
      .eq('purchase_order_id', poId)
      .single();

    if (error) throw error;
    return data;
  },
};

// Net Metering Expenses Service
export const netMeteringExpenseService = {
  async getAll(filters?: { siteId?: string; branchId?: string; dateRange?: { start: string; end: string } }) {
    let query = supabase
      .from('operations_net_metering_expenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.siteId) {
      query = query.eq('site_id', filters.siteId);
    }
    if (filters?.branchId) {
      query = query.eq('branch_id', filters.branchId);
    }
    if (filters?.dateRange) {
      query = query.gte('billing_period_start', filters.dateRange.start).lte('billing_period_end', filters.dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as NetMeteringExpense[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('operations_net_metering_expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as NetMeteringExpense;
  },

  async create(expense: Omit<NetMeteringExpense, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('operations_net_metering_expenses')
      .insert([expense])
      .select()
      .single();

    if (error) throw error;
    return data as NetMeteringExpense;
  },

  async update(id: string, expense: Partial<NetMeteringExpense>) {
    const { data, error } = await supabase
      .from('operations_net_metering_expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as NetMeteringExpense;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('operations_net_metering_expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getAnalysis(dateRange?: { start: string; end: string }) {
    let query = supabase.from('operations_net_metering_expenses').select('units_consumed, units_generated, total_amount, payment_status');

    if (dateRange) {
      query = query.gte('billing_period_start', dateRange.start).lte('billing_period_end', dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;

    const expenses = data as NetMeteringExpense[];
    return {
      totalUnitsConsumed: expenses.reduce((sum, e) => sum + e.units_consumed, 0),
      totalUnitsGenerated: expenses.reduce((sum, e) => sum + (e.units_generated || 0), 0),
      totalAmount: expenses.reduce((sum, e) => sum + e.total_amount, 0),
      pendingPayment: expenses
        .filter((e) => e.payment_status === 'pending' || e.payment_status === 'overdue')
        .reduce((sum, e) => sum + e.total_amount, 0),
    };
  },
};

// Net Metering Service (matches mobile app structure - lead-based)
import type { NetMetering, NetMeteringLead, NetMeteringSection } from '@/types/operations-finance.types';

export const netMeteringService = {
  async getAll(filters?: { 
    searchQuery?: string;
    branchId?: string;
    sourceUserName?: string;
    dateRange?: { start: string; end: string };
  }) {
    let query = supabase
      .from('net_metering')
      .select(`
        *,
        leads!inner(
          id, customer_name, mobile, address, city, state,
          capacity_kw, system_capacity_kw, source, source_user_name, branch_id, status,
          branches(id, name)
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.branchId) {
      query = query.eq('leads.branch_id', filters.branchId);
    }
    if (filters?.sourceUserName) {
      query = query.eq('leads.source_user_name', filters.sourceUserName);
    }
    if (filters?.dateRange) {
      query = query.gte('created_at', filters.dateRange.start).lte('created_at', filters.dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    let records = (data || []).map((item: any) => ({
      ...item,
      lead: {
        ...item.leads,
        branch: item.leads?.branches || null,
      },
    }));

    // Client-side search filter (Supabase doesn't support .or() on nested tables)
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      records = records.filter((r: any) => {
        const lead = r.lead;
        if (!lead) return false;
        return (
          (lead.customer_name?.toLowerCase() || '').includes(q) ||
          (lead.mobile?.toLowerCase() || '').includes(q) ||
          (lead.address?.toLowerCase() || '').includes(q) ||
          (lead.city?.toLowerCase() || '').includes(q) ||
          (lead.branch?.name?.toLowerCase() || '').includes(q) ||
          (lead.source?.toLowerCase() || '').includes(q) ||
          (lead.source_user_name?.toLowerCase() || '').includes(q)
        );
      });
    }
    
    return records as NetMetering[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('net_metering')
      .select(`
        *,
        leads!inner(
          id, customer_name, mobile, address, city, state,
          capacity_kw, system_capacity_kw, source, source_user_name, branch_id, status,
          branches(id, name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return {
      ...data,
      lead: {
        ...data.leads,
        branch: data.leads?.branches || null,
      },
    } as NetMetering;
  },

  async create(leadId: string, userId?: string) {
    // Allow duplicate leads - multiple net metering records per lead
    const { data, error } = await supabase
      .from('net_metering')
      .insert([{ 
        lead_id: leadId,
        created_by: userId,
      }])
      .select(`
        *,
        leads!inner(
          id, customer_name, mobile, address, city, state,
          capacity_kw, system_capacity_kw, source, source_user_name, branch_id, status,
          branches(id, name)
        )
      `)
      .single();

    if (error) throw error;
    return {
      ...data,
      lead: {
        ...data.leads,
        branch: data.leads?.branches || null,
      },
    } as NetMetering;
  },

  async updateSection(id: string, section: NetMeteringSection, data: { amount?: number; date?: string; file?: string; notes?: string }) {
    const fieldMap: Record<NetMeteringSection, { amount: string; date: string; file: string; notes: string }> = {
      electricity_agreement: { 
        amount: 'electricity_agreement_cost', 
        date: 'electricity_agreement_date', 
        file: 'electricity_agreement_file', 
        notes: 'electricity_agreement_notes' 
      },
      net_metering: { 
        amount: 'net_metering_charge', 
        date: 'net_metering_date', 
        file: 'net_metering_file', 
        notes: 'net_metering_notes' 
      },
      net_meter_installation: { 
        amount: 'net_meter_installation_charge', 
        date: 'net_meter_installation_date', 
        file: 'net_meter_installation_file', 
        notes: 'net_meter_installation_notes' 
      },
      vendor_agreement: { 
        amount: 'vendor_agreement_cost', 
        date: 'vendor_agreement_date', 
        file: 'vendor_agreement_file', 
        notes: 'vendor_agreement_notes' 
      },
    };

    const fields = fieldMap[section];
    const updateData: Record<string, any> = {};
    
    if (data.amount !== undefined) updateData[fields.amount] = data.amount;
    if (data.date !== undefined) updateData[fields.date] = data.date;
    if (data.file !== undefined) updateData[fields.file] = data.file;
    if (data.notes !== undefined) updateData[fields.notes] = data.notes;

    const { data: result, error } = await supabase
      .from('net_metering')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        leads!inner(
          id, customer_name, mobile, address, city, state,
          capacity_kw, system_capacity_kw, source, source_user_name, branch_id, status,
          branches(id, name)
        )
      `)
      .single();

    if (error) throw error;
    return {
      ...result,
      lead: {
        ...result.leads,
        branch: result.leads?.branches || null,
      },
    } as NetMetering;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('net_metering')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getAvailableLeads() {
    // Get all leads for selection (duplicates allowed)
    const { data, error } = await supabase
      .from('leads')
      .select(`
        id, customer_name, mobile, address, city, state,
        capacity_kw, system_capacity_kw, source, source_user_name, branch_id,
        branches(id, name)
      `)
      .order('customer_name');

    if (error) throw error;
    
    const leads = (data || []).map((item: any) => ({
      id: item.id,
      customer_name: item.customer_name,
      mobile: item.mobile,
      address: item.address,
      city: item.city,
      state: item.state,
      capacity_kw: item.capacity_kw,
      system_capacity_kw: item.system_capacity_kw,
      source: item.source,
      source_user_name: item.source_user_name,
      branch_id: item.branch_id,
      branch: item.branches || null,
    }));
    
    return leads as NetMeteringLead[];
  },

  async getBranches() {
    const { data, error } = await supabase
      .from('branches')
      .select('id, name')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  async getSources() {
    const { data, error } = await supabase
      .from('net_metering')
      .select('leads!inner(source_user_name)')
      .not('leads.source_user_name', 'is', null);
    if (error) throw error;
    
    const sourceNames = [...new Set((data || []).map((d: any) => d.leads?.source_user_name).filter(Boolean))];
    return sourceNames.sort();
  },

  async getAnalysis(filters?: { branchId?: string; sourceUserName?: string }) {
    let query = supabase
      .from('net_metering')
      .select(`
        electricity_agreement_cost, electricity_agreement_date,
        net_metering_charge, net_metering_date,
        net_meter_installation_charge, net_meter_installation_date,
        vendor_agreement_cost, vendor_agreement_date,
        leads!inner(branch_id, source_user_name)
      `);

    if (filters?.branchId) {
      query = query.eq('leads.branch_id', filters.branchId);
    }
    if (filters?.sourceUserName) {
      query = query.eq('leads.source_user_name', filters.sourceUserName);
    }

    const { data, error } = await query;
    if (error) throw error;

    const records = data || [];
    
    const totalElectricity = records.reduce((sum, r) => sum + (r.electricity_agreement_cost || 0), 0);
    const totalNetMetering = records.reduce((sum, r) => sum + (r.net_metering_charge || 0), 0);
    const totalInstallation = records.reduce((sum, r) => sum + (r.net_meter_installation_charge || 0), 0);
    const totalVendor = records.reduce((sum, r) => sum + (r.vendor_agreement_cost || 0), 0);
    
    const electricityCompleted = records.filter(r => r.electricity_agreement_date).length;
    const netMeteringCompleted = records.filter(r => r.net_metering_date).length;
    const installationCompleted = records.filter(r => r.net_meter_installation_date).length;
    const vendorCompleted = records.filter(r => r.vendor_agreement_date).length;

    return {
      totalRecords: records.length,
      total: totalElectricity + totalNetMetering + totalInstallation + totalVendor,
      bySection: {
        electricity_agreement: { total: totalElectricity, completed: electricityCompleted },
        net_metering: { total: totalNetMetering, completed: netMeteringCompleted },
        net_meter_installation: { total: totalInstallation, completed: installationCompleted },
        vendor_agreement: { total: totalVendor, completed: vendorCompleted },
      },
    };
  },
};

// Bank Approval Costs Service (matches mobile app structure)
export const bankExpenseService = {
  async getAll(filters?: { 
    bankName?: string; 
    paymentStatus?: 'paid' | 'pending' | 'cancelled';
    searchQuery?: string;
    branchId?: string;
    sourceUserName?: string;
    dateRange?: { start: string; end: string } 
  }) {
    let query = supabase
      .from('bank_approval_costs')
      .select(`
        *,
        leads!inner(
          id, customer_name, mobile, address, city, state, pincode,
          capacity_kw, system_capacity_kw, payment_type, finance_bank, 
          source, source_user_id, source_user_name, branch_id, status,
          branches(id, name)
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.bankName) {
      query = query.ilike('bank_name', `%${filters.bankName}%`);
    }
    if (filters?.branchId) {
      query = query.eq('leads.branch_id', filters.branchId);
    }
    if (filters?.sourceUserName) {
      query = query.eq('leads.source_user_name', filters.sourceUserName);
    }
    if (filters?.dateRange) {
      query = query.gte('created_at', filters.dateRange.start).lte('created_at', filters.dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    // Transform data to match BankExpense interface
    let expenses = (data || []).map((item: any) => ({
      ...item,
      lead: {
        ...item.leads,
        branch: item.leads?.branches || null,
      },
    }));

    // Client-side search filter (Supabase doesn't support .or() on nested tables)
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      expenses = expenses.filter((e: any) => {
        const lead = e.lead;
        if (!lead) return false;
        return (
          (lead.customer_name?.toLowerCase() || '').includes(q) ||
          (lead.mobile?.toLowerCase() || '').includes(q) ||
          (lead.address?.toLowerCase() || '').includes(q) ||
          (lead.city?.toLowerCase() || '').includes(q) ||
          (lead.branch?.name?.toLowerCase() || '').includes(q) ||
          (lead.source?.toLowerCase() || '').includes(q) ||
          (lead.source_user_name?.toLowerCase() || '').includes(q)
        );
      });
    }
    
    return expenses as BankExpense[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('bank_approval_costs')
      .select(`
        *,
        leads!inner(
          id, customer_name, mobile, address, city, state, pincode,
          capacity_kw, system_capacity_kw, payment_type, finance_bank, 
          source, source_user_id, source_user_name, branch_id,
          branches(id, name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return {
      ...data,
      lead: {
        ...data.leads,
        branch: data.leads?.branches || null,
      },
    } as BankExpense;
  },

  async create(leadId: string, userId?: string) {
    // Allow duplicate leads - multiple bank expense records per lead
    const { data, error } = await supabase
      .from('bank_approval_costs')
      .insert([{ 
        lead_id: leadId,
        created_by: userId,
      }])
      .select(`
        *,
        leads!inner(
          id, customer_name, mobile, address, city, state, pincode,
          capacity_kw, system_capacity_kw, payment_type, finance_bank, 
          source, source_user_id, source_user_name, branch_id,
          branches(id, name)
        )
      `)
      .single();

    if (error) throw error;
    return {
      ...data,
      lead: {
        ...data.leads,
        branch: data.leads?.branches || null,
      },
    } as BankExpense;
  },

  async updateSection(
    id: string, 
    section: BankExpenseSection, 
    sectionData: {
      amount?: number;
      date?: string;
      status?: 'paid' | 'pending' | 'cancelled';
      fileUrl?: string;
      notes?: string;
    }
  ) {
    // Field mapping for each section
    const fieldMap: Record<BankExpenseSection, Record<string, string>> = {
      margin_money: {
        amount: 'margin_money',
        date: 'margin_payment_date',
        status: 'margin_payment_status',
        fileUrl: 'margin_file_url',
        notes: 'margin_notes',
      },
      bank_expense: {
        amount: 'bank_expense',
        date: 'expense_payment_date',
        status: 'expense_payment_status',
        fileUrl: 'expense_file_url',
        notes: 'expense_notes',
      },
      visiting_charge: {
        amount: 'visiting_charge',
        date: 'visiting_payment_date',
        status: 'visiting_payment_status',
        fileUrl: 'visiting_file_url',
        notes: 'visiting_notes',
      },
    };

    const fields = fieldMap[section];
    const updateData: Record<string, any> = {};

    if (sectionData.amount !== undefined) updateData[fields.amount] = sectionData.amount;
    if (sectionData.date !== undefined) updateData[fields.date] = sectionData.date;
    if (sectionData.status !== undefined) updateData[fields.status] = sectionData.status;
    if (sectionData.fileUrl !== undefined) updateData[fields.fileUrl] = sectionData.fileUrl;
    if (sectionData.notes !== undefined) updateData[fields.notes] = sectionData.notes;

    const { data, error } = await supabase
      .from('bank_approval_costs')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        leads!inner(
          id, customer_name, mobile, address, city, state, pincode,
          capacity_kw, system_capacity_kw, payment_type, finance_bank, 
          source, source_user_id, source_user_name, branch_id,
          branches(id, name)
        )
      `)
      .single();

    if (error) throw error;
    return {
      ...data,
      lead: {
        ...data.leads,
        branch: data.leads?.branches || null,
      },
    } as BankExpense;
  },

  async updateBankName(id: string, bankName: string) {
    const { data, error } = await supabase
      .from('bank_approval_costs')
      .update({ bank_name: bankName })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as BankExpense;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('bank_approval_costs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get available leads (duplicates allowed)
  async getAvailableLeads() {
    // Get all leads for selection
    const { data, error } = await supabase
      .from('leads')
      .select(`
        id, customer_name, mobile, address, city, state, pincode,
        capacity_kw, system_capacity_kw, payment_type, finance_bank, 
        source, source_user_id, source_user_name, branch_id,
        branches(id, name)
      `)
      .order('customer_name');

    if (error) throw error;
    
    // Transform data to match BankExpenseLead interface
    const leads = (data || []).map((item: any) => ({
      id: item.id,
      customer_name: item.customer_name,
      mobile: item.mobile,
      address: item.address,
      city: item.city,
      state: item.state,
      pincode: item.pincode,
      capacity_kw: item.capacity_kw,
      system_capacity_kw: item.system_capacity_kw,
      payment_type: item.payment_type,
      finance_bank: item.finance_bank,
      source: item.source,
      source_user_name: item.source_user_name,
      branch_id: item.branch_id,
      branch: item.branches || null,
    }));
    
    return leads as BankExpenseLead[];
  },

  async getBranches() {
    const { data, error } = await supabase
      .from('branches')
      .select('id, name')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  async getSources() {
    const { data, error } = await supabase
      .from('bank_approval_costs')
      .select('leads!inner(source_user_name)')
      .not('leads.source_user_name', 'is', null);
    if (error) throw error;
    
    // Get unique source names
    const sourceNames = [...new Set((data || []).map((d: any) => d.leads?.source_user_name).filter(Boolean))];
    return sourceNames.sort();
  },

  async getAnalysis(filters?: { dateRange?: { start: string; end: string }; branchId?: string; sourceUserName?: string }) {
    let query = supabase
      .from('bank_approval_costs')
      .select('margin_money, bank_expense, visiting_charge, margin_payment_status, expense_payment_status, visiting_payment_status, leads!inner(branch_id, source_user_name)');

    if (filters?.dateRange) {
      query = query.gte('created_at', filters.dateRange.start).lte('created_at', filters.dateRange.end);
    }
    if (filters?.branchId) {
      query = query.eq('leads.branch_id', filters.branchId);
    }
    if (filters?.sourceUserName) {
      query = query.eq('leads.source_user_name', filters.sourceUserName);
    }

    const { data, error } = await query;
    if (error) throw error;

    const expenses = data || [];
    
    const totalMarginMoney = expenses.reduce((sum, e) => sum + (e.margin_money || 0), 0);
    const totalBankExpense = expenses.reduce((sum, e) => sum + (e.bank_expense || 0), 0);
    const totalVisitingCharge = expenses.reduce((sum, e) => sum + (e.visiting_charge || 0), 0);
    
    const paidMarginMoney = expenses.filter(e => e.margin_payment_status === 'paid').reduce((sum, e) => sum + (e.margin_money || 0), 0);
    const paidBankExpense = expenses.filter(e => e.expense_payment_status === 'paid').reduce((sum, e) => sum + (e.bank_expense || 0), 0);
    const paidVisitingCharge = expenses.filter(e => e.visiting_payment_status === 'paid').reduce((sum, e) => sum + (e.visiting_charge || 0), 0);

    return {
      total: totalMarginMoney + totalBankExpense + totalVisitingCharge,
      totalRecords: expenses.length,
      bySection: {
        margin_money: { total: totalMarginMoney, paid: paidMarginMoney },
        bank_expense: { total: totalBankExpense, paid: paidBankExpense },
        visiting_charge: { total: totalVisitingCharge, paid: paidVisitingCharge },
      },
      statusBreakdown: {
        margin: {
          paid: expenses.filter(e => e.margin_payment_status === 'paid').length,
          pending: expenses.filter(e => e.margin_payment_status === 'pending').length,
          cancelled: expenses.filter(e => e.margin_payment_status === 'cancelled').length,
        },
        expense: {
          paid: expenses.filter(e => e.expense_payment_status === 'paid').length,
          pending: expenses.filter(e => e.expense_payment_status === 'pending').length,
          cancelled: expenses.filter(e => e.expense_payment_status === 'cancelled').length,
        },
        visiting: {
          paid: expenses.filter(e => e.visiting_payment_status === 'paid').length,
          pending: expenses.filter(e => e.visiting_payment_status === 'pending').length,
          cancelled: expenses.filter(e => e.visiting_payment_status === 'cancelled').length,
        },
      },
    };
  },

  // Export Bank Expense Records to Excel
  async exportToExcel(filters?: { 
    searchQuery?: string;
    branchId?: string;
    sourceUserName?: string;
    dateRange?: { start: string; end: string } 
  }) {
    // Fetch all data with filters
    const expenses = await this.getAll(filters);
    
    // Transform data for Excel
    const excelData = expenses.map((expense, index) => ({
      'Sr.No': index + 1,
      'Customer Name': expense.lead?.customer_name || '',
      'Mobile': expense.lead?.mobile || '',
      'Address': expense.lead?.address || '',
      'City': expense.lead?.city || '',
      'State': expense.lead?.state || '',
      'Pincode': expense.lead?.pincode || '',
      'Branch': expense.lead?.branch?.name || '',
      'Source': expense.lead?.source_user_name || expense.lead?.source || '',
      'Capacity (kW)': expense.lead?.capacity_kw || expense.lead?.system_capacity_kw || '',
      'Payment Type': expense.lead?.payment_type || '',
      'Bank Name': expense.bank_name || '',
      'Lead Status': expense.lead?.status || '',
      
      // Margin Money Section
      'Margin Money (₹)': expense.margin_money || '',
      'Margin Payment Date': expense.margin_payment_date ? new Date(expense.margin_payment_date).toLocaleDateString('en-IN') : '',
      'Margin Payment Status': expense.margin_payment_status || '',
      'Margin Notes': expense.margin_notes || '',
      
      // Bank Expense Section  
      'Bank Expense (₹)': expense.bank_expense || '',
      'Bank Expense Payment Date': expense.expense_payment_date ? new Date(expense.expense_payment_date).toLocaleDateString('en-IN') : '',
      'Bank Expense Payment Status': expense.expense_payment_status || '',
      'Bank Expense Notes': expense.expense_notes || '',
      
      // Visiting Charge Section
      'Visiting Charge (₹)': expense.visiting_charge || '',
      'Visiting Payment Date': expense.visiting_payment_date ? new Date(expense.visiting_payment_date).toLocaleDateString('en-IN') : '',
      'Visiting Payment Status': expense.visiting_payment_status || '',
      'Visiting Notes': expense.visiting_notes || '',
      
      // Totals & Dates
      'Total Expenses (₹)': (expense.margin_money || 0) + (expense.bank_expense || 0) + (expense.visiting_charge || 0),
      'Record Created': expense.created_at ? new Date(expense.created_at).toLocaleDateString('en-IN') : '',
      'Last Updated': expense.updated_at ? new Date(expense.updated_at).toLocaleDateString('en-IN') : '',
    }));

    return excelData;
  },
};

// Installation Cost Service - matches mobile app structure
import type { InstallationCost, InstallationCostLead, InstallationTeam } from '@/types/operations-finance.types';

export const installationCostService = {
  async getAll(filters?: { searchQuery?: string; branchId?: string; teamId?: string; status?: string; paymentStatus?: string; dateRange?: { start: string; end: string } }) {
    const { data, error } = await supabase
      .from('installations')
      .select(`
        id,
        lead_id,
        installation_team_id,
        installation_cost,
        installation_per_kw_rate,
        raw_materials_cost,
        total_installation_cost,
        status,
        payment_status,
        payment_date,
        installation_date,
        installation_time,
        installation_address,
        installation_notes,
        inspection_date,
        inspection_time,
        inspection_notes,
        material_requirements,
        site_conditions,
        created_at,
        updated_at,
        leads!inner(
          id,
          customer_name,
          mobile,
          address,
          city,
          state,
          pincode,
          capacity_kw,
          system_capacity_kw,
          estimated_total_cost,
          source,
          source_user_name,
          branch_id,
          status,
          branches(id, name)
        ),
        installation_teams(
          id,
          team_name,
          team_leader_name,
          team_leader_contact,
          email,
          status,
          is_active,
          team_type
        )
      `)
      .not('installation_cost', 'is', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map data to proper interface
    let records = (data || []).map((item: any) => ({
      id: item.id,
      lead_id: item.lead_id,
      installation_team_id: item.installation_team_id,
      installation_cost: item.installation_cost,
      installation_per_kw_rate: item.installation_per_kw_rate,
      raw_materials_cost: item.raw_materials_cost,
      total_installation_cost: item.total_installation_cost,
      status: item.status || 'cost_estimated',
      payment_status: item.payment_status || 'pending',
      payment_date: item.payment_date,
      installation_date: item.installation_date,
      installation_time: item.installation_time,
      installation_address: item.installation_address,
      installation_notes: item.installation_notes,
      inspection_date: item.inspection_date,
      inspection_time: item.inspection_time,
      inspection_notes: item.inspection_notes,
      material_requirements: item.material_requirements,
      site_conditions: item.site_conditions,
      created_at: item.created_at,
      updated_at: item.updated_at,
      lead: item.leads ? {
        id: item.leads.id,
        customer_name: item.leads.customer_name,
        mobile: item.leads.mobile,
        address: item.leads.address,
        city: item.leads.city,
        state: item.leads.state,
        pincode: item.leads.pincode,
        capacity_kw: item.leads.capacity_kw,
        system_capacity_kw: item.leads.system_capacity_kw,
        estimated_total_cost: item.leads.estimated_total_cost,
        source: item.leads.source,
        source_user_name: item.leads.source_user_name,
        branch_id: item.leads.branch_id,
        branch: item.leads.branches || null,
        status: item.leads.status,
      } : undefined,
      installation_team: item.installation_teams || undefined,
    })) as InstallationCost[];

    // Apply filters client-side for nested fields
    if (filters?.branchId) {
      records = records.filter(r => r.lead?.branch_id === filters.branchId);
    }
    if (filters?.teamId) {
      records = records.filter(r => r.installation_team_id === filters.teamId);
    }
    if (filters?.status) {
      records = records.filter(r => r.status === filters.status);
    }
    if (filters?.paymentStatus) {
      records = records.filter(r => r.payment_status === filters.paymentStatus);
    }
    if (filters?.dateRange) {
      records = records.filter(r => {
        const created = new Date(r.created_at);
        return created >= new Date(filters.dateRange!.start) && created <= new Date(filters.dateRange!.end);
      });
    }
    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      records = records.filter(r => 
        r.lead?.customer_name?.toLowerCase().includes(query) ||
        r.lead?.mobile?.toLowerCase().includes(query) ||
        r.lead?.address?.toLowerCase().includes(query) ||
        r.lead?.city?.toLowerCase().includes(query) ||
        r.lead?.branch?.name?.toLowerCase().includes(query) ||
        r.installation_team?.team_name?.toLowerCase().includes(query) ||
        r.installation_team?.team_leader_name?.toLowerCase().includes(query)
      );
    }

    return records;
  },

  async create(leadId: string, teamId: string, data: {
    installation_cost?: number;
    installation_per_kw_rate?: number;
    raw_materials_cost?: number;
    status?: string;
    payment_status?: string;
    payment_date?: string;
    notes?: string;
  }) {
    // Get lead address for installation
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('address, city, state, pincode')
      .eq('id', leadId)
      .single();
    
    if (leadError) throw leadError;

    const installCost = data.installation_cost || 0;
    const rawCost = data.raw_materials_cost || 0;
    const total = installCost + rawCost;
    const fullAddress = [leadData.address, leadData.city, leadData.state, leadData.pincode].filter(Boolean).join(', ');

    const { data: result, error } = await supabase
      .from('installations')
      .insert({
        lead_id: leadId,
        installation_team_id: teamId,
        installation_cost: installCost,
        installation_per_kw_rate: data.installation_per_kw_rate || 0,
        raw_materials_cost: rawCost,
        total_installation_cost: total,
        status: data.status || 'cost_estimated',
        payment_status: data.payment_status || 'pending',
        payment_date: data.payment_date || null,
        installation_address: fullAddress,
        installation_notes: data.notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async update(id: string, data: {
    installation_team_id?: string;
    installation_cost?: number;
    installation_per_kw_rate?: number;
    raw_materials_cost?: number;
    status?: string;
    payment_status?: string;
    payment_date?: string;
    notes?: string;
  }) {
    const installCost = data.installation_cost ?? 0;
    const rawCost = data.raw_materials_cost ?? 0;
    const total = installCost + rawCost;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.installation_team_id !== undefined) updateData.installation_team_id = data.installation_team_id;
    if (data.installation_cost !== undefined) {
      updateData.installation_cost = installCost;
      updateData.total_installation_cost = total;
    }
    if (data.installation_per_kw_rate !== undefined) updateData.installation_per_kw_rate = data.installation_per_kw_rate;
    if (data.raw_materials_cost !== undefined) {
      updateData.raw_materials_cost = rawCost;
      updateData.total_installation_cost = total;
    }
    if (data.status !== undefined) updateData.status = data.status;
    if (data.payment_status !== undefined) updateData.payment_status = data.payment_status;
    if (data.payment_date !== undefined) updateData.payment_date = data.payment_date;
    if (data.notes !== undefined) updateData.installation_notes = data.notes;

    const { data: result, error } = await supabase
      .from('installations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('installations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getAvailableLeads() {
    // Get all leads for selection (duplicates allowed)
    const { data, error } = await supabase
      .from('leads')
      .select('id, customer_name, mobile, address, city, state, pincode, capacity_kw, system_capacity_kw, estimated_total_cost, source, source_user_name, branch_id, branches(id, name)')
      .order('customer_name');

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      customer_name: item.customer_name,
      mobile: item.mobile,
      address: item.address,
      city: item.city,
      state: item.state,
      pincode: item.pincode,
      capacity_kw: item.capacity_kw,
      system_capacity_kw: item.system_capacity_kw,
      estimated_total_cost: item.estimated_total_cost,
      source: item.source,
      source_user_name: item.source_user_name,
      branch_id: item.branch_id,
      branch: item.branches || null,
    })) as InstallationCostLead[];
  },

  async getInstallationTeams() {
    const { data, error } = await supabase
      .from('installation_teams')
      .select('id, team_name, team_leader_name, team_leader_contact, email, status, is_active, branch_id, team_type')
      .eq('is_active', true)
      .order('team_name');

    if (error) throw error;
    return data as InstallationTeam[];
  },

  async getBranches() {
    const { data, error } = await supabase
      .from('branches')
      .select('id, name')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  async getAnalysis(filters?: { branchId?: string; teamId?: string }) {
    let query = supabase
      .from('installations')
      .select('installation_cost, raw_materials_cost, total_installation_cost, status, payment_status, leads!inner(branch_id), installation_team_id')
      .not('installation_cost', 'is', null);

    const { data, error } = await query;
    if (error) throw error;

    let records = data || [];
    
    // Apply filters
    if (filters?.branchId) {
      records = records.filter((r: any) => r.leads?.branch_id === filters.branchId);
    }
    if (filters?.teamId) {
      records = records.filter((r: any) => r.installation_team_id === filters.teamId);
    }

    const totalInstallationCost = records.reduce((sum, r) => sum + (r.installation_cost || 0), 0);
    const totalRawMaterialsCost = records.reduce((sum, r) => sum + (r.raw_materials_cost || 0), 0);
    const totalCost = records.reduce((sum, r) => sum + (r.total_installation_cost || 0), 0);

    const paidRecords = records.filter(r => r.payment_status === 'paid');
    const pendingRecords = records.filter(r => r.payment_status === 'pending');
    const partialRecords = records.filter(r => r.payment_status === 'partial');

    return {
      total: totalCost,
      totalRecords: records.length,
      bySection: {
        installation_cost: { total: totalInstallationCost, count: records.filter(r => (r.installation_cost || 0) > 0).length },
        raw_materials_cost: { total: totalRawMaterialsCost, count: records.filter(r => (r.raw_materials_cost || 0) > 0).length },
      },
      paymentStatus: {
        paid: { count: paidRecords.length, total: paidRecords.reduce((sum, r) => sum + (r.total_installation_cost || 0), 0) },
        pending: { count: pendingRecords.length, total: pendingRecords.reduce((sum, r) => sum + (r.total_installation_cost || 0), 0) },
        partial: { count: partialRecords.length, total: partialRecords.reduce((sum, r) => sum + (r.total_installation_cost || 0), 0) },
      },
      statusBreakdown: {
        cost_estimated: records.filter(r => r.status === 'cost_estimated').length,
        inspection_scheduled: records.filter(r => r.status === 'inspection_scheduled').length,
        materials_verified: records.filter(r => r.status === 'materials_verified').length,
        scheduled: records.filter(r => r.status === 'scheduled').length,
        completed: records.filter(r => r.status === 'completed').length,
      },
    };
  },
};

// Comprehensive Dashboard Service
export const financeDashboardService = {
  async getMetrics(dateRange?: { start: string; end: string }): Promise<ExpenseDashboardMetrics> {
    const [assetStats, transportStats, purchaseStats, netMeteringStats, bankStats] = await Promise.all([
      assetExpenseService.getStatistics({ dateRange }),
      transportationExpenseService.getAll({ dateRange }),
      purchaseExpenseService.getAll({ dateRange }),
      netMeteringExpenseService.getAll({ dateRange }),
      bankExpenseService.getAnalysis({ dateRange }),
    ]);

    const transportData = transportStats as TransportationExpense[];
    const purchaseData = purchaseStats as PurchaseExpense[];
    const netMeteringData = netMeteringStats as NetMeteringExpense[];
    const bankAnalysis = bankStats as { total: number; totalRecords: number; bySection: any; statusBreakdown: any };

    const totalExpenses =
      assetStats.total +
      transportData.reduce((sum, e) => sum + e.amount, 0) +
      purchaseData.reduce((sum, e) => sum + e.total_amount, 0) +
      netMeteringData.reduce((sum, e) => sum + e.total_amount, 0) +
      bankAnalysis.total;

    const pendingPayments =
      assetStats.pending +
      transportData
        .filter((e) => e.payment_status === 'pending')
        .reduce((sum, e) => sum + e.amount - (e.amount_paid || 0), 0) +
      purchaseData
        .filter((e) => e.payment_status === 'pending')
        .reduce((sum, e) => sum + e.total_amount - (e.amount_paid || 0), 0) +
      netMeteringData
        .filter((e) => e.payment_status === 'pending')
        .reduce((sum, e) => sum + e.total_amount, 0);

    return {
      totalExpenses,
      pendingPayments,
      paidExpenses: totalExpenses - pendingPayments,
      overdueAmount: purchaseData
        .filter((e) => e.payment_status === 'overdue')
        .reduce((sum, e) => sum + (e.total_amount - (e.amount_paid || 0)), 0),
      byCategory: {
        asset: assetStats.total,
        transportation: transportData.reduce((sum, e) => sum + e.amount, 0),
        purchase: purchaseData.reduce((sum, e) => sum + e.total_amount, 0),
        netMetering: netMeteringData.reduce((sum, e) => sum + e.total_amount, 0),
        bank: bankAnalysis.total,
      },
      byPaymentStatus: {
        pending: pendingPayments,
        paid: totalExpenses - pendingPayments,
        overdue: purchaseData
          .filter((e) => e.payment_status === 'overdue')
          .reduce((sum, e) => sum + (e.total_amount - (e.amount_paid || 0)), 0),
      },
      monthlyTrend: [],
      topVendors: [],
      currency: 'INR',
    };
  },
};

// ============ Purchase Order Service ============
export const purchaseOrderService = {
  async getAll(filters?: {
    searchQuery?: string;
    distributorName?: string;
    status?: string;
    paymentStatus?: string;
    dateRange?: { start: string; end: string };
  }) {
    const { data, error } = await supabase
      .from('solar_purchase_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    let records = data || [];

    // Apply filters client-side
    if (filters?.distributorName) {
      records = records.filter(r => r.distributor_name === filters.distributorName);
    }
    if (filters?.status) {
      records = records.filter(r => r.status === filters.status);
    }
    if (filters?.paymentStatus) {
      records = records.filter(r => r.payment_status === filters.paymentStatus);
    }
    if (filters?.dateRange) {
      records = records.filter(r => {
        const created = new Date(r.created_at);
        return created >= new Date(filters.dateRange!.start) && created <= new Date(filters.dateRange!.end);
      });
    }
    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      records = records.filter(r => 
        r.po_number?.toLowerCase().includes(query) ||
        r.distributor_name?.toLowerCase().includes(query) ||
        r.bill_number?.toLowerCase().includes(query)
      );
    }

    return records;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('solar_purchase_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('solar_purchase_orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDistributors() {
    const { data, error } = await supabase
      .from('solar_purchase_orders')
      .select('distributor_name')
      .not('distributor_name', 'is', null);

    if (error) throw error;
    const unique = Array.from(new Set(data?.map(d => d.distributor_name).filter(Boolean)));
    return unique.sort();
  },

  async getAnalysis(filters?: { distributorName?: string }) {
    const { data, error } = await supabase
      .from('solar_purchase_orders')
      .select('*');

    if (error) throw error;

    let records = data || [];
    if (filters?.distributorName) {
      records = records.filter(r => r.distributor_name === filters.distributorName);
    }

    const total = records.reduce((sum, r) => sum + (r.bill_amount || r.total_amount || 0), 0);
    const paid = records.filter(r => r.payment_status === 'paid').reduce((sum, r) => sum + (r.bill_amount || r.total_amount || 0), 0);
    const pending = records.filter(r => r.payment_status === 'pending').reduce((sum, r) => sum + (r.bill_amount || r.total_amount || 0), 0);

    return {
      totalRecords: records.length,
      total,
      paid: { count: records.filter(r => r.payment_status === 'paid').length, amount: paid },
      pending: { count: records.filter(r => r.payment_status === 'pending').length, amount: pending },
      byStatus: {
        draft: records.filter(r => r.status === 'draft').length,
        confirmed: records.filter(r => r.status === 'confirmed').length,
        received: records.filter(r => r.status === 'received').length,
        completed: records.filter(r => r.status === 'completed').length,
      },
    };
  },

  async getActiveDistributors() {
    const { data, error } = await supabase
      .from('distributors')
      .select('id, company_name, distributor_code, contact_person, city')
      .eq('is_active', true)
      .order('company_name');

    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      name: d.company_name,
      code: d.distributor_code,
      contact: d.contact_person,
      city: d.city,
    }));
  },

  async getWarehouses() {
    const { data, error } = await supabase
      .from('solar_warehouses')
      .select('id, warehouse_name, city')
      .eq('is_active', true)
      .order('warehouse_name');

    if (error) throw error;
    return (data || []).map(w => ({
      id: w.id,
      name: w.warehouse_name,
      city: w.city,
    }));
  },

  async generatePONumber() {
    const year = new Date().getFullYear();
    const { data, error } = await supabase
      .from('solar_purchase_orders')
      .select('po_number')
      .ilike('po_number', `PO-${year}-%`)
      .order('po_number', { ascending: false })
      .limit(1);

    if (error) throw error;

    let nextNumber = 1;
    if (data && data.length > 0) {
      const lastPO = data[0].po_number;
      const match = lastPO.match(/PO-\d{4}-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    return `PO-${year}-${String(nextNumber).padStart(3, '0')}`;
  },

  async create(data: {
    po_number: string;
    po_date: string;
    distributor_id: string;
    distributor_name: string;
    distributor_contact?: string;
    distributor_address?: string;
    to_warehouse_id?: string;
    bill_number?: string;
    bill_date?: string;
    bill_amount?: number;
    bill_document_url?: string;
    gst_amount?: number;
    total_amount?: number;
    payment_status?: string;
    status?: string;
    payment_terms?: string;
    expected_delivery_date?: string;
    notes?: string;
  }) {
    const payload = {
      po_number: data.po_number,
      po_date: data.po_date,
      distributor_id: data.distributor_id,
      distributor_name: data.distributor_name,
      distributor_contact: data.distributor_contact || null,
      distributor_address: data.distributor_address || null,
      to_warehouse_id: data.to_warehouse_id || null,
      bill_number: data.bill_number || null,
      bill_date: data.bill_date || null,
      bill_amount: data.bill_amount || 0,
      bill_document_url: data.bill_document_url || null,
      gst_amount: data.gst_amount || 0,
      total_amount: data.total_amount || data.bill_amount || 0,
      subtotal: data.bill_amount || 0,
      payment_status: data.payment_status || 'pending',
      status: data.status || 'draft',
      payment_terms: data.payment_terms || null,
      expected_delivery_date: data.expected_delivery_date || null,
      notes: data.notes || null,
      total_items: 0,
      total_quantity: 0,
      amount_paid: 0,
      balance_amount: data.bill_amount || data.total_amount || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newPO, error } = await supabase
      .from('solar_purchase_orders')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return newPO;
  },
};

// ============ Shipment Service ============
export const shipmentService = {
  async getAll(filters?: {
    searchQuery?: string;
    shipmentType?: string;
    status?: string;
    paymentStatus?: string;
    dateRange?: { start: string; end: string };
  }) {
    const { data, error } = await supabase
      .from('solar_shipments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    let records = data || [];

    // Apply filters client-side
    if (filters?.shipmentType) {
      records = records.filter(r => r.shipment_type === filters.shipmentType);
    }
    if (filters?.status) {
      records = records.filter(r => r.status === filters.status);
    }
    if (filters?.paymentStatus) {
      records = records.filter(r => r.payment_status === filters.paymentStatus);
    }
    if (filters?.dateRange) {
      records = records.filter(r => {
        const created = new Date(r.created_at);
        return created >= new Date(filters.dateRange!.start) && created <= new Date(filters.dateRange!.end);
      });
    }
    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      records = records.filter(r => 
        r.shipment_number?.toLowerCase().includes(query) ||
        r.from_name?.toLowerCase().includes(query) ||
        r.to_name?.toLowerCase().includes(query)
      );
    }

    return records;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('solar_shipments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('solar_shipments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getShipmentTypes() {
    const { data, error } = await supabase
      .from('solar_shipments')
      .select('shipment_type');

    if (error) throw error;
    const unique = Array.from(new Set(data?.map(d => d.shipment_type).filter(Boolean)));
    return unique.sort();
  },

  async getAnalysis(filters?: { shipmentType?: string }) {
    const { data, error } = await supabase
      .from('solar_shipments')
      .select('*');

    if (error) throw error;

    let records = data || [];
    if (filters?.shipmentType) {
      records = records.filter(r => r.shipment_type === filters.shipmentType);
    }

    const total = records.reduce((sum, r) => sum + (r.total_cost || 0), 0);
    const paid = records.filter(r => r.payment_status === 'paid').reduce((sum, r) => sum + (r.total_cost || 0), 0);
    const pending = records.filter(r => r.payment_status === 'pending').reduce((sum, r) => sum + (r.total_cost || 0), 0);

    return {
      totalRecords: records.length,
      total,
      paid: { count: records.filter(r => r.payment_status === 'paid').length, amount: paid },
      pending: { count: records.filter(r => r.payment_status === 'pending').length, amount: pending },
      byStatus: {
        scheduled: records.filter(r => r.status === 'scheduled').length,
        delivered: records.filter(r => r.status === 'delivered').length,
        completed: records.filter(r => r.status === 'completed').length,
      },
      byType: {
        distributor_to_warehouse: records.filter(r => r.shipment_type === 'distributor_to_warehouse').length,
        distributor_to_site: records.filter(r => r.shipment_type === 'distributor_to_site').length,
        warehouse_to_site: records.filter(r => r.shipment_type === 'warehouse_to_site').length,
        warehouse_to_warehouse: records.filter(r => r.shipment_type === 'warehouse_to_warehouse').length,
      },
    };
  },

  // Get distributors for from location
  async getDistributors() {
    const { data, error } = await supabase
      .from('distributors')
      .select('id, company_name, city, contact_person')
      .eq('is_active', true)
      .order('company_name');

    if (error) throw error;
    return (data || []).map(d => ({
      id: d.id,
      name: d.company_name,
      city: d.city,
      contact: d.contact_person,
    }));
  },

  // Get warehouses for from/to location
  async getWarehouses() {
    const { data, error } = await supabase
      .from('solar_warehouses')
      .select('id, warehouse_name, city, manager_name')
      .eq('is_active', true)
      .order('warehouse_name');

    if (error) throw error;
    return (data || []).map(w => ({
      id: w.id,
      name: w.warehouse_name,
      city: w.city,
      manager: w.manager_name,
    }));
  },

  // Get vehicles for shipment
  async getVehicles() {
    const { data, error } = await supabase
      .from('solar_transportation_vehicles')
      .select('id, vehicle_number, vehicle_type, driver_name')
      .eq('is_active', true)
      .order('vehicle_number');

    if (error) throw error;
    return (data || []).map(v => ({
      id: v.id,
      name: `${v.vehicle_number} - ${v.vehicle_type || ''} (${v.driver_name || 'No driver'})`,
      vehicleNumber: v.vehicle_number,
      vehicleType: v.vehicle_type,
      driverName: v.driver_name,
    }));
  },

  // Get leads for site delivery
  async getLeadsForDelivery() {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        id, customer_name, mobile, city, address, source_user_name, status,
        branches(id, name)
      `)
      .order('customer_name');

    if (error) throw error;
    return (data || []).map((l: any) => ({
      id: l.id,
      name: l.customer_name || 'Unknown',
      mobile: l.mobile || '',
      address: l.address || '',
      city: l.city || '',
      branchName: l.branches?.name || 'No Branch',
      source: l.source_user_name || 'N/A',
      status: l.status || 'N/A',
    }));
  },

  // Create new shipment
  async create(data: {
    shipment_type: string;
    from_type: string;
    from_id: string;
    from_name?: string;
    to_type: string;
    to_id: string;
    to_name?: string;
    to_address?: string;
    vehicle_id?: string;
    payment_type?: string;
    per_km_rate?: number;
    total_distance_km?: number;
    loading_charge?: number;
    unloading_charge?: number;
    total_cost?: number;
    payment_status?: string;
    vehicle_payment_amount?: number;
    vehicle_payment_status?: string;
    status?: string;
    notes?: string;
    selectedSites?: { id: string; name: string; address?: string; city?: string }[];
  }) {
    // Generate shipment number
    const timestamp = Date.now().toString().slice(-6);
    const shipmentNumber = `SH-${timestamp}`;

    const isToSite = data.to_type === 'site';
    const selectedSites = data.selectedSites || [];

    const payload = {
      shipment_number: shipmentNumber,
      shipment_type: data.shipment_type,
      from_type: data.from_type,
      from_id: data.from_id,
      from_name: data.from_name || null,
      to_type: data.to_type,
      to_id: isToSite && selectedSites.length > 0 ? selectedSites[0].id : data.to_id,
      to_name: isToSite && selectedSites.length > 0 ? selectedSites.map(s => s.name).join(', ') : (data.to_name || null),
      to_address: data.to_address || null,
      vehicle_id: data.vehicle_id || null,
      payment_type: data.payment_type || 'fixed',
      per_km_rate: data.payment_type === 'per_km' ? data.per_km_rate || 0 : null,
      total_distance_km: data.payment_type === 'per_km' ? data.total_distance_km || 0 : null,
      loading_charge: data.loading_charge || 0,
      unloading_charge: data.unloading_charge || 0,
      total_cost: data.total_cost || 0,
      payment_status: data.payment_status || 'pending',
      vehicle_payment_amount: data.vehicle_payment_amount || data.total_cost || 0,
      vehicle_payment_status: data.vehicle_payment_status || 'pending',
      status: data.status || 'scheduled',
      notes: data.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newShipment, error } = await supabase
      .from('solar_shipments')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    // Save delivery points for site shipments
    if (isToSite && selectedSites.length > 0 && newShipment) {
      const deliveryPoints = selectedSites.map((site, index) => ({
        shipment_id: newShipment.id,
        lead_id: site.id,
        delivery_order: index + 1,
        delivery_address: site.address || '',
        delivery_city: site.city || '',
        contact_name: site.name || '',
        delivery_status: 'pending',
        created_at: new Date().toISOString(),
      }));

      const { error: dpError } = await supabase
        .from('shipment_delivery_points')
        .insert(deliveryPoints);

      if (dpError) {
        console.error('Error saving delivery points:', dpError);
      }
    }

    return newShipment;
  },
};

// ============ Branch Expense Service ============
export const branchExpenseService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('branch_expense_categories')
      .select('*')
      .eq('is_active', true)
      .order('category_name');

    if (error) throw error;
    return data || [];
  },

  async getBranches() {
    const { data, error } = await supabase
      .from('branches')
      .select('id, name, city, manager_name')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getAll(filters?: {
    branch_id?: string;
    status?: string;
    expense_type?: string;
    date_from?: string;
    date_to?: string;
  }) {
    let query = supabase
      .from('branch_expenses')
      .select(`
        *,
        branches!branch_expenses_branch_id_fkey(name, city, manager_name),
        branch_expense_categories(category_name)
      `)
      .order('expense_date', { ascending: false });

    if (filters?.branch_id) {
      query = query.eq('branch_id', filters.branch_id);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.expense_type) {
      query = query.eq('expense_type', filters.expense_type);
    }
    if (filters?.date_from) {
      query = query.gte('expense_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('expense_date', filters.date_to);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Map joined data
    return (data || []).map(item => ({
      ...item,
      branch_name: item.branches?.name || null,
      branch_city: item.branches?.city || null,
      manager_name: item.branches?.manager_name || null,
      category_name: item.branch_expense_categories?.category_name || null,
    }));
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('branch_expenses')
      .select(`
        *,
        branches!branch_expenses_branch_id_fkey(name, city, manager_name),
        branch_expense_categories(category_name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? {
      ...data,
      branch_name: data.branches?.name || null,
      branch_city: data.branches?.city || null,
      manager_name: data.branches?.manager_name || null,
      category_name: data.branch_expense_categories?.category_name || null,
    } : null;
  },

  async create(expense: {
    branch_id: string;
    expense_date: string;
    expense_type: string;
    amount: number;
    description: string;
    category_id?: string;
    notes?: string;
    vendor_id?: string;
    recipient_name?: string;
    vendor_contact?: string;
    payment_mode?: string;
    payment_reference?: string;
    payment_date?: string;
    payment_status?: string;
    receipt_url?: string;
    status?: string;
  }) {
    const { data: userData } = await supabase.auth.getUser();

    // Generate expense number
    const timestamp = Date.now().toString().slice(-6);
    const expenseNumber = `EXP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${timestamp}`;

    const payload = {
      expense_number: expenseNumber,
      branch_id: expense.branch_id,
      expense_date: expense.expense_date,
      expense_type: expense.expense_type,
      amount: expense.amount,
      description: expense.description,
      category_id: expense.category_id || null,
      notes: expense.notes || null,
      vendor_id: expense.vendor_id || null,
      recipient_name: expense.recipient_name || null,
      vendor_contact: expense.vendor_contact || null,
      payment_mode: expense.payment_mode || null,
      payment_reference: expense.payment_reference || null,
      payment_date: expense.payment_date || null,
      payment_status: expense.payment_status || null,
      receipt_url: expense.receipt_url || null,
      status: expense.status || 'draft',
      created_by: userData.user?.id,
      created_by_name: userData.user?.user_metadata?.full_name || userData.user?.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('branch_expenses')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: {
    branch_id?: string;
    expense_date?: string;
    expense_type?: string;
    amount?: number;
    description?: string;
    category_id?: string;
    notes?: string;
    vendor_id?: string;
    recipient_name?: string;
    vendor_contact?: string;
    payment_mode?: string;
    payment_reference?: string;
    payment_date?: string;
    payment_status?: string;
    receipt_url?: string;
    status?: string;
    rejection_reason?: string;
  }) {
    const { error } = await supabase
      .from('branch_expenses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return { id, ...updates };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('branch_expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async approve(id: string) {
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('branch_expenses')
      .update({
        status: 'approved',
        approved_by: userData.user?.id,
        approved_at: new Date().toISOString(),
        payment_status: 'Pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
    return { id, status: 'approved' };
  },

  async reject(id: string, reason: string) {
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('branch_expenses')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        approved_by: userData.user?.id,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
    return { id, status: 'rejected' };
  },

  async markAsPaid(id: string, paymentDetails?: {
    payment_mode?: string;
    payment_reference?: string;
    payment_date?: string;
  }) {
    const { error } = await supabase
      .from('branch_expenses')
      .update({
        status: 'paid',
        payment_status: 'Paid',
        payment_mode: paymentDetails?.payment_mode,
        payment_reference: paymentDetails?.payment_reference,
        payment_date: paymentDetails?.payment_date || new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
    return { id, status: 'paid' };
  },

  async getStats(filters?: { branch_id?: string; date_from?: string; date_to?: string }) {
    let query = supabase
      .from('branch_expenses')
      .select('*, branches!branch_expenses_branch_id_fkey(name)');

    if (filters?.branch_id) {
      query = query.eq('branch_id', filters.branch_id);
    }
    if (filters?.date_from) {
      query = query.gte('expense_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('expense_date', filters.date_to);
    }

    const { data, error } = await query;
    if (error) throw error;

    const expenses = data || [];
    const total = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const pending = expenses.filter(e => e.status === 'pending' || e.status === 'draft').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const approved = expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const paid = expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

    // Group by branch
    const byBranch: Record<string, { branch_name: string; total: number; count: number }> = {};
    expenses.forEach(e => {
      const branchId = e.branch_id;
      if (!byBranch[branchId]) {
        byBranch[branchId] = {
          branch_name: e.branches?.name || 'Unknown',
          total: 0,
          count: 0,
        };
      }
      byBranch[branchId].total += parseFloat(e.amount) || 0;
      byBranch[branchId].count += 1;
    });

    return {
      total,
      pending,
      approved,
      paid,
      count: expenses.length,
      byBranch: Object.entries(byBranch).map(([branch_id, data]) => ({
        branch_id,
        ...data,
      })).sort((a, b) => b.total - a.total),
    };
  },

  async getExpenseTypes() {
    return [
      { value: 'rent', label: 'Rent' },
      { value: 'electricity', label: 'Electricity' },
      { value: 'water', label: 'Water' },
      { value: 'internet', label: 'Internet' },
      { value: 'food_canteen', label: 'Food/Canteen' },
      { value: 'stationery', label: 'Stationery' },
      { value: 'printing', label: 'Printing' },
      { value: 'office_supplies', label: 'Office Supplies' },
      { value: 'cleaning', label: 'Cleaning' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'transportation_local', label: 'Local Transportation' },
      { value: 'telephone', label: 'Telephone' },
      { value: 'courier', label: 'Courier' },
      { value: 'other', label: 'Other' },
    ];
  },
};
