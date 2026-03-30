/**
 * Lead Filter Utility Functions
 * Handles filtering logic with role-based permissions
 */

import { UserRole } from '@/config/roles';
import type { Dayjs } from 'dayjs';

// Define LeadFilterValues type locally
export interface LeadFilterValues {
  searchText?: string;
  status?: string[];
  source?: string[];
  solarCategory?: string[];
  systemType?: string[];
  paymentType?: string[];
  stateId?: string;
  districtId?: string;
  cityId?: string;
  areaId?: string;
  branchId?: string;
  assignedTo?: string;
  createdBy?: string;
  dateRange?: [Dayjs, Dayjs] | null;
  createdDateRange?: [Dayjs, Dayjs] | null;
  followUpDateRange?: [Dayjs, Dayjs] | null;
  minAmount?: number;
  maxAmount?: number;
  hasQuotation?: boolean;
  hasSubsidy?: boolean;
  subsidyEligible?: boolean;
  capacityRange?: [number, number] | null;
}

export interface User {
  id: string;
  role: string;
  branch_id?: string;
  territory_id?: string;
  state_id?: string;
}

/**
 * Build Supabase query with role-based access control
 */
export const buildLeadQuery = (supabaseClient: any, currentUser: User) => {
  let query = supabaseClient
    .from('leads')
    .select(
      `
      *,
      branches:branch_id(name, branch_number, manager_name, city),
      states:state_id(name, code),
      districts:district_id(name),
      cities:city_id(name),
      areas:area_id(name, pincode)
    `
    );

  // If no user, return empty query (safety)
  if (!currentUser || !currentUser.id) {
    return query.eq('id', '00000000-0000-0000-0000-000000000000'); // Never matches
  }

  // Apply role-based data restrictions
  const role = currentUser.role?.toLowerCase();
  
  switch (role) {
    case 'branch_manager':
    case 'assistant_branch_manager':
      // Only leads from their branch
      if (currentUser.branch_id) {
        query = query.eq('branch_id', currentUser.branch_id);
      }
      break;

    case 'area_manager':
      // For now, show leads from user's branch
      // TODO: Implement proper territory-based filtering
      if (currentUser.branch_id) {
        query = query.eq('branch_id', currentUser.branch_id);
      }
      break;

    case 'state_manager':
      // Leads from their state
      if (currentUser.state_id) {
        query = query.eq('state_id', currentUser.state_id);
      }
      break;

    case 'sales_staff':
      // Only leads assigned to them or created by them
      query = query.or(`assigned_to.eq.${currentUser.id},created_by.eq.${currentUser.id}`);
      break;

    case 'subsidy_staff':
      // Leads in subsidy workflow stages
      const subsidyStatuses = [
        'pm_portal_login_pending',
        'pm_portal_registered',
        'pm_feasibility_pending',
        'pm_feasibility_approved',
        'subsidy_application_pending',
        'subsidy_documents_submitted',
        'subsidy_under_review',
        'subsidy_approved',
        'subsidy_disbursed'
      ];
      query = query.in('status', subsidyStatuses);
      break;

    case 'installation_team':
      // Leads in installation stages
      const installationStatuses = [
        'installation_scheduled',
        'installation_in_progress',
        'installation_completed',
        'net_meter_application_submitted',
        'net_meter_approved',
        'net_meter_installed',
        'system_commissioned'
      ];
      query = query.in('status', installationStatuses);
      break;

    case 'admin_staff':
      // Only leads from their branch
      if (currentUser.branch_id) {
        query = query.eq('branch_id', currentUser.branch_id);
      }
      break;

    case 'director':
    case 'sales_head':
    case 'ops_head':
    case 'hr_head':
    case 'regional_manager':
      // Full access - no restrictions
      break;

    default:
      // For unknown roles, show all leads (admin access)
      // Or restrict based on your security requirements
      break;
  }

  return query;
};

/**
 * Apply filter values to a query
 */
export const applyFilters = (query: any, filters: LeadFilterValues) => {
  // Text search across multiple fields
  if (filters.searchText && filters.searchText.trim()) {
    const searchTerm = filters.searchText.trim();
    query = query.or(
      `customer_name.ilike.%${searchTerm}%,` +
      `mobile.ilike.%${searchTerm}%,` +
      `email.ilike.%${searchTerm}%,` +
      `address.ilike.%${searchTerm}%,` +
      `city.ilike.%${searchTerm}%`
    );
  }

  // Status filter
  if (filters.status && filters.status.length > 0) {
    query = query.in('status', filters.status);
  }

  // Source filter
  if (filters.source && filters.source.length > 0) {
    query = query.in('source', filters.source);
  }

  // Solar category filter
  if (filters.solarCategory && filters.solarCategory.length > 0) {
    query = query.in('solar_category', filters.solarCategory);
  }

  // System type filter
  if (filters.systemType && filters.systemType.length > 0) {
    query = query.in('system_type', filters.systemType);
  }

  // Payment type filter
  if (filters.paymentType && filters.paymentType.length > 0) {
    query = query.in('payment_type', filters.paymentType);
  }

  // Location filters
  if (filters.stateId) {
    query = query.eq('state_id', filters.stateId);
  }
  if (filters.districtId) {
    query = query.eq('district_id', filters.districtId);
  }
  if (filters.cityId) {
    query = query.eq('city_id', filters.cityId);
  }
  if (filters.areaId) {
    query = query.eq('area_id', filters.areaId);
  }

  // Branch filter
  if (filters.branchId) {
    query = query.eq('branch_id', filters.branchId);
  }

  // Created by filter
  if (filters.createdBy) {
    query = query.eq('created_by', filters.createdBy);
  }

  // Assigned to filter
  if (filters.assignedTo) {
    query = query.eq('assigned_to', filters.assignedTo);
  }

  // Subsidy eligible filter
  if (filters.subsidyEligible !== undefined) {
    query = query.eq('subsidy_eligible', filters.subsidyEligible);
  }

  // Date range filter
  if (filters.dateRange && filters.dateRange.length === 2) {
    const [startDate, endDate] = filters.dateRange;
    if (startDate && endDate) {
      query = query
        .gte('created_at', startDate.startOf('day').toISOString())
        .lte('created_at', endDate.endOf('day').toISOString());
    }
  }

  // Capacity range filter
  if (filters.capacityRange && filters.capacityRange.length === 2) {
    const [minCapacity, maxCapacity] = filters.capacityRange;
    if (minCapacity !== undefined) {
      query = query.gte('capacity_kw', minCapacity);
    }
    if (maxCapacity !== undefined) {
      query = query.lte('capacity_kw', maxCapacity);
    }
  }

  return query;
};

