/**
 * Comprehensive Notification Service
 * Handles database notifications, Expo push notifications, and SMS
 */

import { supabase } from './supabaseClient';

// ============================================================================
// TYPES
// ============================================================================

export type NotificationType =
  | 'lead_status_changed'
  | 'lead_assigned'
  | 'lead_commented'
  | 'lead_query_raised'
  | 'lead_query_responded'
  | 'document_uploaded'
  | 'quotation_created'
  | 'quotation_approved'
  | 'payment_received'
  | 'installation_scheduled'
  | 'subsidy_approved'
  | 'task_assigned'
  | 'reminder'
  | 'system_alert';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type NotificationChannel = 'database' | 'push' | 'sms' | 'email';

export interface NotificationInput {
  userId: string;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  leadId?: string;
  quotationId?: string;
  installationId?: string;
  financeApplicationId?: string;
  subsidyClaimId?: string;
  documentId?: string;
  actionUrl?: string;
  actionData?: Record<string, any>;
  imageUrl?: string;
  scheduledFor?: Date;
  expiresAt?: Date;
  channels?: {
    database?: boolean;
    push?: boolean;
    sms?: boolean;
    email?: boolean;
  };
}

export interface NotificationResult {
  success: boolean;
  notificationId?: string;
  channels: {
    database: { sent: boolean; error?: string };
    push: { sent: boolean; error?: string };
    sms: { sent: boolean; error?: string };
  };
  error?: string;
}

// ============================================================================
// LEAD ACTIVITY NOTIFICATIONS
// ============================================================================

/**
 * Send notification when lead status changes
 */
export async function notifyLeadStatusChange(
  leadId: string,
  oldStatus: string,
  newStatus: string,
  changedBy: string,
  changedByName: string
): Promise<NotificationResult> {
  try {
    // Get lead details and owner
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*, created_by, assigned_to, source_user_id, customer_name')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      return {
        success: false,
        error: 'Lead not found',
        channels: {
          database: { sent: false, error: 'Lead not found' },
          push: { sent: false },
          sms: { sent: false },
        },
      };
    }

    // Notify relevant users in priority order:
    // 1. Lead source user (who submitted from mobile) - HIGHEST PRIORITY
    // 2. Assigned user
    // 3. Creator (if different)
    const usersToNotify = new Set<string>();
    
    // Priority 1: Source user (who submitted the lead)
    if (lead.source_user_id && lead.source_user_id !== changedBy) {
      usersToNotify.add(lead.source_user_id);
    }
    
    // Priority 2: Assigned user
    if (lead.assigned_to && lead.assigned_to !== changedBy) {
      usersToNotify.add(lead.assigned_to);
    }
    
    // Priority 3: Creator (if not already included)
    if (lead.created_by && 
        lead.created_by !== changedBy && 
        lead.created_by !== lead.source_user_id) {
      usersToNotify.add(lead.created_by);
    }

    if (usersToNotify.size === 0) {
      return {
        success: true,
        channels: {
          database: { sent: false, error: 'No user to notify' },
          push: { sent: false },
          sms: { sent: false },
        },
      };
    }

    // Send notifications to all relevant users
    const results: NotificationResult[] = [];
    for (const userId of usersToNotify) {
      const result = await sendNotification({
        userId,
        type: 'lead_status_changed',
        priority: 'normal',
        title: `Lead Status Updated: ${lead.customer_name}`,
        message: `${changedByName} changed status from "${oldStatus}" to "${newStatus}"`,
        leadId,
        actionUrl: `/dashboard/solar/leads?id=${leadId}`,
        actionData: { leadId, oldStatus, newStatus },
        channels: {
          database: true,
          push: true,
          sms: false, // Only urgent for SMS
        },
      });
      results.push(result);
    }

    // Return combined result
    return results[0] || {
      success: true,
      channels: {
        database: { sent: true },
        push: { sent: true },
        sms: { sent: false },
      },
    };
  } catch (error: any) {
    console.error('Error in notifyLeadStatusChange:', error);
    return {
      success: false,
      error: error.message,
      channels: {
        database: { sent: false, error: error.message },
        push: { sent: false },
        sms: { sent: false },
      },
    };
  }
}

/**
 * Send notification when lead is assigned
 */
