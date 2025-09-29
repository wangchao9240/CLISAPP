// Universal map component that can switch between React Native Maps and MapLibre
import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useMapStore } from '../../store/mapStore';
import { useSettingsStore } from '../../store/settingsStore';
import { MapProviderFactory, MapProviderInterface } from '../../services/MapProvider';
import { fetchRegionInfoByCoordinates, formatClimateOverview } from '../../hooks/useApi';
import { Region } from '../../types/map.types';
import { RegionInfoPanel } from '../panels/RegionInfoPanel';

// React Native Maps implementation
import { ClimateMapRN } from './ClimateMapRN';

// OpenStreetMap implementation (free alternative)
import { OpenStreetMap } from './OpenStreetMap';

// MapLibre implementation (placeholder for future)
// import { ClimateMapLibre } from './ClimateMapLibre';

interface UniversalMapProps {
  onRegionChange?: (region: Region) => void;
  style?: any;
  onMapReady?: (provider: MapProviderInterface | null) => void;
}

export const UniversalMap: React.FC<UniversalMapProps> = ({ 
  onRegionChange, 
  style, 
  onMapReady,
}) => {
  const { 
    region, 
    activeLayer, 
    mapLevel, 
    setRegion, 
    selectedRegionId,
    animateToRegion,
    setError,
    setSelectedRegion,
    openRegionInfo,
    setRegionInfoLoading,
    setRegionInfoError,
  } = useMapStore();
  
  const { mapProvider, baseTileProvider, tileServerUrl } = useSettingsStore();
  const mapProviderRef = useRef<MapProviderInterface | null>(null);

  useEffect(() => {
    try {
      mapProviderRef.current = MapProviderFactory.create({
        provider: mapProvider,
        tileServerUrl,
      });

      onMapReady?.(mapProviderRef.current);

      mapProviderRef.current.onRegionChange((newRegion) => {
        setRegion(newRegion);
        onRegionChange?.(newRegion);
      });

      mapProviderRef.current.onLongPress((coordinate) => {
        handleMapLongPress(coordinate.latitude, coordinate.longitude);
      });

    } catch (error) {
      console.error('Failed to initialize map provider:', error);
      setError('Failed to initialize map');
    }

    return () => {
      mapProviderRef.current?.destroy();
      onMapReady?.(null);
    };
  }, [mapProvider, baseTileProvider, tileServerUrl, setRegion, onRegionChange, setError, onMapReady]);

  useEffect(() => {
    mapProviderRef.current?.setTileLayer(activeLayer, mapLevel);
  }, [activeLayer, mapLevel]);

  useEffect(() => {
    if (selectedRegionId) {
      mapProviderRef.current?.animateToRegion(region, 600);
    }
  }, [selectedRegionId, region]);

  const handleMapLongPress = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        setRegionInfoLoading(true);
        const info = await fetchRegionInfoByCoordinates(latitude, longitude, true);
        if (!info) {
          setRegionInfoError('No regional information found for this location');
          return;
        }
        const overview = formatClimateOverview(info.current_climate, activeLayer);
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
    },
    [activeLayer, openRegionInfo, setRegionInfoLoading, setRegionInfoError, setSelectedRegion]
  );

  const renderMap = () => {
    switch (mapProvider) {
      case 'react-native-maps':
        if (baseTileProvider === 'openstreetmap') {
          return (
            <OpenStreetMap 
              onRegionChange={onRegionChange}
              style={style}
              providerRef={mapProviderRef}
            />
          );
        }
        return (
          <ClimateMapRN 
            onRegionChange={onRegionChange}
            style={style}
            mapProvider={mapProviderRef.current}
          />
        );
      case 'maplibre':
        return (
          <View style={styles.placeholder}>
          </View>
        );
      default:
        return (
          <OpenStreetMap 
            onRegionChange={onRegionChange}
            style={style}
            providerRef={mapProviderRef}
          />
        );
    }
  };

  return (
    <View style={[styles.container, style]}>
      {renderMap()}
      <RegionInfoPanel />
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
