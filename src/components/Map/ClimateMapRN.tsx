// React Native Maps specific implementation
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, UrlTile, Polygon } from 'react-native-maps';
import { useMapStore } from '../../store/mapStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Region } from '../../types/map.types';
import { TILE_CONFIG } from '../../constants/mapConfig';
import { MapProviderInterface } from '../../services/MapProvider';

interface ClimateMapRNProps {
  onRegionChange?: (region: Region) => void;
  style?: any;
  mapProvider?: MapProviderInterface | null;
}

export const ClimateMapRN: React.FC<ClimateMapRNProps> = ({ 
  onRegionChange, 
  style,
  mapProvider
}) => {
  const { 
    region, 
    activeLayer, 
    mapLevel, 
    regionBoundary,
    setRegion, 
    setLoading, 
    setError 
  } = useMapStore();
  
  const { tileServerUrl } = useSettingsStore();
  const mapRef = useRef<MapView>(null);

  // Connect map ref to provider
  useEffect(() => {
    if (mapProvider && mapRef.current) {
      (mapProvider as any).setMapRef(mapRef.current);
    }
  }, [mapProvider]);

  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
    onRegionChange?.(newRegion);
    setLoading(false);
  }, [setRegion, onRegionChange, setLoading]);

  const handleMapLongPress = useCallback((event: any) => {
    const { coordinate } = event.nativeEvent;
    mapProvider?.emitLongPress?.(coordinate);
  }, [mapProvider]);

  // Generate tile URL template for Phase 0 tile server
  // Phase 0 format: http://localhost:8000/tiles/pm25/{z}/{x}/{y}.png
  const tileUrlTemplate = mapProvider ? 
    (mapProvider as any).getTileUrl?.() || `${tileServerUrl}/${activeLayer}/{z}/{x}/{y}.png` :
    `${tileServerUrl}/${activeLayer}/{z}/{x}/{y}.png`;

  useEffect(() => {
    // Reset loading state when layer or level changes
    setLoading(true);
  }, [activeLayer, mapLevel, setLoading]);

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        onLongPress={handleMapLongPress}
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
        {regionBoundary && regionBoundary.coordinates.map((polygon, idx) => (
          <Polygon
            key={`${regionBoundary.regionId}-${idx}`}
            coordinates={polygon}
            strokeColor="#007AFF"
            strokeWidth={3}
            fillColor="rgba(0, 122, 255, 0.1)"
            zIndex={3}
          />
        ))}
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
