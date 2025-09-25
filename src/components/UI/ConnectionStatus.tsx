/**
 * Connection Status Component
 * Shows the status of backend API connection
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useHealthCheck } from '../../hooks/useApi';

interface ConnectionStatusProps {
  style?: any;
  showDetails?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  style, 
  showDetails = false 
}) => {
  const { data, loading, error, refresh } = useHealthCheck();

  const getStatusColor = () => {
    if (loading) return '#FFA500'; // Orange
    if (error) return '#FF4444'; // Red
    if (data?.status === 'healthy') return '#00AA00'; // Green
    return '#888888'; // Gray
  };

  const getStatusText = () => {
    if (loading) return 'Connecting...';
    if (error) return 'Disconnected';
    if (data?.status === 'healthy') return 'Connected';
    return 'Unknown';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={refresh}
      disabled={loading}
    >
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
        {loading && <ActivityIndicator size="small" color={getStatusColor()} />}
      </View>
      
      {showDetails && data && (
        <View style={styles.details}>
          <Text style={styles.detailText}>Service: {data.service}</Text>
          <Text style={styles.detailText}>Version: {data.version}</Text>
          <Text style={styles.detailText}>
            Updated: {new Date(data.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      )}
      
      {showDetails && error && (
        <View style={styles.details}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  details: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#FF4444',
  },
});
