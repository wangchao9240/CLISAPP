/**
 * OpenStreetMap Component
 * Free alternative to Google Maps using react-native-maps with OSM tiles
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { UrlTile, LatLng, Region as RNRegion } from 'react-native-maps';
import { useMapStore } from '../../store/mapStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Region } from '../../types/map.types';
import { TILE_CONFIG, DEFAULT_OSM_TILE_SERVER, QUEENSLAND_BOUNDS } from '../../constants/mapConfig';

interface OpenStreetMapProps {
  onRegionChange?: (region: Region) => void;
  style?: any;
}

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({ 
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
  }, [setError]);

  // Generate climate data tile URL template (Phase 0 format: no mapLevel)
  const climateTileUrl = `${tileServerUrl}/${activeLayer}/{z}/{x}/{y}.png`;

  useEffect(() => {
    // Reset loading state when layer or level changes
    setLoading(true);
  }, [activeLayer, mapLevel, setLoading]);

  // clamp region to Australia bounds on region change complete
  const clampToBounds = (r: RNRegion): RNRegion => {
    const lat = Math.max(Math.min(r.latitude, QUEENSLAND_BOUNDS.north), QUEENSLAND_BOUNDS.south);
    const lon = Math.max(Math.min(r.longitude, QUEENSLAND_BOUNDS.east), QUEENSLAND_BOUNDS.west);
    return { ...r, latitude: lat, longitude: lon };
  };

  const isOutOfBounds = (r: RNRegion): boolean => {
    return r.latitude > QUEENSLAND_BOUNDS.north || r.latitude < QUEENSLAND_BOUNDS.south ||
           r.longitude > QUEENSLAND_BOUNDS.east || r.longitude < QUEENSLAND_BOUNDS.west;
  };

  const nearlyEqual = (a: number, b: number, eps = 1e-4) => Math.abs(a - b) < eps;

  const needSnapBack = (a: RNRegion, b: RNRegion): boolean => {
    return !(nearlyEqual(a.latitude, b.latitude) && nearlyEqual(a.longitude, b.longitude));
  };

  const mapRef = useRef<MapView>(null);

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        region={clampToBounds(region as any)}
        onRegionChangeComplete={(r) => {
          const clamped = clampToBounds(r as any);
          if (needSnapBack(r as any, clamped)) {
            // Smoothly snap back into bounds
            mapRef.current?.animateToRegion(clamped, 250);
          }
          handleRegionChangeComplete(clamped as any);
        }}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale={false}
        loadingEnabled
        loadingIndicatorColor="#007AFF"
        // No provider specified - uses native maps without Google dependency
      >
        {/* OpenStreetMap base layer */}
        <UrlTile
          urlTemplate={DEFAULT_OSM_TILE_SERVER}
          maximumZ={18}
          minimumZ={1}
          zIndex={1}
        />
        
        {/* Climate data overlay from our backend */}
        <UrlTile
          urlTemplate={climateTileUrl}
          maximumZ={TILE_CONFIG.maximumZ}
          minimumZ={TILE_CONFIG.minimumZ}
          flipY={false}
          opacity={TILE_CONFIG.opacity}
          zIndex={2}
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