export async function notifyLeadAssigned(
  leadId: string,
  assignedTo: string,
  assignedBy: string,
  assignedByName: string
): Promise<NotificationResult> {
  try {
    const { data: lead } = await supabase
      .from('leads')
      .select('customer_name, solar_system_type, estimated_system_size')
      .eq('id', leadId)
      .single();

    if (!lead) {
      throw new Error('Lead not found');
    }

    return await sendNotification({
      userId: assignedTo,
      type: 'lead_assigned',
      priority: 'high',
      title: `New Lead Assigned: ${lead.customer_name}`,
      message: `${assignedByName} assigned you a new ${lead.solar_system_type} lead (${lead.estimated_system_size} kW)`,
      leadId,
      actionUrl: `/dashboard/solar/leads?id=${leadId}`,
      actionData: { leadId },
      channels: {
        database: true,
        push: true,
        sms: true, // Important - send SMS for assignments
      },
    });
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      channels: {
        database: { sent: false, error: error.message },
        push: { sent: false },
        sms: { sent: false },
      },
    };
  }
}

/**
 * Send notification when document is uploaded to lead
 */
export async function notifyDocumentUploaded(
  leadId: string,
  documentType: string,
  uploadedBy: string,
  uploadedByName: string
): Promise<NotificationResult> {
  try {
    const { data: lead } = await supabase
      .from('leads')
      .select('customer_name, created_by, assigned_to, source_user_id')
      .eq('id', leadId)
      .single();

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Notify all relevant users
    const usersToNotify = new Set<string>();
    
    // Priority 1: Source user
    if (lead.source_user_id && lead.source_user_id !== uploadedBy) {
      usersToNotify.add(lead.source_user_id);
    }
    
    // Priority 2: Assigned user
    if (lead.assigned_to && lead.assigned_to !== uploadedBy) {
      usersToNotify.add(lead.assigned_to);
    }
    
    // Priority 3: Creator
    if (lead.created_by && 
        lead.created_by !== uploadedBy && 
        lead.created_by !== lead.source_user_id) {
      usersToNotify.add(lead.created_by);
    }

    if (usersToNotify.size === 0) {
      return {
        success: true,
        channels: {
          database: { sent: false },
          push: { sent: false },
          sms: { sent: false },
        },
      };
    }

    // Send to all users
    const results: NotificationResult[] = [];
    for (const userId of usersToNotify) {
      const result = await sendNotification({
        userId,
        type: 'document_uploaded',
        priority: 'normal',
        title: `New Document: ${lead.customer_name}`,
        message: `${uploadedByName} uploaded ${documentType}`,
        leadId,
        actionUrl: `/dashboard/solar/leads?id=${leadId}&tab=documents`,
        actionData: { leadId, documentType },
        channels: {
          database: true,
          push: true,
          sms: false,
        },
      });
      results.push(result);
    }

    return results[0] || {
      success: true,
      channels: {
        database: { sent: true },
        push: { sent: true },
        sms: { sent: false },
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      channels: {
        database: { sent: false, error: error.message },
        push: { sent: false },
        sms: { sent: false },
      },
    };
  }
}

/**
 * Send notification when payment is received
 */
export async function notifyPaymentReceived(
  leadId: string,
  amount: number,
  paymentType: string,
  receivedBy: string,
  receivedByName: string
): Promise<NotificationResult> {
  try {
    const { data: lead } = await supabase
      .from('leads')
      .select('customer_name, created_by, assigned_to, source_user_id')
      .eq('id', leadId)
      .single();

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Notify all relevant users
    const usersToNotify = new Set<string>();
    
    // Priority 1: Source user
    if (lead.source_user_id && lead.source_user_id !== receivedBy) {
      usersToNotify.add(lead.source_user_id);
    }
    
    // Priority 2: Assigned user
    if (lead.assigned_to && lead.assigned_to !== receivedBy) {
      usersToNotify.add(lead.assigned_to);
    }
    
    // Priority 3: Creator
    if (lead.created_by && 
        lead.created_by !== receivedBy && 
        lead.created_by !== lead.source_user_id) {
      usersToNotify.add(lead.created_by);
    }

    if (usersToNotify.size === 0) {
      return {
        success: true,
        channels: {
          database: { sent: false },
          push: { sent: false },
          sms: { sent: false },
        },
      };
    }

    // Send to all users
    const results: NotificationResult[] = [];
    for (const userId of usersToNotify) {
      const result = await sendNotification({
        userId,
        type: 'payment_received',
        priority: 'high',
        title: `Payment Received: ${lead.customer_name}`,
        message: `${receivedByName} recorded ₹${amount.toLocaleString()} payment (${paymentType})`,
        leadId,
        actionUrl: `/dashboard/solar/leads?id=${leadId}&tab=payments`,
        actionData: { leadId, amount, paymentType },
        channels: {
          database: true,
          push: true,
          sms: true, // Important - send SMS for payments
        },
      });
      results.push(result);
    }

    return results[0] || {
      success: true,
      channels: {
        database: { sent: true },
        push: { sent: true },
        sms: { sent: true },
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      channels: {
        database: { sent: false, error: error.message },
        push: { sent: false },
        sms: { sent: false },
      },
    };
  }
}

/**
 * Send notification when anyone raises a query on a lead
 * Supports bidirectional queries (CRM ↔ Source User)
 */
export async function notifyLeadQueryRaised(
  leadId: string,
  queryId: string,
  queryText: string,
  queryType: string,
  priority: string,
  raisedBy: string,
  raisedByName: string,
  queryDirection: 'crm_to_source' | 'source_to_crm' = 'crm_to_source'
): Promise<NotificationResult> {
  try {
    const { data: lead } = await supabase
      .from('leads')
      .select('customer_name, source_user_id, source_user_name, created_by')
      .eq('id', leadId)
      .single();

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Determine who to notify based on query direction
    let notifyUserId: string | null = null;
    
    if (queryDirection === 'crm_to_source') {
      // CRM user asking source user
      notifyUserId = lead.source_user_id;
    } else {
      // Source user asking CRM user (notify lead creator or assigned user)
      notifyUserId = lead.created_by;
    }

    if (!notifyUserId) {
      throw new Error('No user to notify');
    }

    // Determine notification priority based on query priority
    let notificationPriority: NotificationPriority = 'normal';
    if (priority === 'urgent') notificationPriority = 'urgent';
    else if (priority === 'high') notificationPriority = 'high';

    // Determine if SMS should be sent
    const sendSMS = priority === 'urgent' || priority === 'high';

    const directionLabel = queryDirection === 'crm_to_source' 
      ? 'CRM Query' 
      : 'Customer Query';

    return await sendNotification({
      userId: notifyUserId,
      type: 'lead_query_raised',
      priority: notificationPriority,
      title: `${directionLabel}: ${lead.customer_name}`,
      message: `${raisedByName} asked: "${queryText.substring(0, 100)}${queryText.length > 100 ? '...' : ''}"`,
      leadId,
      actionUrl: `/leads/${leadId}/queries`,
      actionData: { leadId, queryId, queryType, priority, queryDirection },
      channels: {
        database: true,
        push: true,
        sms: sendSMS,
      },
    });
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      channels: {
        database: { sent: false, error: error.message },
        push: { sent: false },
        sms: { sent: false },
      },
    };
  }
}

/**
 * Send notification when lead source user responds to a query
 * Notifies the CRM user who raised the query
 */
export async function notifyLeadQueryResponded(
  leadId: string,
  queryId: string,
  responseText: string,
  respondedBy: string,
  respondedByName: string,
  requestedBy: string
): Promise<NotificationResult> {
  try {
    const { data: lead } = await supabase
      .from('leads')
      .select('customer_name')
      .eq('id', leadId)
      .single();

    if (!lead) {
      throw new Error('Lead not found');
    }

    return await sendNotification({
      userId: requestedBy,
      type: 'lead_query_responded',
      priority: 'normal',
      title: `Query Response: ${lead.customer_name}`,
      message: `${respondedByName} responded: "${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}"`,
      leadId,
      actionUrl: `/dashboard/solar/leads?id=${leadId}&tab=queries`,
      actionData: { leadId, queryId },
      channels: {
        database: true,
        push: true,
        sms: false,
      },
    });
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      channels: {
        database: { sent: false, error: error.message },
        push: { sent: false },
        sms: { sent: false },
      },
    };
  }
}

