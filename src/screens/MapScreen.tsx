import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import MapView, { Geojson, Marker } from 'react-native-maps';
import bbox from '@turf/bbox';
import { getPM25Color, getPM25Status, getGeometryCenter } from '../utils/airQualityUtils';
const geodata = require('../assets/geodata/geodata_qld_only.json');

interface PM25Data {
  pm25: number;
  coordinates: [number, number];
  areaName?: string;
}

interface MapScreenProps {
  navigation?: any;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState<PM25Data | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: -20.7256,
    longitude: 139.4927,
    latitudeDelta: 25.0,
    longitudeDelta: 25.0,
  });

  useEffect(() => {
    try {
      // Calculate bounding box for Queensland
      const boundingBox = bbox(geodata);
      const [minLng, minLat, maxLng, maxLat] = boundingBox;
      
      console.log('GeoJSON bounding box:', boundingBox);
      console.log('Features count:', geodata.features.length);
      
      // Set map region to fit Queensland with some padding
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      const latDelta = Math.max((maxLat - minLat) * 1.2, 0.1);
      const lngDelta = Math.max((maxLng - minLng) * 1.2, 0.1);
      
      setMapRegion({
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      });
      
      console.log('Map region set to:', {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error processing geodata:', error);
      Alert.alert('Error', 'Failed to load map data');
      setLoading(false);
    }
  }, []);

  const handleGeojsonPress = (event: any) => {
    console.log('event', event);
    
    // Check if event and nativeEvent exist
    if (!event || !event.feature) {
      console.log('No nativeEvent found');
      return;
    }
    
    const { properties, geometry } = event.feature;
    
    // Check if properties exist
    if (!properties) {
      console.log('No properties found');
      return;
    }
    
    console.log('Properties:', properties);
    
    if (properties.pm25_value_mean !== undefined && properties.pm25_value_mean !== null) {
      let coords;
      
      // Safely get geometry center
      try {
        coords = getGeometryCenter(geometry?.coordinates);
      } catch (error) {
        console.log('Error getting geometry center:', error);
        // Use a default coordinate for Queensland if geometry parsing fails
        coords = [153.0251, -27.4698] as [number, number];
      }
      
      setSelectedArea({
        pm25: properties.pm25_value_mean,
        coordinates: coords,
        areaName: properties.LGA_NAME25 || 'Queensland Area',
      });
    }
  };

  const renderLegend = () => (
    <View style={styles.legend}>
      <Text style={styles.legendTitle}>PM2.5 Air Quality Index</Text>
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
      <Text style={styles.legendHint}>💡 Pinch to zoom, tap regions for details</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Queensland Air Quality Map...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Queensland Air Quality Map</Text>
        <Text style={styles.headerSubtitle}>PM2.5 Concentration Levels</Text>
      </View>

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
        onRegionChange={(region) => console.log('Map region changed:', region)}
      >
        {/* Render Queensland boundaries with PM2.5 data */}
        {geodata && geodata.features && geodata.features.map((feature: any, index: number) => {
          const pm25 = feature.properties?.pm25_value_mean;
          let fillColor = 'rgba(204, 204, 204, 0.2)';
          
          if (pm25 !== undefined && pm25 !== null) {
            const baseColor = getPM25Color(pm25);
            // Convert hex color to rgba with transparency
            const hexToRgba = (hex: string, alpha: number = 0.6): string => {
              const r = parseInt(hex.slice(1, 3), 16);
              const g = parseInt(hex.slice(3, 5), 16);
              const b = parseInt(hex.slice(5, 7), 16);
              return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            };
            fillColor = hexToRgba(baseColor, 0.6);
            console.log(`Feature ${feature.properties?.LGA_NAME25} PM2.5: ${pm25}, Color: ${fillColor}`);
          }

          const singleFeatureGeojson = {
            type: 'FeatureCollection',
            features: [feature]
          };

          return (
            <Geojson
              key={`feature-${index}`}
              geojson={singleFeatureGeojson}
              strokeColor="#FFFFFF"
              strokeWidth={2}
              fillColor={fillColor}
              onPress={handleGeojsonPress}
            />
          );
        })}

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
            // Reset to Queensland view
            setMapRegion({
              latitude: -27.4698,
              longitude: 153.0251,
              latitudeDelta: 8.0,
              longitudeDelta: 8.0,
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
  map: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    top: 80,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 12,
    maxWidth: 220,
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
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
