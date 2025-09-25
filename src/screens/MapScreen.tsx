import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { getPM25Color, getPM25Status } from '../utils/airQualityUtils';
const pointsLow = require('../assets/geodata/PM25_Brisbane_points_low.json');
const pointsMedium = require('../assets/geodata/PM25_Brisbane_points_medium.json');
const pointsHigh = require('../assets/geodata/PM25_Brisbane_points_high.json');

interface PM25Data {
  pm25: number;
  coordinates: [number, number];
  areaName?: string;
}

interface PM25Point {
  latitude: number;
  longitude: number;
  pm25: number;
  color: string;
}

interface MapScreenProps {
  navigation?: any;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState<PM25Data | null>(null);
  const [currentZoom, setCurrentZoom] = useState(5);
  const [showLegend, setShowLegend] = useState(true);
  const [showTip, setShowTip] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: -27.4698, // Brisbane中心
    longitude: 153.0251,
    latitudeDelta: 2.0, // 更小的范围，专注Brisbane区域
    longitudeDelta: 2.0,
  });

  useEffect(() => {
    try {
      console.log('Initializing Brisbane PM2.5 map...');
      setLoading(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      Alert.alert('Error', 'Failed to load map data');
      setLoading(false);
    }
  }, []);


  // 根据缩放级别获取合适的采样点数据 - 使用useMemo优化性能
  const currentPoints = useMemo((): PM25Point[] => {
    const latDelta = mapRegion.latitudeDelta;
    
    if (latDelta > 3.0) {
      // 远距离视图，使用低密度采样（28个点）
      return pointsLow.points;
    } else if (latDelta > 1.0) {
      // 中等距离视图，使用中密度采样（79个点）
      return pointsMedium.points;
    } else {
      // 近距离视图，使用高密度采样（最多150个点以保证性能）
      return pointsHigh.points.slice(0, 150);
    }
  }, [mapRegion.latitudeDelta]);

  // 根据缩放级别计算圆圈半径 - 使用useMemo优化性能
  const circleRadius = useMemo(() => {
    return Math.max(500, 2000 - currentZoom * 200);
  }, [currentZoom]);

  // 计算两点间距离（km）
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 地球半径（km）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // 找到最近的采样点
  const findNearestPoint = (tapLat: number, tapLon: number): PM25Point => {
    let nearestPoint = currentPoints[0];
    let minDistance = calculateDistance(tapLat, tapLon, nearestPoint.latitude, nearestPoint.longitude);

    for (const point of currentPoints) {
      const distance = calculateDistance(tapLat, tapLon, point.latitude, point.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = point;
      }
    }

    return nearestPoint;
  };

  // 处理长按地图事件
  const handleMapLongPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log('Long press at:', latitude, longitude);
    
    if (currentPoints.length > 0) {
      const nearestPoint = findNearestPoint(latitude, longitude);
      const distance = calculateDistance(latitude, longitude, nearestPoint.latitude, nearestPoint.longitude);
      
      setSelectedArea({
        pm25: nearestPoint.pm25,
        coordinates: [longitude, latitude], // 使用长按的位置
        areaName: `Nearest PM2.5 data (${distance.toFixed(1)}km away)`,
      });
    }
  };

  // 处理地图区域变化 - 只在拖动完成时更新
  const handleRegionChangeComplete = (region: any) => {
    setMapRegion(region);
    setCurrentZoom(Math.log2(360 / region.latitudeDelta));
    console.log('Map region changed:', region);
  };

  const renderLegend = () => (
    <View style={styles.legend}>
      <TouchableOpacity 
        style={styles.legendHeader}
        onPress={() => setShowLegend(!showLegend)}
      >
        <Text style={styles.legendTitle}>PM2.5 Air Quality Index</Text>
        <Text style={styles.legendToggle}>{showLegend ? '▼' : '▲'}</Text>
      </TouchableOpacity>
      
      {showLegend && (
        <>
          {[
            { range: '0-12', color: '#00E400', status: 'Good' },
            { range: '13-35', color: '#FFFF00', status: 'Moderate' },
            { range: '36-55', color: '#FF7E00', status: 'Unhealthy for Sensitive' },
            { range: '56-150', color: '#FF0000', status: 'Unhealthy' },
            { range: '151-250', color: '#8F3F97', status: 'Very Unhealthy' },
            { range: '250+', color: '#7E0023', status: 'Hazardous' },
          ].map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.range}: {item.status}</Text>
            </View>
          ))}
          <Text style={styles.legendHint}>💡 Long-tap anywhere to view PM2.5 details</Text>
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Brisbane PM2.5 Data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Brisbane PM2.5 Map</Text>
        <Text style={styles.headerSubtitle}>100km radius • High-resolution Data</Text>
      </View>

      {/* Usage Tip */}
      {showTip && (
        <TouchableOpacity 
          style={styles.tipContainer}
          onPress={() => setShowTip(false)}
        >
          <Text style={styles.tipText}>
            💡 Long-tap anywhere on the map to view PM2.5 details
          </Text>
          <Text style={styles.tipDismiss}>
            (Tap to dismiss)
          </Text>
        </TouchableOpacity>
      )}

      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        mapType="standard"
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        minZoomLevel={4}
        maxZoomLevel={18}
        onRegionChangeComplete={handleRegionChangeComplete}
        onLongPress={handleMapLongPress}
      >
        {/* PM2.5采样点数据 */}
        {currentPoints.map((point: PM25Point, index: number) => (
          <Circle
            key={`point-${index}`}
            center={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            radius={circleRadius} // 使用预计算的半径值
            fillColor={point.color + '80'} // 添加透明度
            strokeColor={point.color}
            strokeWidth={1}
          />
        ))}


        {/* Show selected area marker */}
        {selectedArea && (
          <Marker
            coordinate={{
              latitude: selectedArea.coordinates[1],
              longitude: selectedArea.coordinates[0],
            }}
            title={selectedArea.areaName}
            description={`PM2.5: ${selectedArea.pm25} μg/m³ - ${getPM25Status(selectedArea.pm25)}`}
          />
        )}
      </MapView>

      {/* Air quality information panel */}
      {selectedArea && (
        <View style={styles.infoPanel}>
          <View style={styles.infoPanelHeader}>
            <Text style={styles.infoPanelTitle}>{selectedArea.areaName}</Text>
            <TouchableOpacity
              onPress={() => setSelectedArea(null)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoPanelContent}>
            <View style={styles.pm25Display}>
              <Text style={styles.pm25Value}>{selectedArea.pm25}</Text>
              <Text style={styles.pm25Unit}>μg/m³</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getPM25Color(selectedArea.pm25) }
            ]}>
              <Text style={styles.statusText}>
                {getPM25Status(selectedArea.pm25)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Legend */}
      {renderLegend()}


      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.controlButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            // Reset to Brisbane view
            setMapRegion({
              latitude: -27.4698,
              longitude: 153.0251,
              latitudeDelta: 2.0,
              longitudeDelta: 2.0,
            });
            setSelectedArea(null);
          }}
        >
          <Text style={styles.controlButtonText}>Reset View</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E6F3FF',
    marginTop: 4,
  },
  tipContainer: {
    backgroundColor: '#F0F8FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tipText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  tipDismiss: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  map: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 12,
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  legendToggle: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    flex: 1,
    color: '#555',
    fontWeight: '500',
  },
  legendHint: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 80,
    left: 10,
    right: 10,
    zIndex: 1000,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  infoPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoPanelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  infoPanelContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pm25Display: {
    alignItems: 'center',
  },
  pm25Value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  pm25Unit: {
    fontSize: 14,
    color: '#666',
    marginTop: -4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  controlButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MapScreen;
