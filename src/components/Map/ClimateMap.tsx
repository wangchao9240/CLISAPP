// Main climate map component for CLISApp
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
import { useMapStore } from '../../store/mapStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Region } from '../../types/map.types';
import { TILE_CONFIG } from '../../constants/mapConfig';

interface ClimateMapProps {
  onRegionChange?: (region: Region) => void;
  style?: any;
}

export const ClimateMap: React.FC<ClimateMapProps> = ({ 
  onRegionChange, 
  style 
}) => {
  const { 
    region, 
    activeLayer, 
    mapLevel, 
    setRegion, 
    setLoading, 
    setError 
  } = useMapStore();
  
  const { tileServerUrl } = useSettingsStore();

  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
    onRegionChange?.(newRegion);
    setLoading(false);
  }, [setRegion, onRegionChange, setLoading]);

  const handleMapError = useCallback((error: any) => {
    console.error('Map error:', error);
    setError('Failed to load map data');
    Alert.alert('Map Error', 'Failed to load map data. Please check your connection.');
  }, [setError]);

  // Generate tile URL template
  // Phase 0 tile server format: /tiles/pm25/{z}/{x}/{y}.png (no mapLevel)
  const tileUrlTemplate = `${tileServerUrl}/${activeLayer}/{z}/{x}/{y}.png`;

  useEffect(() => {
    // Reset loading state when layer or level changes
    setLoading(true);
  }, [activeLayer, mapLevel, setLoading]);

  return (
    <View style={[styles.container, style]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        onError={handleMapError}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
        loadingEnabled
        loadingIndicatorColor="#007AFF"
      >
        <UrlTile
          urlTemplate={tileUrlTemplate}
          maximumZ={TILE_CONFIG.maximumZ}
          minimumZ={TILE_CONFIG.minimumZ}
          flipY={false}
          opacity={TILE_CONFIG.opacity}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
