/**
 * React Hook for Lead Workflow Management
 * Easy-to-use hook for managing lead status transitions
 */

import { useState, useCallback, useEffect } from 'react';
import { App } from 'antd';
import type { Lead, LeadStatus } from '@/types/lead-new';
import { isSubsidyEligible, getNextStatuses, STATUS_LABELS } from '@/types/lead-new';
import {
  changeLeadStatus,
  skipLeadStatus,
  completeWorkflowStage,
  getLeadWorkflowProgress,
  addPayment,
  updatePayment,
  upsertPMSurya,
  upsertNetMeter,
  validateStatusTransition,
  type StatusChangeInput,
  type PaymentInput,
  type PMSuryaInput,
  type NetMeterInput,
  type WorkflowValidation,
} from './leadWorkflowManager';

export interface UseLeadWorkflowReturn {
  // State
  lead: Lead | null;
  loading: boolean;
  statusHistory: any[];
  payments: any[];
  pmSurya: any | null;
  netMeter: any | null;
  progress: {
    currentStage: string;
    completedStatuses: number;
    totalStatuses: number;
    percentComplete: number;
  } | null;

  // Actions
  changeStatus: (newStatus: LeadStatus, notes?: string) => Promise<boolean>;
  skipStatus: (statusToSkip: LeadStatus, notes?: string) => Promise<boolean>;
  completeStage: (stageStatuses: readonly LeadStatus[], targetStatus: LeadStatus, notes?: string) => Promise<boolean>;
  addFinancePayment: (data: Omit<PaymentInput, 'leadId' | 'paymentType' | 'userId' | 'userName'>) => Promise<boolean>;
  addCashPayment: (data: Omit<PaymentInput, 'leadId' | 'paymentType' | 'userId' | 'userName'>) => Promise<boolean>;
  updatePaymentRecord: (paymentId: string, updates: Partial<PaymentInput>) => Promise<boolean>;
  savePMSurya: (data: Omit<PMSuryaInput, 'leadId' | 'userId' | 'userName'>) => Promise<boolean>;
  saveNetMeter: (data: Omit<NetMeterInput, 'leadId' | 'userId' | 'userName'>) => Promise<boolean>;
  refresh: () => Promise<void>;

  // Validation
  getNextStatuses: () => LeadStatus[];
  validateTransition: (newStatus: LeadStatus) => WorkflowValidation;
  canTransitionTo: (newStatus: LeadStatus) => boolean;

  // Helpers
  isSubsidyEligible: boolean;
  currentStatusLabel: string;
}

/**
 * Hook for managing lead workflow
 */