// ============================================================================
// CORE NOTIFICATION SERVICE
// ============================================================================

/**
 * Main function to send notification through all channels
 */
export async function sendNotification(
  input: NotificationInput
): Promise<NotificationResult> {
  const result: NotificationResult = {
    success: false,
    channels: {
      database: { sent: false },
      push: { sent: false },
      sms: { sent: false },
    },
  };

  try {
    // Get user details for push token and phone
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('expo_push_token, phone, notification_preferences')
      .eq('id', input.userId)
      .single();

    if (userError) {
      throw new Error('User not found');
    }

    const channels = input.channels || {
      database: true,
      push: false,
      sms: false,
    };

    // Check user preferences
    const prefs = user.notification_preferences || {};
    const canSendPush = channels.push && prefs.push !== false;
    const canSendSMS = channels.sms && prefs.sms !== false;

    // 1. Create database notification
    if (channels.database) {
      const { data: notification, error: dbError } = await supabase
        .from('notifications')
        .insert({
          user_id: input.userId,
          type: input.type,
          priority: input.priority || 'normal',
          title: input.title,
          message: input.message,
          lead_id: input.leadId,
          quotation_id: input.quotationId,
          installation_id: input.installationId,
          finance_application_id: input.financeApplicationId,
          subsidy_claim_id: input.subsidyClaimId,
          document_id: input.documentId,
          action_url: input.actionUrl,
          action_data: input.actionData,
          image_url: input.imageUrl,
          scheduled_for: input.scheduledFor,
          expires_at: input.expiresAt,
          is_read: false,
          channels: channels,
        })
        .select('id')
        .single();

      if (dbError) {
        result.channels.database = { sent: false, error: dbError.message };
      } else {
        result.channels.database = { sent: true };
        result.notificationId = notification.id;
      }
    }

    // 2. Send Expo push notification
    if (canSendPush && user.expo_push_token) {
      const pushResult = await sendExpoPushNotification(
        user.expo_push_token,
        input.title,
        input.message,
        input.actionData || {}
      );

      result.channels.push = pushResult;

      // Update notification record
      if (result.notificationId) {
        await supabase
          .from('notifications')
          .update({
            push_sent: pushResult.sent,
            push_sent_at: pushResult.sent ? new Date().toISOString() : null,
            push_error: pushResult.error,
          })
          .eq('id', result.notificationId);
      }
    }

    // 3. Send SMS notification
    if (canSendSMS && user.phone) {
      const smsResult = await sendSMSNotification(
        user.phone,
        `${input.title}: ${input.message}`
      );

      result.channels.sms = smsResult;

      // Update notification record
      if (result.notificationId) {
        await supabase
          .from('notifications')
          .update({
            sms_sent: smsResult.sent,
            sms_sent_at: smsResult.sent ? new Date().toISOString() : null,
            sms_error: smsResult.error,
          })
          .eq('id', result.notificationId);
      }
    }

    result.success = true;
    return result;
  } catch (error: any) {
    console.error('Error in sendNotification:', error);
    result.error = error.message;
    return result;
  }
}

