/**
 * OpenStreetMap Component
 * Free alternative to Google Maps using react-native-maps with OSM tiles
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { UrlTile, LatLng, Region as RNRegion, MapEvent } from 'react-native-maps';
import { useMapStore } from '../../store/mapStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Region } from '../../types/map.types';
import { TILE_CONFIG, DEFAULT_OSM_TILE_SERVER, QUEENSLAND_BOUNDS } from '../../constants/mapConfig';
import { Region as MapRegion } from '../../types/map.types';
import { MapProviderInterface } from '../../services/MapProvider';
import { fetchRegionInfoByCoordinates, formatClimateOverview } from '../../hooks/useApi';

interface OpenStreetMapProps {
  onRegionChange?: (region: Region) => void;
  style?: any;
  providerRef?: React.MutableRefObject<MapProviderInterface | null>;
}

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({ 
  onRegionChange, 
  style,
  providerRef,
}) => {
  const { region, activeLayer, mapLevel, setRegion, setLoading, setError, openRegionInfo, setRegionInfoLoading, setRegionInfoError, setSelectedRegion } = useMapStore();
  const { tileServerUrl } = useSettingsStore();

  const mapRef = useRef<MapView>(null);
  const pendingTargetRef = useRef<MapRegion | null>(null);

  useEffect(() => {
    if (providerRef?.current && 'setMapRef' in providerRef.current) {
      (providerRef.current as any).setMapRef(mapRef.current);
    }
  }, [providerRef]);

  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
    onRegionChange?.(newRegion);
    setLoading(false);
  }, [setRegion, onRegionChange, setLoading]);

  const handleMapError = useCallback((error: any) => {
    console.error('Map error:', error);
    setError('Failed to load map data');
  }, [setError]);

  const handleMapLongPress = useCallback(async (event: MapEvent<LatLng>) => {
    const coordinate = event.nativeEvent.coordinate;
    try {
      setRegionInfoLoading(true);
      const info = await fetchRegionInfoByCoordinates(coordinate.latitude, coordinate.longitude, true);
      if (!info) {
        setRegionInfoError('No regional information found for this location');
        return;
      }
      const overview = formatClimateOverview(info.current_climate, useMapStore.getState().activeLayer);
      openRegionInfo({
        regionId: info.id,
        regionName: info.name,
        regionType: info.type,
        climate: overview,
      });
      setSelectedRegion(info.id);
    } catch (error) {
      console.error('Failed to fetch region info', error);
      setRegionInfoError('Failed to load region information');
    }
  }, [openRegionInfo, setRegionInfoLoading, setRegionInfoError, setSelectedRegion]);

  const climateTileUrl = `${tileServerUrl}/${activeLayer}/{z}/{x}/{y}.png`;

  useEffect(() => {
    setLoading(true);
    if (pendingTargetRef.current) {
      const target = pendingTargetRef.current;
      pendingTargetRef.current = null;
      mapRef.current?.animateToRegion(target as any, 600);
    }
  }, [activeLayer, mapLevel, setLoading]);

  const clampToBounds = (r: RNRegion): RNRegion => {
    const lat = Math.max(Math.min(r.latitude, QUEENSLAND_BOUNDS.north), QUEENSLAND_BOUNDS.south);
    const lon = Math.max(Math.min(r.longitude, QUEENSLAND_BOUNDS.east), QUEENSLAND_BOUNDS.west);
    return { ...r, latitude: lat, longitude: lon };
  };

  const nearlyEqual = (a: number, b: number, eps = 1e-4) => Math.abs(a - b) < eps;

  const needSnapBack = (a: RNRegion, b: RNRegion): boolean => {
    return !(nearlyEqual(a.latitude, b.latitude) && nearlyEqual(a.longitude, b.longitude));
  };

  useEffect(() => {
    if (providerRef?.current) {
      providerRef.current.animateToRegion = (target, duration = 600) => {
        pendingTargetRef.current = target as any;
        mapRef.current?.animateToRegion(target as any, duration);
      };
      providerRef.current.setRegion = (target) => {
        pendingTargetRef.current = target as any;
        mapRef.current?.animateToRegion(target as any, 0);
      };
      providerRef.current.emitLongPress = (coordinate) => {
        handleMapLongPress({ nativeEvent: { coordinate } } as MapEvent<LatLng>);
      };
    }
  }, [providerRef, handleMapLongPress]);

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
            mapRef.current?.animateToRegion(clamped, 250);
          }
          handleRegionChangeComplete(clamped as any);
        }}
        onError={handleMapError}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale={false}
        loadingEnabled
        loadingIndicatorColor="#007AFF"
        onLongPress={handleMapLongPress}
      >
        <UrlTile
          urlTemplate={DEFAULT_OSM_TILE_SERVER}
          maximumZ={18}
          minimumZ={1}
          zIndex={1}
        />
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
