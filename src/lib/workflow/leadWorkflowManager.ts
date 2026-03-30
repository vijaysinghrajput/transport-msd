/**
 * Lead Workflow Manager
 * Handles all lead status transitions, validations, and related data management
 */

import { supabase } from '@/lib/supabaseClient';
import { notifyLeadStatusChange, notifyPaymentReceived } from '@/lib/notificationService';
import type {
  LeadStatus,
  Lead,
  LeadStatusHistory,
  LeadPayment,
  LeadPMSuryaghar,
  LeadNetMeter,
  PaymentType,
  PaymentMode,
} from '@/types/lead-new';
import { isSubsidyEligible, getNextStatuses, STATUS_LABELS } from '@/types/lead-new';

// ============================================================================
// INTERFACES
// ============================================================================

export interface StatusChangeInput {
  leadId: string;
  newStatus: LeadStatus;
  notes?: string;
  userId: string;
  userName: string;
  metadata?: Record<string, any>;
}

export interface PaymentInput {
  leadId: string;
  paymentType: PaymentType;
  // Finance fields
  bankName?: string;
  ifscCode?: string;
  sanctionedAmount?: number;
  disbursedAmount?: number;
  disbursementDate?: string;
  utrNumber?: string;
  vendorName?: string;
  // Cash fields
  totalAmount?: number;
  paidAmount?: number;
  paymentMode?: PaymentMode;
  paymentDate?: string;
  paymentReference?: string;
  // Common
  notes?: string;
  userId: string;
  userName: string;
}

export interface PMSuryaInput {
  leadId: string;
  portalLoginId?: string;
  portalPasswordHint?: string;
  registrationDate?: string;
  applicationNumber?: string;
  consumerNumber?: string;
  discomName?: string;
  sanctionLoadKw?: number;
  feasibilityStatus?: 'pending' | 'approved' | 'rejected';
  feasibilityApprovalDate?: string;
  portalStatus?: 'pending' | 'registered' | 'feasibility_pending' | 'feasibility_approved' | 'rejected';
  notes?: string;
  userId: string;
  userName: string;
}

export interface NetMeterInput {
  leadId: string;
  applicationNumber?: string;
  applicationDate?: string;
  approvalDate?: string;
  installationDate?: string;
  meterNumber?: string;
  meterType?: string;
  discomName?: string;
  agreementSigned?: boolean;
  agreementDate?: string;
  commissioningDate?: string;
  firstGenerationDate?: string;
  monthlyGenerationKwh?: number;
  notes?: string;
  userId: string;
  userName: string;
}

export interface WorkflowValidation {
  isValid: boolean;
  canProceed: boolean;
  errors: string[];
  warnings: string[];
  nextPossibleStatuses: LeadStatus[];
  requiredActions: string[];
}

// ============================================================================
// STATUS CHANGE MANAGEMENT
// ============================================================================

/**
 * Change lead status with validation and history tracking
 */
