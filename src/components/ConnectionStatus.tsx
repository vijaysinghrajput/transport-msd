/**
 * Connection Status Component
 * Shows the real-time connection status and statistics
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Tooltip, Button, Modal, Descriptions, Alert, Typography } from 'antd';
import { 
  WifiIcon, 
  WifiOff, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw 
} from 'lucide-react';
import { realtimeManager } from '@/lib/realtimeManager';

const { Text, Title } = Typography;

interface ConnectionStatusProps {
  className?: string;
  showDetails?: boolean;
}

export default function ConnectionStatus({ 
  className = '', 
  showDetails = false 
}: ConnectionStatusProps) {
  const [stats, setStats] = useState(realtimeManager.getStats());
  const [modalVisible, setModalVisible] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const updateStats = () => {
      const currentStats = realtimeManager.getStats();
      setStats(currentStats);
      setIsAvailable(realtimeManager.isRealtimeAvailable());
    };

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000);
    updateStats(); // Initial update

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (stats.activeConnections > 0) return 'success';
    if (stats.failedConnections > 2) return 'error';
    return 'warning';
  };

  const getStatusIcon = () => {
    if (stats.activeConnections > 0) return <WifiIcon size={16} />;
    if (stats.failedConnections > 2) return <WifiOff size={16} />;
    return <AlertTriangle size={16} />;
  };

  const getStatusText = () => {
    if (stats.activeConnections > 0) return `${stats.activeConnections} active`;
    if (stats.failedConnections > 2) return 'Connection issues';
    return 'Connecting...';
  };

  const handleReset = () => {
    realtimeManager.resetStats();
    setStats(realtimeManager.getStats());
    setIsAvailable(true);
  };

  if (!showDetails) {
    return (
      <Tooltip title={`Real-time connections: ${getStatusText()}`}>
        <Badge 
          status={getStatusColor()} 
          text={
            <span className={`flex items-center gap-1 ${className}`}>
              {getStatusIcon()}
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {getStatusText()}
              </Text>
            </span>
          }
        />
      </Tooltip>
    );
  }

  return (
    <>
      <Button 
        type="text" 
        size="small" 
        className={className}
        onClick={() => setModalVisible(true)}
        icon={getStatusIcon()}
      >
        {getStatusText()}
      </Button>

      <Modal
        title="Real-time Connection Status"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="reset" onClick={handleReset} icon={<RefreshCw size={14} />}>
            Reset Stats
          </Button>,
          <Button key="close" type="primary" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        <div className="space-y-4">
          {/* Overall Status */}
          <Alert
            message="Real-time Features Status"
            description={
              isAvailable 
                ? "Real-time features are working normally"
                : "Real-time features are experiencing issues. Using fallback polling instead."
            }
            type={isAvailable ? "success" : "warning"}
            showIcon
            icon={isAvailable ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          />

          {/* Connection Statistics */}
          <Descriptions title="Connection Statistics" bordered size="small">
            <Descriptions.Item label="Active Connections" span={2}>
              <Badge status={stats.activeConnections > 0 ? 'success' : 'default'} />
              <Text strong>{stats.activeConnections}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Total Connections" span={1}>
              <Text>{stats.totalConnections}</Text>
            </Descriptions.Item>
            
            <Descriptions.Item label="Failed Connections" span={2}>
              <Badge status={stats.failedConnections > 2 ? 'error' : 'default'} />
              <Text>{stats.failedConnections}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Success Rate" span={1}>
              <Text>
                {stats.totalConnections > 0 
                  ? Math.round(((stats.totalConnections - stats.failedConnections) / stats.totalConnections) * 100)
                  : 100
                }%
              </Text>
            </Descriptions.Item>

            {stats.lastError && (
              <Descriptions.Item label="Last Error" span={3}>
                <Text type="danger" style={{ fontSize: '12px' }}>
                  {stats.lastError}
                </Text>
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* Feature Status */}
          <div>
            <Title level={5}>Feature Status</Title>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <Text>Live Notifications</Text>
                <Badge status={stats.activeConnections > 0 ? 'success' : 'warning'} />
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <Text>Live Lead Updates</Text>
                <Badge status={stats.activeConnections > 0 ? 'success' : 'warning'} />
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <Text>Real-time Tracking</Text>
                <Badge status="success" text="Always available (uses polling)" />
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          {!isAvailable && (
            <Alert
              message="Troubleshooting Tips"
              description={
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Check your internet connection</li>
                  <li>Refresh the page to reconnect</li>
                  <li>Features will continue working with polling updates</li>
                  <li>Contact support if issues persist</li>
                </ul>
              }
              type="info"
            />
          )}
        </div>
      </Modal>
    </>
  );
}