export function useLeadWorkflow(
  leadId: string,
  userId: string,
  userName: string
): UseLeadWorkflowReturn {
  const { message } = App.useApp();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [pmSurya, setPmSurya] = useState<any | null>(null);
  const [netMeter, setNetMeter] = useState<any | null>(null);
  const [progress, setProgress] = useState<any | null>(null);

  // Load workflow data
  const loadWorkflowData = useCallback(async () => {
    if (!leadId) return;

    try {
      setLoading(true);
      const data = await getLeadWorkflowProgress(leadId);
      
      setLead(data.lead);
      setStatusHistory(data.statusHistory);
      setPayments(data.payments);
      setPmSurya(data.pmSurya || null);
      setNetMeter(data.netMeter || null);
      setProgress(data.progress);
    } catch (error: any) {
      message.error('Failed to load workflow data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  // Initial load
  useEffect(() => {
    loadWorkflowData();
  }, [loadWorkflowData]);

  // Check if subsidy eligible
  // Database fields: solar_category (or old: property_type) = residential/commercial/industrial/solar_atta_chakki
  //                 system_type (or old: grid_type) = on_grid/off_grid/hybrid
  const subsidyEligible = lead
    ? isSubsidyEligible(
        (lead as any).solar_category || (lead as any).property_type || lead.solar_system_type, 
        (lead as any).system_type || lead.grid_type
      )
    : false;

  // Get current status label
  const currentStatusLabel = lead ? STATUS_LABELS[lead.status as LeadStatus] : '';

  // Change status
  const changeStatus = useCallback(
    async (newStatus: LeadStatus, notes?: string): Promise<boolean> => {
      if (!lead) return false;

      try {
        const input: StatusChangeInput = {
          leadId: lead.id,
          newStatus,
          notes,
          userId,
          userName,
        };

        const result = await changeLeadStatus(input);

        if (result.success) {
          message.success(`Status changed to: ${STATUS_LABELS[newStatus]}`);
          await loadWorkflowData(); // Refresh
          return true;
        } else {
          message.error(result.error || 'Failed to change status');
          return false;
        }
      } catch (error: any) {
        message.error('Error: ' + error.message);
        return false;
      }
    },
    [lead, userId, userName, loadWorkflowData, message]
  );

  // Skip status (mark as skipped without changing current status)
  const skipStatus = useCallback(
    async (statusToSkip: LeadStatus, notes?: string): Promise<boolean> => {
      if (!lead) return false;

      try {
        const input: StatusChangeInput = {
          leadId: lead.id,
          newStatus: statusToSkip,
          notes: notes || 'Status skipped',
          userId,
          userName,
        };

        const result = await skipLeadStatus(input);

        if (result.success) {
          message.success(`Status skipped: ${STATUS_LABELS[statusToSkip]}`);
          await loadWorkflowData(); // Refresh
          return true;
        } else {
          message.error(result.error || 'Failed to skip status');
          return false;
        }
      } catch (error: any) {
        message.error('Error: ' + error.message);
        return false;
      }
    },
    [lead, userId, userName, loadWorkflowData, message]
  );

  // Complete entire stage (auto-complete all sub-statuses)
  const completeStage = useCallback(
    async (stageStatuses: readonly LeadStatus[], targetStatus: LeadStatus, notes?: string): Promise<boolean> => {
      if (!lead) return false;

      try {
        const result = await completeWorkflowStage(
          lead.id,
          stageStatuses,
          targetStatus,
          userId,
          userName,
          notes
        );

        if (result.success) {
          message.success(`Stage completed: ${STATUS_LABELS[targetStatus]}`);
          await loadWorkflowData(); // Refresh
          return true;
        } else {
          message.error(result.error || 'Failed to complete stage');
          return false;
        }
      } catch (error: any) {
        message.error('Error: ' + error.message);
        return false;
      }
    },
    [lead, userId, userName, loadWorkflowData, message]
  );

  // Add finance payment
  const addFinancePayment = useCallback(
    async (data: Omit<PaymentInput, 'leadId' | 'paymentType' | 'userId' | 'userName'>): Promise<boolean> => {
      if (!lead) return false;

      try {
        const input: PaymentInput = {
          ...data,
          leadId: lead.id,
          paymentType: 'finance',
          userId,
          userName,
        };

        const result = await addPayment(input);

        if (result.success) {
          message.success('Finance payment added');
          await loadWorkflowData();
          return true;
        } else {
          message.error(result.error || 'Failed to add payment');
          return false;
        }
      } catch (error: any) {
        message.error('Error: ' + error.message);
        return false;
      }
    },
    [lead, userId, userName, loadWorkflowData]
  );

  // Add cash payment
  const addCashPayment = useCallback(
    async (data: Omit<PaymentInput, 'leadId' | 'paymentType' | 'userId' | 'userName'>): Promise<boolean> => {
      if (!lead) return false;

      try {
        const input: PaymentInput = {
          ...data,
          leadId: lead.id,
          paymentType: 'cash',
          userId,
          userName,
        };

        const result = await addPayment(input);

        if (result.success) {
          message.success('Cash payment added');
          await loadWorkflowData();
          return true;
        } else {
          message.error(result.error || 'Failed to add payment');
          return false;
        }
      } catch (error: any) {
        message.error('Error: ' + error.message);
        return false;
      }
    },
    [lead, userId, userName, loadWorkflowData]
  );

  // Update payment
  const updatePaymentRecord = useCallback(
    async (paymentId: string, updates: Partial<PaymentInput>): Promise<boolean> => {
      try {
        const result = await updatePayment(paymentId, updates);

        if (result.success) {
          message.success('Payment updated');
          await loadWorkflowData();
          return true;
        } else {
          message.error(result.error || 'Failed to update payment');
          return false;
        }
      } catch (error: any) {
        message.error('Error: ' + error.message);
        return false;
      }
    },
    [loadWorkflowData]
  );

  // Save PM Surya data
  const savePMSurya = useCallback(
    async (data: Omit<PMSuryaInput, 'leadId' | 'userId' | 'userName'>): Promise<boolean> => {
      if (!lead) return false;

      try {
        const input: PMSuryaInput = {
          ...data,
          leadId: lead.id,
          userId,
          userName,
        };

        const result = await upsertPMSurya(input);

        if (result.success) {
          message.success('PM Surya data saved');
          await loadWorkflowData();
          return true;
        } else {
          message.error(result.error || 'Failed to save PM Surya data');
          return false;
        }
      } catch (error: any) {
        message.error('Error: ' + error.message);
        return false;
      }
    },
    [lead, userId, userName, loadWorkflowData]
  );

  // Save net meter data
  const saveNetMeter = useCallback(
    async (data: Omit<NetMeterInput, 'leadId' | 'userId' | 'userName'>): Promise<boolean> => {
      if (!lead) return false;

      try {
        const input: NetMeterInput = {
          ...data,
          leadId: lead.id,
          userId,
          userName,
        };

        const result = await upsertNetMeter(input);

        if (result.success) {
          message.success('Net meter data saved');
          await loadWorkflowData();
          return true;
        } else {
          message.error(result.error || 'Failed to save net meter data');
          return false;
        }
      } catch (error: any) {
        message.error('Error: ' + error.message);
        return false;
      }
    },
    [lead, userId, userName, loadWorkflowData]
  );

  // Get next possible statuses
  const getNextStatusesFn = useCallback((): LeadStatus[] => {
    if (!lead) return [];
    return getNextStatuses(lead.status as LeadStatus, subsidyEligible);
  }, [lead, subsidyEligible]);

  // Validate transition
  const validateTransition = useCallback(
    (newStatus: LeadStatus): WorkflowValidation => {
      if (!lead) {
        return {
          isValid: false,
          canProceed: false,
          errors: ['Lead not loaded'],
          warnings: [],
          nextPossibleStatuses: [],
          requiredActions: [],
        };
      }

      return validateStatusTransition(
        lead.status as LeadStatus,
        newStatus,
        subsidyEligible
      );
    },
    [lead, subsidyEligible]
  );

  // Check if can transition to status
  const canTransitionTo = useCallback(
    (newStatus: LeadStatus): boolean => {
      const validation = validateTransition(newStatus);
      return validation.canProceed;
    },
    [validateTransition]
  );

  return {
    // State
    lead,
    loading,
    statusHistory,
    payments,
    pmSurya,
    netMeter,
    progress,

    // Actions
    changeStatus,
    skipStatus,
    completeStage,
    addFinancePayment,
    addCashPayment,
    updatePaymentRecord,
    savePMSurya,
    saveNetMeter,
    refresh: loadWorkflowData,

    // Validation
    getNextStatuses: getNextStatusesFn,
    validateTransition,
    canTransitionTo,

    // Helpers
    isSubsidyEligible: subsidyEligible,
    currentStatusLabel,
  };
}
