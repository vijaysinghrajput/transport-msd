/**
 * Realtime Connection Manager
 * Manages WebSocket connections and provides fallback mechanisms
 */

'use client';

import { supabase } from './supabaseClient';

interface ConnectionStats {
  totalConnections: number;
  activeConnections: number;
  failedConnections: number;
  lastError?: string;
}

class RealtimeManager {
  private connections = new Map<string, any>();
  private stats: ConnectionStats = {
    totalConnections: 0,
    activeConnections: 0,
    failedConnections: 0,
  };
  private maxConnections = 5; // Limit concurrent connections
  private retryDelays = [1000, 2000, 5000, 10000, 30000]; // Progressive backoff
  private retryAttempts = new Map<string, number>();

  /**
   * Create a managed channel with error handling and retry logic
   */
  createChannel(channelName: string, options: {
    onSubscribed?: () => void;
    onError?: (error: any) => void;
    onTimeout?: () => void;
    onClosed?: () => void;
    fallbackCallback?: () => void;
    maxRetries?: number;
  } = {}) {
    const {
      onSubscribed,
      onError,
      onTimeout,
      onClosed,
      fallbackCallback,
      maxRetries = 3
    } = options;

    // Check connection limit
    if (this.stats.activeConnections >= this.maxConnections) {
      console.warn(`Maximum connections (${this.maxConnections}) reached. Using fallback.`);
      fallbackCallback?.();
      return null;
    }

    // Remove existing connection if any
    this.removeChannel(channelName);

    const channel = supabase.channel(channelName);
    
    this.connections.set(channelName, channel);
    this.stats.totalConnections++;
    this.stats.activeConnections++;

    // Setup subscription with error handling
    channel.subscribe((status, err) => {
      const attempts = this.retryAttempts.get(channelName) || 0;

      switch (status) {
        case 'SUBSCRIBED':
          console.log(`✅ Channel ${channelName} subscribed successfully`);
          this.retryAttempts.delete(channelName); // Reset retry count
          onSubscribed?.();
          break;

        case 'CHANNEL_ERROR':
          console.error(`❌ Channel ${channelName} error:`, err);
          this.stats.failedConnections++;
          this.stats.lastError = err?.message || 'Channel error';
          
          // Retry logic
          if (attempts < maxRetries) {
            const delay = this.retryDelays[attempts] || 30000;
            console.log(`🔄 Retrying channel ${channelName} in ${delay}ms (attempt ${attempts + 1}/${maxRetries})`);
            
            setTimeout(() => {
              this.retryAttempts.set(channelName, attempts + 1);
              this.createChannel(channelName, options);
            }, delay);
          } else {
            console.warn(`⚠️ Max retries reached for channel ${channelName}. Using fallback.`);
            fallbackCallback?.();
          }
          
          onError?.(err);
          break;

        case 'TIMED_OUT':
          console.warn(`⏱️ Channel ${channelName} timed out`);
          this.stats.failedConnections++;
          
          if (attempts < maxRetries) {
            setTimeout(() => {
              this.retryAttempts.set(channelName, attempts + 1);
              this.createChannel(channelName, options);
            }, 10000);
          } else {
            fallbackCallback?.();
          }
          
          onTimeout?.();
          break;

        case 'CLOSED':
          console.log(`🔒 Channel ${channelName} closed`);
          this.stats.activeConnections--;
          this.connections.delete(channelName);
          onClosed?.();
          break;

        default:
          console.log(`ℹ️ Channel ${channelName} status:`, status);
      }
    });

    return channel;
  }

  /**
   * Remove a channel safely
   */
  removeChannel(channelName: string) {
    const channel = this.connections.get(channelName);
    if (channel) {
      try {
        supabase.removeChannel(channel);
        this.connections.delete(channelName);
        this.stats.activeConnections = Math.max(0, this.stats.activeConnections - 1);
        this.retryAttempts.delete(channelName);
        console.log(`🗑️ Channel ${channelName} removed`);
      } catch (error) {
        console.error(`Error removing channel ${channelName}:`, error);
      }
    }
  }

  /**
   * Remove all channels
   */
  removeAllChannels() {
    const channelNames = Array.from(this.connections.keys());
    channelNames.forEach(channelName => this.removeChannel(channelName));
  }

  /**
   * Get connection statistics
   */
  getStats(): ConnectionStats {
    return { ...this.stats };
  }

  /**
   * Check if realtime is available
   */
  isRealtimeAvailable(): boolean {
    return this.stats.activeConnections > 0 || this.stats.failedConnections < 3;
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalConnections: 0,
      activeConnections: this.connections.size,
      failedConnections: 0,
    };
    this.retryAttempts.clear();
  }
}

// Export singleton instance
export const realtimeManager = new RealtimeManager();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    realtimeManager.removeAllChannels();
  });
}