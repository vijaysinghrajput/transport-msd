/**
 * Real-time Notification Hook
 * Subscribe to notification changes using Supabase real-time
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { getUnreadNotifications } from './notificationService';
import { realtimeManager } from './realtimeManager';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  // Load initial notifications
  const loadNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setConnectionError(false);
      const { data, error } = await getUnreadNotifications(userId);
      
      if (!error && data) {
        setNotifications(data);
        setUnreadCount(data.length);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setConnectionError(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    
    loadNotifications();

    // Use managed realtime connection
    const channelName = `notifications:${userId}`;
    
    const channel = realtimeManager.createChannel(channelName, {
      onSubscribed: () => {
        setConnectionError(false);
        console.log('Notifications realtime connected');
      },
      onError: (error) => {
        console.error('Notifications subscription error:', error);
        setConnectionError(true);
      },
      onTimeout: () => {
        console.warn('Notifications subscription timed out');
        setConnectionError(true);
      },
      fallbackCallback: () => {
        console.log('Using polling fallback for notifications');
        setConnectionError(true);
        // Start polling as fallback
        const pollInterval = setInterval(loadNotifications, 30000);
        return () => clearInterval(pollInterval);
      },
      maxRetries: 2
    });

    if (channel) {
      channel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
          },
          (payload) => {
            // Check if notification is for current user
            if (payload.new?.user_id === userId) {
              console.log('New notification received:', payload);
              
              // Add new notification to the list
              setNotifications((prev) => [payload.new, ...prev]);
              setUnreadCount((prev) => prev + 1);

              // Show browser notification if permitted
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(payload.new.title, {
                  body: payload.new.message,
                  icon: '/icon.png',
                  badge: '/badge.png',
                });
              }
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
          },
          (payload) => {
            // Check if notification is for current user
            if (payload.new?.user_id === userId) {
              // Update notification in list
              setNotifications((prev) =>
                prev.map((n) => (n.id === payload.new.id ? payload.new : n))
              );

              // Update unread count if notification was marked as read
              if (payload.new.is_read) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
              }
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'notifications',
          },
          (payload) => {
            // Check if notification was for current user
            if (payload.old?.user_id === userId) {
              // Remove notification from list
              setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id));
              
              // Update unread count if deleted notification was unread
              if (!payload.old.is_read) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
              }
            }
          }
        );
    }

    return () => {
      realtimeManager.removeChannel(channelName);
    };
  }, [userId, loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    connectionError,
    refresh: loadNotifications,
  };
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}