export async function changeLeadStatus(input: StatusChangeInput): Promise<{
  success: boolean;
  error?: string;
  lead?: Lead;
}> {
  try {
    const { leadId, newStatus, notes, userId, userName, metadata } = input;

    // Get current lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      return { success: false, error: 'Lead not found' };
    }

    const currentStatus = lead.status as LeadStatus;
    
    // Check subsidy eligibility using multiple field name variations
    // Database fields: solar_category (or old: property_type) = residential/commercial/industrial/solar_atta_chakki
    //                 system_type (or old: grid_type) = on_grid/off_grid/hybrid
    const solarCategory = (lead as any).solar_category || (lead as any).property_type || lead.solar_system_type;
    const systemType = (lead as any).system_type || lead.grid_type;
    const eligible = isSubsidyEligible(solarCategory, systemType);

    // Validate transition
    const validation = validateStatusTransition(currentStatus, newStatus, eligible);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(', ') };
    }

    // Update lead status
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Create status history record
    const { error: historyError } = await supabase
      .from('lead_status_history')
      .insert({
        lead_id: leadId,
        old_status: currentStatus,
        new_status: newStatus,
        changed_by: userId,
        changed_by_name: userName,
        notes: notes || null,
        metadata: metadata || {},
        is_skipped: false,
      });

    if (historyError) {
      console.error('Failed to create status history:', historyError);
      // Don't fail the whole operation
    }

    // Get updated lead
    const { data: updatedLead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    // Send notification to lead owner (async, don't wait)
    notifyLeadStatusChange(
      leadId,
      currentStatus,
      newStatus,
      userId,
      userName
    ).catch((err) => console.error('Notification error:', err));

    return { success: true, lead: updatedLead as Lead };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Skip a status in the workflow (mark as skipped, don't update lead status)
 */
export async function skipLeadStatus(input: StatusChangeInput): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { leadId, newStatus, notes, userId, userName } = input;

    // Get current lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      return { success: false, error: 'Lead not found' };
    }

    const currentStatus = lead.status as LeadStatus;

    // Create status history record marked as skipped
    const { error: historyError } = await supabase
      .from('lead_status_history')
      .insert({
        lead_id: leadId,
        old_status: currentStatus,
        new_status: newStatus,
        changed_by: userId,
        changed_by_name: userName,
        notes: notes || 'Status skipped',
        metadata: { skipped: true },
        is_skipped: true,
      });

    if (historyError) {
      console.error('Failed to create skip history:', historyError);
      return { success: false, error: historyError.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Complete an entire workflow stage (auto-completes all sub-statuses)
 * @param stageStatuses - Array of statuses in the stage to complete
 * @param targetStatus - The final status to set (last status in the stage)
 */
export async function completeWorkflowStage(
  leadId: string,
  stageStatuses: readonly LeadStatus[],
  targetStatus: LeadStatus,
  userId: string,
  userName: string,
  notes?: string
): Promise<{
  success: boolean;
  error?: string;
  lead?: Lead;
}> {
  try {
    // Get current lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      return { success: false, error: 'Lead not found' };
    }

    const currentStatus = lead.status as LeadStatus;
    
    // Check subsidy eligibility using multiple field name variations
    // Database fields: solar_category (or old: property_type) = residential/commercial/industrial/solar_atta_chakki
    //                 system_type (or old: grid_type) = on_grid/off_grid/hybrid
    const solarCategory = (lead as any).solar_category || (lead as any).property_type || lead.solar_system_type;
    const systemType = (lead as any).system_type || lead.grid_type;
    const eligible = isSubsidyEligible(solarCategory, systemType);

    // Validate that target status is subsidy-compatible
    const subsidyOnlyStatuses: LeadStatus[] = [
      'pm_portal_login_pending',
      'pm_portal_registered',
      'pm_feasibility_pending',
      'pm_feasibility_approved',
      'net_meter_application_submitted',
      'net_meter_approved',
      'net_meter_installed',
      'system_commissioned',
      'subsidy_application_pending',
      'subsidy_documents_submitted',
      'subsidy_under_review',
      'subsidy_approved',
      'subsidy_disbursed',
    ];

    if (subsidyOnlyStatuses.includes(targetStatus) && !eligible) {
      return { success: false, error: 'This stage is only for subsidy-eligible leads' };
    }

    // Get existing status history to avoid duplicates
    const { data: existingHistory } = await supabase
      .from('lead_status_history')
      .select('new_status')
      .eq('lead_id', leadId);

    const completedStatuses = new Set(existingHistory?.map(h => h.new_status) || []);

    // Create history records for all statuses in the stage (except those already completed)
    const historyRecords = [];
    let previousStatus = currentStatus;

    for (const status of stageStatuses) {
      if (!completedStatuses.has(status)) {
        historyRecords.push({
          lead_id: leadId,
          old_status: previousStatus,
          new_status: status,
          changed_by: userId,
          changed_by_name: userName,
          notes: status === targetStatus ? (notes || `Completed ${STATUS_LABELS[targetStatus]}`) : 'Auto-completed',
          metadata: { auto_completed: status !== targetStatus, stage_completion: true },
          changed_at: new Date().toISOString(),
        });
        previousStatus = status;
      }
    }

    // Insert all history records
    if (historyRecords.length > 0) {
      const { error: historyError } = await supabase
        .from('lead_status_history')
        .insert(historyRecords);

      if (historyError) {
        console.error('Failed to create stage completion history:', historyError);
        return { success: false, error: historyError.message };
      }
    }

    // Update lead to target status
    const { data: updatedLead, error: updateError } = await supabase
      .from('leads')
      .update({
        status: targetStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Send notification
    notifyLeadStatusChange(
      leadId,
      lead.customer_name,
      currentStatus,
      targetStatus,
      userId
    ).catch((err) => console.error('Notification error:', err));

    return { success: true, lead: updatedLead as Lead };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Validate if status transition is allowed
 */
export function validateStatusTransition(
  currentStatus: LeadStatus,
  newStatus: LeadStatus,
  isSubsidyEligible: boolean
): WorkflowValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const requiredActions: string[] = [];

  const nextStatuses = getNextStatuses(currentStatus, isSubsidyEligible);

  // Check if transition is valid
  if (!nextStatuses.includes(newStatus) && newStatus !== 'on_hold' && newStatus !== 'cancelled') {
    errors.push(`Cannot transition from ${currentStatus} to ${newStatus}`);
  }

  // Subsidy-only status checks
  const subsidyOnlyStatuses: LeadStatus[] = [
    'pm_portal_login_pending',
    'pm_portal_registered',
    'pm_feasibility_pending',
    'pm_feasibility_approved',
    'net_meter_application_submitted',
    'net_meter_approved',
    'net_meter_installed',
    'system_commissioned',
    'subsidy_application_pending',
    'subsidy_documents_submitted',
    'subsidy_under_review',
    'subsidy_approved',
    'subsidy_disbursed',
  ];

  if (subsidyOnlyStatuses.includes(newStatus) && !isSubsidyEligible) {
    errors.push('This status is only for subsidy-eligible leads (Residential + On-Grid/Hybrid)');
  }

  // Add required actions based on status
  if (newStatus === 'pm_portal_registered') {
    requiredActions.push('Create PM Surya portal record with login details');
  }
  if (newStatus === 'finance_application_submitted') {
    requiredActions.push('Add payment record with bank details');
  }
  if (newStatus === 'cash_payment_pending') {
    requiredActions.push('Add cash payment record');
  }
  if (newStatus === 'net_meter_application_submitted') {
    requiredActions.push('Create net meter record with application details');
  }

  return {
    isValid: errors.length === 0,
    canProceed: errors.length === 0,
    errors,
    warnings,
    nextPossibleStatuses: nextStatuses,
    requiredActions,
  };
}

/**
 * Get lead workflow progress
 */
export async function getLeadWorkflowProgress(leadId: string): Promise<{
  lead: Lead;
  statusHistory: LeadStatusHistory[];
  payments: LeadPayment[];
  pmSurya?: LeadPMSuryaghar;
  netMeter?: LeadNetMeter;
  progress: {
    currentStage: string;
    completedStatuses: number;
    totalStatuses: number;
    percentComplete: number;
  };
}> {
  // Get lead
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (!lead) throw new Error('Lead not found');

  // Get status history
  const { data: statusHistory } = await supabase
    .from('lead_status_history')
    .select('*')
    .eq('lead_id', leadId)
    .order('changed_at', { ascending: false });

  // Get payments
  const { data: payments } = await supabase
    .from('lead_payments')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  // Get PM Surya data (if subsidy eligible) - handle errors gracefully
  let pmSurya = null;
  try {
    const { data } = await supabase
      .from('lead_pm_suryaghar')
      .select('*')
      .eq('lead_id', leadId)
      .maybeSingle();
    pmSurya = data;
  } catch (error) {
    console.warn('PM Surya table query failed:', error);
  }

  // Get net meter data (if subsidy eligible) - handle errors gracefully
  let netMeter = null;
  try {
    const { data } = await supabase
      .from('lead_net_meter')
      .select('*')
      .eq('lead_id', leadId)
      .maybeSingle();
    netMeter = data;
  } catch (error) {
    console.warn('Net meter table query failed:', error);
  }

  // Calculate progress
  // Check subsidy eligibility using multiple field name variations
  const solarCategory = (lead as any).solar_category || (lead as any).property_type || lead.solar_system_type;
  const systemType = (lead as any).system_type || lead.grid_type;
  const eligible = isSubsidyEligible(solarCategory, systemType);
  const totalStatuses = eligible ? 36 : 20; // Approximate
  const completedStatuses = statusHistory?.length || 1;
  const percentComplete = Math.min(Math.round((completedStatuses / totalStatuses) * 100), 100);

  const currentStage = getCurrentStage(lead.status as LeadStatus);

  return {
    lead: lead as Lead,
    statusHistory: (statusHistory || []) as LeadStatusHistory[],
    payments: (payments || []) as LeadPayment[],
    pmSurya: pmSurya as LeadPMSuryaghar | undefined,
    netMeter: netMeter as LeadNetMeter | undefined,
    progress: {
      currentStage,
      completedStatuses,
      totalStatuses,
      percentComplete,
    },
  };
}

/**
 * Get current workflow stage
 */
function getCurrentStage(status: LeadStatus): string {
  if (['new', 'contacted', 'site_survey_scheduled', 'site_survey_completed'].includes(status)) {
    return 'Initial Contact';
  }
  if (['quotation_sent', 'quotation_approved'].includes(status)) {
    return 'Quotation';
  }
  if (['pm_portal_login_pending', 'pm_portal_registered', 'pm_feasibility_pending', 'pm_feasibility_approved'].includes(status)) {
    return 'PM Surya Portal';
  }
  if (['finance_required', 'finance_application_submitted', 'finance_under_review', 'finance_approved', 'finance_disbursed'].includes(status)) {
    return 'Finance';
  }
  if (['cash_payment_pending', 'cash_advance_received', 'cash_full_payment_received'].includes(status)) {
    return 'Cash Payment';
  }
  if (['installation_scheduled', 'installation_in_progress', 'installation_completed'].includes(status)) {
    return 'Installation';
  }
  if (['net_meter_application_submitted', 'net_meter_approved', 'net_meter_installed', 'system_commissioned'].includes(status)) {
    return 'Net Meter';
  }
  if (['subsidy_application_pending', 'subsidy_documents_submitted', 'subsidy_under_review', 'subsidy_approved', 'subsidy_disbursed'].includes(status)) {
    return 'Subsidy';
  }
  if (['payout_pending', 'payout_completed', 'project_completed'].includes(status)) {
    return 'Completion';
  }
  return 'Other';
}

// ============================================================================
// PAYMENT MANAGEMENT
// ============================================================================

/**
 * Add payment record (finance or cash)
 */
export async function addPayment(input: PaymentInput): Promise<{
  success: boolean;
  error?: string;
  payment?: LeadPayment;
}> {
  try {
    const { leadId, paymentType, userId, userName, ...paymentData } = input;

    const insertData: any = {
      lead_id: leadId,
      payment_type: paymentType,
      created_by: userId,
      created_by_name: userName,
      notes: paymentData.notes || null,
    };

    if (paymentType === 'finance') {
      insertData.bank_name = paymentData.bankName;
      insertData.ifsc_code = paymentData.ifscCode;
      insertData.sanctioned_amount = paymentData.sanctionedAmount;
      insertData.disbursed_amount = paymentData.disbursedAmount || 0;
      insertData.disbursement_date = paymentData.disbursementDate;
      insertData.pending_amount = (paymentData.sanctionedAmount || 0) - (paymentData.disbursedAmount || 0);
      insertData.utr_number = paymentData.utrNumber;
      insertData.vendor_name = paymentData.vendorName;
      insertData.approval_status = 'pending';
    } else if (paymentType === 'cash') {
      insertData.total_amount = paymentData.totalAmount;
      insertData.paid_amount = paymentData.paidAmount || 0;
      insertData.pending_cash_amount = (paymentData.totalAmount || 0) - (paymentData.paidAmount || 0);
      insertData.payment_mode = paymentData.paymentMode;
      insertData.payment_date = paymentData.paymentDate;
      insertData.payment_reference = paymentData.paymentReference;
    }

    const { data, error } = await supabase
      .from('lead_payments')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Send payment notification
    const amount = paymentType === 'finance' 
      ? (paymentData.disbursedAmount || paymentData.sanctionedAmount || 0)
      : (paymentData.paidAmount || paymentData.totalAmount || 0);
    
    notifyPaymentReceived(
      leadId,
      amount,
      paymentType,
      userId,
      userName
    ).catch((err) => console.error('Notification error:', err));

    return { success: true, payment: data as LeadPayment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update payment record
 */
export async function updatePayment(
  paymentId: string,
  updates: Partial<PaymentInput>
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {};

    if (updates.sanctionedAmount !== undefined) updateData.sanctioned_amount = updates.sanctionedAmount;
    if (updates.disbursedAmount !== undefined) {
      updateData.disbursed_amount = updates.disbursedAmount;
      updateData.pending_amount = (updates.sanctionedAmount || 0) - updates.disbursedAmount;
    }
    if (updates.disbursementDate) updateData.disbursement_date = updates.disbursementDate;
    if (updates.paidAmount !== undefined) {
      updateData.paid_amount = updates.paidAmount;
      updateData.pending_cash_amount = (updates.totalAmount || 0) - updates.paidAmount;
    }
    if (updates.paymentDate) updateData.payment_date = updates.paymentDate;
    if (updates.notes) updateData.notes = updates.notes;

    const { error } = await supabase
      .from('lead_payments')
      .update(updateData)
      .eq('id', paymentId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// PM SURYA MANAGEMENT
// ============================================================================

/**
 * Create or update PM Surya record
 */
export async function upsertPMSurya(input: PMSuryaInput): Promise<{
  success: boolean;
  error?: string;
  pmSurya?: LeadPMSuryaghar;
}> {
  try {
    const { leadId, userId, userName, ...pmData } = input;

    const insertData: Record<string, any> = {
      lead_id: leadId,
    };

    if ('portalLoginId' in pmData) {
      insertData.portal_login_id = pmData.portalLoginId ?? null;
    }
    if ('portalPasswordHint' in pmData) {
      insertData.portal_password_hint = pmData.portalPasswordHint ?? null;
    }
    if ('registrationDate' in pmData) {
      insertData.registration_date = pmData.registrationDate ?? null;
    }
    if ('applicationNumber' in pmData) {
      insertData.application_number = pmData.applicationNumber ?? null;
    }
    if ('consumerNumber' in pmData) {
      insertData.consumer_number = pmData.consumerNumber ?? null;
    }
    if ('discomName' in pmData) {
      insertData.discom_name = pmData.discomName ?? null;
    }
    if ('sanctionLoadKw' in pmData) {
      insertData.sanction_load_kw =
        pmData.sanctionLoadKw !== undefined && pmData.sanctionLoadKw !== null
          ? Number(pmData.sanctionLoadKw)
          : null;
    }
    if ('feasibilityStatus' in pmData) {
      insertData.feasibility_status = pmData.feasibilityStatus ?? null;
    }
    if ('feasibilityApprovalDate' in pmData) {
      insertData.feasibility_approval_date = pmData.feasibilityApprovalDate ?? null;
    }
    if ('portalStatus' in pmData) {
      insertData.portal_status = pmData.portalStatus ?? null;
    }
    if ('notes' in pmData) {
      insertData.notes = pmData.notes ?? null;
    }

    const { data, error } = await supabase
      .from('lead_pm_suryaghar')
      .upsert(insertData, { onConflict: 'lead_id' })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, pmSurya: data as LeadPMSuryaghar };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// NET METER MANAGEMENT
// ============================================================================

/**
 * Create or update net meter record
 */
export async function upsertNetMeter(input: NetMeterInput): Promise<{
  success: boolean;
  error?: string;
  netMeter?: LeadNetMeter;
}> {
  try {
    const { leadId, userId, userName, ...netMeterData } = input;

    const insertData: any = {
      lead_id: leadId,
      application_number: netMeterData.applicationNumber,
      application_date: netMeterData.applicationDate,
      approval_date: netMeterData.approvalDate,
      installation_date: netMeterData.installationDate,
      meter_number: netMeterData.meterNumber,
      meter_type: netMeterData.meterType,
      discom_name: netMeterData.discomName,
      agreement_signed: netMeterData.agreementSigned || false,
      agreement_date: netMeterData.agreementDate,
      commissioning_date: netMeterData.commissioningDate,
      first_generation_date: netMeterData.firstGenerationDate,
      monthly_generation_kwh: netMeterData.monthlyGenerationKwh,
      notes: netMeterData.notes,
      created_by: userId,
      created_by_name: userName,
    };

    const { data, error } = await supabase
      .from('lead_net_meter')
      .upsert(insertData, { onConflict: 'lead_id' })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, netMeter: data as LeadNetMeter };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// BULK STATUS OPERATIONS
// ============================================================================

/**
 * Get all leads in a specific status
 */
export async function getLeadsByStatus(status: LeadStatus, branchId?: string): Promise<Lead[]> {
  let query = supabase
    .from('leads')
    .select('*')
    .eq('status', status);

  if (branchId) {
    query = query.eq('branch_id', branchId);
  }

  const { data } = await query;
  return (data || []) as Lead[];
}

/**
 * Get workflow statistics
 */
export async function getWorkflowStatistics(branchId?: string): Promise<Record<string, number>> {
  let query = supabase.from('leads').select('status');

  if (branchId) {
    query = query.eq('branch_id', branchId);
  }

  const { data } = await query;

  const stats: Record<string, number> = {};
  (data || []).forEach((lead: any) => {
    stats[lead.status] = (stats[lead.status] || 0) + 1;
  });

  return stats;
}