/**
 * Filter leads in memory (client-side filtering for additional criteria)
 */
export const filterLeadsClientSide = (leads: any[], filters: LeadFilterValues): any[] => {
  let filtered = [...leads];

  // Additional client-side filters can be added here
  // This is useful for complex filters that can't be done in Supabase

  return filtered;
};

/**
 * Get role-appropriate status options
 * Different roles should see different status workflows
 */
export const getRoleStatusOptions = (role: string): string[] => {
  switch (role) {
    case UserRole.SALES_STAFF:
      return [
        'new',
        'contacted',
        'site_survey_scheduled',
        'site_survey_completed',
        'quotation_sent',
        'quotation_approved',
        'on_hold',
        'cancelled'
      ];

    case UserRole.SUBSIDY_STAFF:
      return [
        'pm_portal_login_pending',
        'pm_portal_registered',
        'pm_feasibility_pending',
        'pm_feasibility_approved',
        'subsidy_application_pending',
        'subsidy_documents_submitted',
        'subsidy_under_review',
        'subsidy_approved',
        'subsidy_disbursed'
      ];

    case UserRole.INSTALLATION_TEAM:
      return [
        'installation_scheduled',
        'installation_in_progress',
        'installation_completed',
        'net_meter_application_submitted',
        'net_meter_approved',
        'net_meter_installed',
        'system_commissioned'
      ];

    default:
      // Managers and admins see all statuses
      return [];
  }
};

/**
 * Get analytics summary for filtered leads
 */
export const getLeadAnalytics = (leads: any[]) => {
  const analytics = {
    total: leads.length,
    byStatus: {} as Record<string, number>,
    bySource: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    byPaymentType: {} as Record<string, number>,
    totalCapacity: 0,
    avgCapacity: 0,
    subsidyEligible: 0,
    totalEstimatedValue: 0
  };

  leads.forEach(lead => {
    // Status breakdown
    if (lead.status) {
      analytics.byStatus[lead.status] = (analytics.byStatus[lead.status] || 0) + 1;
    }

    // Source breakdown (lead_source_name field)
    if (lead.lead_source_name) {
      analytics.bySource[lead.lead_source_name] = (analytics.bySource[lead.lead_source_name] || 0) + 1;
    }

    // Category breakdown (solar_system_type field)
    if (lead.solar_system_type) {
      analytics.byCategory[lead.solar_system_type] = (analytics.byCategory[lead.solar_system_type] || 0) + 1;
    }

    // Payment type breakdown (from payments array)
    if (lead.payments && lead.payments.length > 0) {
      const paymentType = lead.payments[0].payment_type;
      if (paymentType) {
        analytics.byPaymentType[paymentType] = (analytics.byPaymentType[paymentType] || 0) + 1;
      }
    }

    // Capacity calculations (system_size_kw field)
    if (lead.system_size_kw) {
      analytics.totalCapacity += parseFloat(lead.system_size_kw.toString());
    }

    // Subsidy eligible count (is_subsidy_eligible field)
    if (lead.is_subsidy_eligible) {
      analytics.subsidyEligible++;
    }

    // Total estimated value (estimated_cost field)
    if (lead.estimated_cost) {
      analytics.totalEstimatedValue += parseFloat(lead.estimated_cost.toString());
    }
  });

  analytics.avgCapacity = analytics.total > 0 ? analytics.totalCapacity / analytics.total : 0;

  return analytics;
};

/**
 * Export leads to CSV based on filters
 */
export const exportLeadsToCSV = (leads: any[], filename: string = 'leads_export.csv') => {
  if (leads.length === 0) {
    return;
  }

  // Define columns to export
  const columns = [
    { key: 'customer_name', label: 'Customer Name' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
    { key: 'capacity_kw', label: 'Capacity (kW)' },
    { key: 'system_type', label: 'System Type' },
    { key: 'solar_category', label: 'Category' },
    { key: 'source', label: 'Source' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'created_at', label: 'Created Date' }
  ];

  // Create CSV header
  const header = columns.map(col => col.label).join(',');

  // Create CSV rows
  const rows = leads.map(lead => {
    return columns.map(col => {
      let value = lead[col.key] || '';
      
      // Handle nested objects
      if (col.key === 'city' && lead.cities) value = lead.cities.name;
      if (col.key === 'state' && lead.states) value = lead.states.name;
      
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    }).join(',');
  });

  // Combine header and rows
  const csv = [header, ...rows].join('\n');

  // Create download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
