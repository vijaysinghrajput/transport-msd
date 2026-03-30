/**
 * Comprehensive Lead Workflow Types
 * Covers entire solar installation process from lead to completion
 */

export type LeadStatus =
  // Initial Stage (6 statuses)
  | 'new'
  | 'contacted'
  | 'site_survey_scheduled'
  | 'site_survey_completed'
  | 'quotation_sent'
  | 'quotation_approved'
  
  // PM Surya Ghar (Subsidy Eligible Only - 4 statuses)
  | 'pm_portal_login_pending'
  | 'pm_portal_registered'
  | 'pm_feasibility_pending'
  | 'pm_feasibility_approved'
  
  // Finance Stage (5 statuses)
  | 'finance_required'
  | 'finance_application_submitted'
  | 'finance_under_review'
  | 'finance_approved'
  | 'finance_disbursed'
  
  // Cash Payment (Alternative to Finance - 3 statuses)
  | 'cash_payment_pending'
  | 'cash_advance_received'
  | 'cash_full_payment_received'
  
  // Installation Stage (3 statuses)
  | 'installation_scheduled'
  | 'installation_in_progress'
  | 'installation_completed'
  
  // Net Meter (Subsidy Eligible Only - 4 statuses)
  | 'net_meter_application_submitted'
  | 'net_meter_approved'
  | 'net_meter_installed'
  | 'system_commissioned'
  
  // Subsidy Stage (Subsidy Eligible Only - 5 statuses)
  | 'subsidy_application_pending'
  | 'subsidy_documents_submitted'
  | 'subsidy_under_review'
  | 'subsidy_approved'
  | 'subsidy_disbursed'
  
  // Payout & Completion (3 statuses)
  | 'payout_pending'
  | 'payout_completed'
  | 'project_completed'
  
  // Other States (3 statuses)
  | 'on_hold'
  | 'cancelled'
  | 'rejected';

// Solar System Types
export type SolarSystemType = 'residential' | 'commercial' | 'industrial' | 'solar_atta_chakki';
export type GridType = 'on_grid' | 'off_grid' | 'hybrid';
export type PaymentType = 'cash' | 'finance';
export type PaymentMode = 'cash' | 'cheque' | 'online' | 'upi';


// Lead Source Types
export type LeadSourceType = 'predefined' | 'user_based';

export interface LeadSource {
  id: string;
  name: string;
  type: LeadSourceType;
  user_id?: string; // For user-based sources
  user_name?: string;
}

// Status History Tracking
export interface LeadStatusHistory {
  id: string;
  lead_id: string;
  old_status: LeadStatus | null;
  new_status: LeadStatus;
  changed_by: string;
  changed_by_name?: string;
  changed_at: string;
  notes?: string;
  metadata?: Record<string, any>;
}

// Payment Tracking (Multiple banks/payments per lead)
export interface LeadPayment {
  id: string;
  lead_id: string;
  payment_type: PaymentType;
  
  // For Finance
  finance_application_id?: string;
  bank_name?: string;
  ifsc_code?: string;
  sanctioned_amount?: number;
  disbursed_amount?: number;
  disbursement_date?: string;
  pending_amount?: number;
  account_number?: string;
  vendor_name?: string;
  approval_status?: 'pending' | 'approved' | 'rejected';
  
  // For Cash
  total_amount?: number;
  paid_amount?: number;
  pending_cash_amount?: number;
  payment_mode?: PaymentMode;
  payment_date?: string;
  payment_reference?: string;
  
