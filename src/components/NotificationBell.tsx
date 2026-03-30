/**
 * Notification Bell Component
 * Shows unread notifications with dropdown
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, List, Button, Empty, Spin, Typography, Space, Tag } from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import {
  getUnreadNotifications,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/lib/notificationService';

const { Text } = Typography;

interface NotificationBellProps {
  userId: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUnreadNotifications();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadUnreadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const loadUnreadNotifications = async () => {
    try {
      const { data, error } = await getUnreadNotifications(userId);
      if (!error && data) {
        setNotifications(data.slice(0, 10)); // Show last 10
        setUnreadCount(data.length);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    await markNotificationAsRead(notification.id);
    
    // Navigate to action URL
    if (notification.action_url) {
      router.push(notification.action_url);
    }
    
    // Refresh notifications
    loadUnreadNotifications();
    setDropdownOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    await markAllNotificationsAsRead(userId);
    await loadUnreadNotifications();
    setLoading(false);
  };

  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
    await loadUnreadNotifications();
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      lead_status_changed: '🔄',
      lead_assigned: '👤',
      lead_commented: '💬',
      document_uploaded: '📄',
      quotation_created: '📋',
      quotation_approved: '✅',
      payment_received: '💰',
      installation_scheduled: '📅',
      subsidy_approved: '🎉',
      task_assigned: '✓',
      reminder: '⏰',
      system_alert: '⚠️',
    };
    return icons[type] || '🔔';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'default',
      normal: 'blue',
      high: 'orange',
      urgent: 'red',
    };
    return colors[priority] || 'default';
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  const dropdownContent = (
    <div style={{ width: 400, maxHeight: 600, overflow: 'auto' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Text strong>Notifications ({unreadCount})</Text>
          {unreadCount > 0 && (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={handleMarkAllAsRead}
              loading={loading}
            >
              Mark all read
            </Button>
          )}
        </Space>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No new notifications"
          style={{ padding: 40 }}
        />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item: any) => (
            <List.Item
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: item.is_read ? 'transparent' : '#f0f7ff',
                borderBottom: '1px solid #f0f0f0',
              }}
              extra={
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => handleDelete(item.id, e)}
                  danger
                />
              }
            >
              <List.Item.Meta
                avatar={
                  <span style={{ fontSize: 24 }}>
                    {getNotificationIcon(item.type)}
                  </span>
                }
                title={
                  <Space>
                    <Text strong={!item.is_read}>{item.title}</Text>
                    {item.priority && item.priority !== 'normal' && (
                      <Tag color={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Tag>
                    )}
                  </Space>
                }
                description={
                  <>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {item.message}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {getTimeAgo(item.created_at)}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}

      {notifications.length > 0 && (
        <div
          style={{
            padding: '12px 16px',
            textAlign: 'center',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="link"
            onClick={() => {
              router.push('/dashboard/notifications');
              setDropdownOpen(false);
            }}
          >
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      overlay={dropdownContent}
      trigger={['click']}
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      placement="bottomRight"
    >
      <Badge count={unreadCount} overflowCount={99}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 20 }} />}
          style={{ marginRight: 8 }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