/**
 * Send Expo push notification
 */
async function sendExpoPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data: Record<string, any>
): Promise<{ sent: boolean; error?: string }> {
  try {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
      badge: 1,
      priority: 'high',
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();

    if (responseData.data?.status === 'error') {
      return {
        sent: false,
        error: responseData.data?.message || 'Expo push failed',
      };
    }

    return { sent: true };
  } catch (error: any) {
    console.error('Expo push notification error:', error);
    return { sent: false, error: error.message };
  }
}

/**
 * Send SMS notification (integrate with your SMS provider)
 */
async function sendSMSNotification(
  phoneNumber: string,
  message: string
): Promise<{ sent: boolean; error?: string }> {
  try {
    // Example using a generic SMS API
    // Replace with your actual SMS provider (Twilio, AWS SNS, etc.)
    
    // For now, log and return success (implement actual SMS provider)
    console.log(`SMS to ${phoneNumber}: ${message}`);
    
    // TODO: Implement actual SMS provider
    // Example with Twilio:
    // const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Basic ' + btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`),
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: new URLSearchParams({
    //     To: phoneNumber,
    //     From: YOUR_TWILIO_NUMBER,
    //     Body: message,
    //   }),
    // });

    return { sent: true };
  } catch (error: any) {
    console.error('SMS notification error:', error);
    return { sent: false, error: error.message };
  }
}

// ============================================================================
// NOTIFICATION QUERIES
// ============================================================================

/**
 * Get user's unread notifications
 */
export async function getUnreadNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Get all user notifications with pagination
 */
export async function getNotifications(
  userId: string,
  page: number = 1,
  limit: number = 20
) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  return { data, error, count };
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', notificationId);

  return { success: !error, error };
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('is_read', false);

  return { success: !error, error };
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  return { success: !error, error };
}

/**
 * Update user's Expo push token
 */
export async function updateExpoPushToken(userId: string, token: string) {
  const { error } = await supabase
    .from('users')
    .update({ expo_push_token: token })
    .eq('id', userId);

  return { success: !error, error };
}

/**
 * Update user's notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: {
    push?: boolean;
    sms?: boolean;
    email?: boolean;
  }
) {
  const { error } = await supabase
    .from('users')
    .update({ notification_preferences: preferences })
    .eq('id', userId);

  return { success: !error, error };
}