  notes?: string;
  created_by?: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

// PM Surya Ghar Portal Tracking
export interface LeadPMSuryaghar {
  id: string;
  lead_id: string;
  portal_login_id?: string;
  portal_password_hint?: string;
  registration_date?: string;
  application_number?: string;
  consumer_number?: string;
  discom_name?: string;
  sanction_load_kw?: number;
  feasibility_status?: 'pending' | 'approved' | 'rejected';
  feasibility_approval_date?: string;
  portal_status?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Net Meter Application & Installation
export interface LeadNetMeter {
  id: string;
  lead_id: string;
  application_number?: string;
  application_date?: string;
  approval_date?: string;
  installation_date?: string;
  meter_number?: string;
  meter_type?: string;
  discom_name?: string;
  agreement_signed: boolean;
  agreement_date?: string;
  commissioning_date?: string;
  first_generation_date?: string;
  monthly_generation_kwh?: number;
  notes?: string;
  created_by?: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

// Document Types for different stages
export type DocumentType =
  // KYC Documents
  | 'aadhaar_card'
  | 'pan_card'
  | 'bank_passbook'
  | 'electricity_bill'
  // PM Surya Ghar Documents
  | 'application_form'
  | 'feasibility_report'
  | 'e_token'
  | 'net_metering_agreement'
  // Finance Documents
  | 'quotation'
  | 'finance_documents'
  | 'digital_approval_letter'
  | 'margin_money_bill'
  // Installation Documents
  | 'installation_working'
  | 'installation_process'
  | 'installation_pending'
  | 'installation_complete'
  | 'installation_photos'
  | 'installation_certificate'
  // Warranty Documents
  | 'warranty_panel'
  | 'warranty_inverter'
  | 'warranty_battery'
  | 'panel_barcode'
  // Net Meter Documents
  | 'net_meter_stamp'
  | 'verified_net_meter_paper'
  // Subsidy Documents
  | 'gps_site_photo'
  | 'customer_site_photo'
  | 'dcr_certificate'
  | 'stamp_certificate'
  | 'subsidy_claim_form'
  | 'subsidy_approval'
  // Other
  | 'payout_invoice'
  | 'completion_certificate'
  | 'other';

export interface LeadDocument {
  id: string;
  lead_id: string;
  document_type: DocumentType;
  document_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  status?: string;
  uploaded_by?: string;
  uploaded_at: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Status Stage Data
export interface StatusStageData {
  status: LeadStatus;
  data: Record<string, any>;
  documents: LeadDocument[];
  updated_at: string;
  updated_by: string;
}


export interface Lead {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  alternate_phone?: string;
  
  // Location Details
  state_id: string;
  state_name: string;
  district_id: string;
  district_name: string;
  city_id: string;
  city_name: string;
  area_id?: string;
  area_name?: string;
  pin_code: string;
  address: string;
  
  // Lead Source
  lead_source_type: LeadSourceType;
  lead_source_name: string;
  lead_source_user_id?: string;
  lead_source_user_name?: string;
  source_user_role?: string;
  
  // Solar System Details
  solar_system_type: SolarSystemType;
  grid_type: GridType;
  system_size_kw: number;
  estimated_cost: number;
  final_cost?: number;
  is_subsidy_eligible: boolean;
  
  // Status and Assignment
  status: LeadStatus;
  assigned_to?: string;
  assigned_to_name?: string;
  assigned_by?: string;
  assigned_at?: string;
  
  // Related Data (from other tables)
  status_history?: LeadStatusHistory[];
  payments?: LeadPayment[];
  pm_suryaghar?: LeadPMSuryaghar;
  net_meter?: LeadNetMeter;
  current_stage_data?: Record<string, any>;
  
  // Documents
  documents?: LeadDocument[];
  
