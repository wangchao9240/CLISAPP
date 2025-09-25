// Universal map component that can switch between React Native Maps and MapLibre
import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useMapStore } from '../../store/mapStore';
import { useSettingsStore } from '../../store/settingsStore';
import { MapProviderFactory, MapProviderInterface } from '../../services/MapProvider';
import { Region } from '../../types/map.types';

// React Native Maps implementation
import { ClimateMapRN } from './ClimateMapRN';

// OpenStreetMap implementation (free alternative)
import { OpenStreetMap } from './OpenStreetMap';

// MapLibre implementation (placeholder for future)
// import { ClimateMapLibre } from './ClimateMapLibre';

interface UniversalMapProps {
  onRegionChange?: (region: Region) => void;
  style?: any;
}

export const UniversalMap: React.FC<UniversalMapProps> = ({ 
  onRegionChange, 
  style 
}) => {
  const { 
    region, 
    activeLayer, 
    mapLevel, 
    setRegion, 
    setError 
  } = useMapStore();
  
  const { mapProvider, baseTileProvider, tileServerUrl } = useSettingsStore();
  const mapProviderRef = useRef<MapProviderInterface | null>(null);

  // Initialize map provider
  useEffect(() => {
    try {
      mapProviderRef.current = MapProviderFactory.create({
        provider: mapProvider,
        tileServerUrl,
      });

      // Set up event handlers
      mapProviderRef.current.onRegionChange((newRegion) => {
        setRegion(newRegion);
        onRegionChange?.(newRegion);
      });

      mapProviderRef.current.onPress((coordinate) => {
        // Handle area tap for info card
        console.log('Map tapped at:', coordinate);
      });

    } catch (error) {
      console.error('Failed to initialize map provider:', error);
      setError('Failed to initialize map');
    }

    return () => {
      mapProviderRef.current?.destroy();
    };
  }, [mapProvider, baseTileProvider, tileServerUrl, setRegion, onRegionChange, setError]);

  // Update tile layer when layer or level changes
  useEffect(() => {
    mapProviderRef.current?.setTileLayer(activeLayer, mapLevel);
  }, [activeLayer, mapLevel]);

  // Render appropriate map component based on provider
  const renderMap = () => {
    switch (mapProvider) {
      case 'react-native-maps':
        // Use React Native Maps with different base tile providers
        if (baseTileProvider === 'openstreetmap') {
          return (
            <OpenStreetMap 
              onRegionChange={onRegionChange}
              style={style}
            />
          );
        } else {
          // Google Maps or other providers
          return (
            <ClimateMapRN 
              onRegionChange={onRegionChange}
              style={style}
              mapProvider={mapProviderRef.current}
            />
          );
        }
      
      case 'maplibre':
        // Future implementation
        // return <ClimateMapLibre {...props} />;
        return (
          <View style={styles.placeholder}>
            {/* MapLibre implementation placeholder */}
          </View>
        );
      
      default:
        // Default to React Native Maps with OpenStreetMap
        return (
          <OpenStreetMap 
            onRegionChange={onRegionChange}
            style={style}
          />
        );
    }
  };

  return (
    <View style={[styles.container, style]}>
      {renderMap()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