  // Metadata
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  created_by_name: string;
  branch_id: string;
  branch_name: string;
}


/**
 * Status flow mapping for workflow visualization
 */
export const STATUS_FLOW = {
  // Subsidy Eligible Flow (Residential + On-Grid/Hybrid)
  SUBSIDY_ELIGIBLE: [
    'new',
    'contacted',
    'site_survey_scheduled',
    'site_survey_completed',
    'quotation_sent',
    'quotation_approved',
    'pm_portal_login_pending',
    'pm_portal_registered',
    'pm_feasibility_pending',
    'pm_feasibility_approved',
    // Then either finance or cash
    'finance_required', // OR 'cash_payment_pending',
    'finance_application_submitted',
    'finance_under_review',
    'finance_approved',
    'finance_disbursed',
    'installation_scheduled',
    'installation_in_progress',
    'installation_completed',
    'net_meter_application_submitted',
    'net_meter_approved',
    'net_meter_installed',
    'system_commissioned',
    'subsidy_application_pending',
    'subsidy_documents_submitted',
    'subsidy_under_review',
    'subsidy_approved',
    'subsidy_disbursed',
    'payout_pending',
    'payout_completed',
    'project_completed',
  ] as LeadStatus[],

  // Non-Subsidy Eligible Flow (Commercial OR Off-Grid)
  NON_SUBSIDY_ELIGIBLE: [
    'new',
    'contacted',
    'site_survey_scheduled',
    'site_survey_completed',
    'quotation_sent',
    'quotation_approved',
    // Then either finance or cash (No PM Portal, No Net Meter, No Subsidy)
    'finance_required', // OR 'cash_payment_pending',
    'finance_application_submitted',
    'finance_under_review',
    'finance_approved',
    'finance_disbursed',
    'installation_scheduled',
    'installation_in_progress',
    'installation_completed',
    'payout_pending',
    'payout_completed',
    'project_completed',
  ] as LeadStatus[],

  // Cash Payment Alternative (Can be used in both flows)
  CASH_FLOW: [
    'cash_payment_pending',
    'cash_advance_received',
    'cash_full_payment_received',
  ] as LeadStatus[],
};

/**
 * Status categories for grouping
 */
export const STATUS_CATEGORIES = {
  INITIAL: ['new', 'contacted', 'site_survey_scheduled', 'site_survey_completed'],
  QUOTATION: ['quotation_sent', 'quotation_approved'],
  PM_SURYA: ['pm_portal_login_pending', 'pm_portal_registered', 'pm_feasibility_pending', 'pm_feasibility_approved'],
  FINANCE: ['finance_required', 'finance_application_submitted', 'finance_under_review', 'finance_approved', 'finance_disbursed'],
  CASH: ['cash_payment_pending', 'cash_advance_received', 'cash_full_payment_received'],
  INSTALLATION: ['installation_scheduled', 'installation_in_progress', 'installation_completed'],
  NET_METER: ['net_meter_application_submitted', 'net_meter_approved', 'net_meter_installed', 'system_commissioned'],
  SUBSIDY: ['subsidy_application_pending', 'subsidy_documents_submitted', 'subsidy_under_review', 'subsidy_approved', 'subsidy_disbursed'],
  COMPLETION: ['payout_pending', 'payout_completed', 'project_completed'],
  OTHER: ['on_hold', 'cancelled', 'rejected'],
} as const;

/**
 * User-friendly status labels
 */
export const STATUS_LABELS: Record<LeadStatus, string> = {
  // Initial
  new: 'New Lead',
  contacted: 'Contacted',
  site_survey_scheduled: 'Site Survey Scheduled',
  site_survey_completed: 'Site Survey Completed',
  quotation_sent: 'Quotation Sent',
  quotation_approved: 'Quotation Approved',
  
  // PM Surya
  pm_portal_login_pending: 'PM Portal Login Pending',
  pm_portal_registered: 'PM Portal Registered',
  pm_feasibility_pending: 'Feasibility Pending',
  pm_feasibility_approved: 'Feasibility Approved',
  
  // Finance
  finance_required: 'Finance Required',
  finance_application_submitted: 'Finance Application Submitted',
  finance_under_review: 'Finance Under Review',
  finance_approved: 'Finance Approved',
  finance_disbursed: 'Finance Disbursed',
  
  // Cash
  cash_payment_pending: 'Cash Payment Pending',
  cash_advance_received: 'Advance Received',
  cash_full_payment_received: 'Full Payment Received',
  
  // Installation
  installation_scheduled: 'Installation Scheduled',
  installation_in_progress: 'Installation In Progress',
  installation_completed: 'Installation Completed',
  
  // Net Meter
  net_meter_application_submitted: 'Net Meter Application Submitted',
  net_meter_approved: 'Net Meter Approved',
  net_meter_installed: 'Net Meter Installed',
  system_commissioned: 'System Commissioned',
  
  // Subsidy
  subsidy_application_pending: 'Subsidy Application Pending',
  subsidy_documents_submitted: 'Subsidy Documents Submitted',
  subsidy_under_review: 'Subsidy Under Review',
  subsidy_approved: 'Subsidy Approved',
  subsidy_disbursed: 'Subsidy Disbursed',
  
  // Completion
  payout_pending: 'Payout Pending',
  payout_completed: 'Payout Completed',
  project_completed: 'Project Completed',
  
  // Other
  on_hold: 'On Hold',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

/**
 * Status colors for UI
 */
export const STATUS_COLORS: Record<LeadStatus, string> = {
  // Initial - Blue
  new: '#2196F3',
  contacted: '#2196F3',
  site_survey_scheduled: '#2196F3',
  site_survey_completed: '#2196F3',
  quotation_sent: '#2196F3',
  quotation_approved: '#1976D2',
  
  // PM Surya - Orange
  pm_portal_login_pending: '#FF9800',
  pm_portal_registered: '#FF9800',
  pm_feasibility_pending: '#FF9800',
  pm_feasibility_approved: '#F57C00',
  
  // Finance - Green
  finance_required: '#4CAF50',
  finance_application_submitted: '#4CAF50',
  finance_under_review: '#4CAF50',
  finance_approved: '#2E7D32',
  finance_disbursed: '#1B5E20',
  
  // Cash - Teal
  cash_payment_pending: '#009688',
  cash_advance_received: '#009688',
  cash_full_payment_received: '#00695C',
  
  // Installation - Purple
  installation_scheduled: '#9C27B0',
  installation_in_progress: '#9C27B0',
  installation_completed: '#7B1FA2',
  
  // Net Meter - Indigo
  net_meter_application_submitted: '#3F51B5',
  net_meter_approved: '#3F51B5',
  net_meter_installed: '#303F9F',
  system_commissioned: '#1A237E',
  
  // Subsidy - Deep Orange
  subsidy_application_pending: '#FF5722',
  subsidy_documents_submitted: '#FF5722',
  subsidy_under_review: '#FF5722',
  subsidy_approved: '#E64A19',
  subsidy_disbursed: '#BF360C',
  
  // Completion - Success Green
  payout_pending: '#8BC34A',
  payout_completed: '#689F38',
  project_completed: '#33691E',
  
  // Other - Gray/Red
  on_hold: '#9E9E9E',
  cancelled: '#F44336',
  rejected: '#D32F2F',
};


// Document types constant - matches database enum
export const DOCUMENT_TYPES = {
  // KYC Documents
  AADHAAR_CARD: 'aadhaar_card' as DocumentType,
  PAN_CARD: 'pan_card' as DocumentType,
  BANK_PASSBOOK: 'bank_passbook' as DocumentType,
  ELECTRICITY_BILL: 'electricity_bill' as DocumentType,
  
  // PM Surya Ghar Documents
  APPLICATION_FORM: 'application_form' as DocumentType,
  FEASIBILITY_REPORT: 'feasibility_report' as DocumentType,
  E_TOKEN: 'e_token' as DocumentType,
  NET_METERING_AGREEMENT: 'net_metering_agreement' as DocumentType,
  
  // Finance Documents
  QUOTATION: 'quotation' as DocumentType,
  FINANCE_DOCUMENTS: 'finance_documents' as DocumentType,
  DIGITAL_APPROVAL_LETTER: 'digital_approval_letter' as DocumentType,
  MARGIN_MONEY_BILL: 'margin_money_bill' as DocumentType,
  
  // Installation Documents
  INSTALLATION_WORKING: 'installation_working' as DocumentType,
  INSTALLATION_PROCESS: 'installation_process' as DocumentType,
  INSTALLATION_PENDING: 'installation_pending' as DocumentType,
  INSTALLATION_COMPLETE: 'installation_complete' as DocumentType,
  INSTALLATION_PHOTOS: 'installation_photos' as DocumentType,
  INSTALLATION_CERTIFICATE: 'installation_certificate' as DocumentType,
  
  // Warranty Documents
  WARRANTY_PANEL: 'warranty_panel' as DocumentType,
  WARRANTY_INVERTER: 'warranty_inverter' as DocumentType,
  WARRANTY_BATTERY: 'warranty_battery' as DocumentType,
  PANEL_BARCODE: 'panel_barcode' as DocumentType,
  
  // Net Meter Documents
  NET_METER_STAMP: 'net_meter_stamp' as DocumentType,
  VERIFIED_NET_METER_PAPER: 'verified_net_meter_paper' as DocumentType,
  
  // Subsidy Documents
  GPS_SITE_PHOTO: 'gps_site_photo' as DocumentType,
  CUSTOMER_SITE_PHOTO: 'customer_site_photo' as DocumentType,
  DCR_CERTIFICATE: 'dcr_certificate' as DocumentType,
  STAMP_CERTIFICATE: 'stamp_certificate' as DocumentType,
  SUBSIDY_CLAIM_FORM: 'subsidy_claim_form' as DocumentType,
  SUBSIDY_APPROVAL: 'subsidy_approval' as DocumentType,
  
  // Other
  PAYOUT_INVOICE: 'payout_invoice' as DocumentType,
  COMPLETION_CERTIFICATE: 'completion_certificate' as DocumentType,
  OTHER: 'other' as DocumentType,
} as const;

/**
 * Required documents for each status
 * Maps status to required document types
 */
export const REQUIRED_DOCUMENTS_BY_STATUS: Partial<Record<LeadStatus, DocumentType[]>> = {
  // Initial Stage
  new: [DOCUMENT_TYPES.AADHAAR_CARD, DOCUMENT_TYPES.PAN_CARD, DOCUMENT_TYPES.BANK_PASSBOOK, DOCUMENT_TYPES.ELECTRICITY_BILL],
  quotation_sent: [DOCUMENT_TYPES.QUOTATION],
  
  // PM Surya (Subsidy Eligible Only)
  pm_portal_login_pending: [DOCUMENT_TYPES.APPLICATION_FORM, DOCUMENT_TYPES.ELECTRICITY_BILL],
  pm_feasibility_pending: [DOCUMENT_TYPES.FEASIBILITY_REPORT, DOCUMENT_TYPES.E_TOKEN],
  
  // Finance
  finance_application_submitted: [DOCUMENT_TYPES.QUOTATION, DOCUMENT_TYPES.FINANCE_DOCUMENTS, DOCUMENT_TYPES.DIGITAL_APPROVAL_LETTER],
  finance_approved: [DOCUMENT_TYPES.MARGIN_MONEY_BILL],
  
  // Installation
  installation_in_progress: [DOCUMENT_TYPES.INSTALLATION_WORKING, DOCUMENT_TYPES.INSTALLATION_PROCESS],
  installation_completed: [
    DOCUMENT_TYPES.INSTALLATION_COMPLETE,
    DOCUMENT_TYPES.INSTALLATION_PHOTOS,
    DOCUMENT_TYPES.INSTALLATION_CERTIFICATE,
    DOCUMENT_TYPES.WARRANTY_PANEL,
    DOCUMENT_TYPES.WARRANTY_INVERTER,
  ],
  
  // Net Meter (Subsidy Eligible Only)
  net_meter_application_submitted: [DOCUMENT_TYPES.NET_METERING_AGREEMENT],
  net_meter_approved: [DOCUMENT_TYPES.NET_METER_STAMP],
  net_meter_installed: [DOCUMENT_TYPES.VERIFIED_NET_METER_PAPER],
  
  // Subsidy (Subsidy Eligible Only)
  subsidy_documents_submitted: [
    DOCUMENT_TYPES.GPS_SITE_PHOTO,
    DOCUMENT_TYPES.CUSTOMER_SITE_PHOTO,
    DOCUMENT_TYPES.DCR_CERTIFICATE,
    DOCUMENT_TYPES.STAMP_CERTIFICATE,
    DOCUMENT_TYPES.SUBSIDY_CLAIM_FORM,
  ],
  subsidy_approved: [DOCUMENT_TYPES.SUBSIDY_APPROVAL],
  
  // Completion
  payout_pending: [DOCUMENT_TYPES.PAYOUT_INVOICE],
  project_completed: [DOCUMENT_TYPES.COMPLETION_CERTIFICATE],
};

// Predefined lead sources
export const PREDEFINED_SOURCES = [
  { id: 'website', name: 'Website', type: 'predefined' as LeadSourceType },
  { id: 'facebook', name: 'Facebook', type: 'predefined' as LeadSourceType },
  { id: 'google', name: 'Google Ads', type: 'predefined' as LeadSourceType },
  { id: 'instagram', name: 'Instagram', type: 'predefined' as LeadSourceType },
  { id: 'referral', name: 'Referral', type: 'predefined' as LeadSourceType },
  { id: 'walk_in', name: 'Walk-in', type: 'predefined' as LeadSourceType },
  { id: 'whatsapp', name: 'WhatsApp', type: 'predefined' as LeadSourceType },
  { id: 'justdial', name: 'JustDial', type: 'predefined' as LeadSourceType }
] as const;

// System type options
export const SOLAR_SYSTEM_OPTIONS = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'solar_atta_chakki', label: 'Solar Atta Chakki' }
] as const;

export const GRID_TYPE_OPTIONS = [
  { value: 'on_grid', label: 'On Grid' },
  { value: 'off_grid', label: 'Off Grid' },
  { value: 'hybrid', label: 'Hybrid' }
] as const;

/**
 * Helper function to determine if a lead is subsidy eligible
 * Subsidy eligible = Residential + (On Grid OR Hybrid)
 */
export function isSubsidyEligible(solarCategory: SolarSystemType, systemType: GridType): boolean {
  // Only residential properties with on-grid or hybrid systems are eligible for PM Surya Ghar subsidy
  return solarCategory === 'residential' && (systemType === 'on_grid' || systemType === 'hybrid');
}

/**
 * Helper function to get next possible statuses based on current status and subsidy eligibility
 */
export function getNextStatuses(currentStatus: LeadStatus, isSubsidyEligible: boolean): LeadStatus[] {
  const statusMap: Record<LeadStatus, { next: LeadStatus[], subsidyOnly?: boolean }> = {
    new: { next: ['contacted'] },
    contacted: { next: ['site_survey_scheduled', 'on_hold', 'cancelled'] },
    site_survey_scheduled: { next: ['site_survey_completed', 'cancelled'] },
    site_survey_completed: { next: ['quotation_sent'] },
    quotation_sent: { next: ['quotation_approved', 'rejected'] },
    quotation_approved: { 
      next: isSubsidyEligible 
        ? ['pm_portal_login_pending'] 
        : ['finance_required', 'cash_payment_pending']
    },
    
    // PM Surya Flow
    pm_portal_login_pending: { next: ['pm_portal_registered'], subsidyOnly: true },
    pm_portal_registered: { next: ['pm_feasibility_pending'], subsidyOnly: true },
    pm_feasibility_pending: { next: ['pm_feasibility_approved', 'rejected'], subsidyOnly: true },
    pm_feasibility_approved: { next: ['finance_required', 'cash_payment_pending'], subsidyOnly: true },
    
    // Finance Flow
    finance_required: { next: ['finance_application_submitted'] },
    finance_application_submitted: { next: ['finance_under_review'] },
    finance_under_review: { next: ['finance_approved', 'rejected'] },
    finance_approved: { next: ['finance_disbursed'] },
    finance_disbursed: { next: ['installation_scheduled'] },
    
    // Cash Flow
    cash_payment_pending: { next: ['cash_advance_received'] },
    cash_advance_received: { next: ['cash_full_payment_received', 'installation_scheduled'] },
    cash_full_payment_received: { next: ['installation_scheduled'] },
    
    // Installation Flow
    installation_scheduled: { next: ['installation_in_progress'] },
    installation_in_progress: { next: ['installation_completed'] },
    installation_completed: { 
      next: isSubsidyEligible 
        ? ['net_meter_application_submitted'] 
        : ['payout_pending']
    },
    
    // Net Meter Flow
    net_meter_application_submitted: { next: ['net_meter_approved'], subsidyOnly: true },
    net_meter_approved: { next: ['net_meter_installed'], subsidyOnly: true },
    net_meter_installed: { next: ['system_commissioned'], subsidyOnly: true },
    system_commissioned: { next: ['subsidy_application_pending'], subsidyOnly: true },
    
    // Subsidy Flow
    subsidy_application_pending: { next: ['subsidy_documents_submitted'], subsidyOnly: true },
    subsidy_documents_submitted: { next: ['subsidy_under_review'], subsidyOnly: true },
    subsidy_under_review: { next: ['subsidy_approved', 'rejected'], subsidyOnly: true },
    subsidy_approved: { next: ['subsidy_disbursed'], subsidyOnly: true },
    subsidy_disbursed: { next: ['payout_pending'], subsidyOnly: true },
    
    // Completion Flow
    payout_pending: { next: ['payout_completed'] },
    payout_completed: { next: ['project_completed'] },
    project_completed: { next: [] },
    
    // Terminal States
    on_hold: { next: ['contacted', 'cancelled'] },
    cancelled: { next: [] },
    rejected: { next: [] },
  };

  const config = statusMap[currentStatus];
  if (!config) return [];
  
  // Filter out subsidy-only statuses if not eligible
  if (config.subsidyOnly && !isSubsidyEligible) return [];
  
  return config.next;
}

