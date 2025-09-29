import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useRegionSearch } from '../../hooks/useApi';
import { RegionSearchResult } from '../../services/ApiService';
import { useMapStore } from '../../store/mapStore';
import { Region } from '../../types/map.types';
import { fetchRegionInfoByCoordinates, formatClimateOverview } from '../../hooks/useApi';
import { useSettingsStore } from '../../store/settingsStore';

interface RegionSearchBarProps {
  style?: any;
}

export const RegionSearchBar: React.FC<RegionSearchBarProps> = ({ style }) => {
  const [query, setQuery] = useState('');
  const [suppressSearch, setSuppressSearch] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const { data, loading, error, searchRegions, clearResults } = useRegionSearch();
  const { setRegion, setMapLevel, setSelectedRegion, setLoading, openRegionInfo, setRegionInfoLoading, setRegionInfoError, closeRegionInfo } = useMapStore();
  const { tileServerUrl } = useSettingsStore();

  useEffect(() => {
    if (suppressSearch) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      clearResults();
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchRegions(query.trim(), undefined, 5);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, suppressSearch, searchRegions, clearResults]);

  const handleSelect = useCallback((item: RegionSearchResult) => {
    setSuppressSearch(true);
    setQuery(item.name);
    clearResults();
    Keyboard.dismiss();

    const deltas = getDeltasForType(item.type);
    const targetRegion: Region = {
      latitude: item.location.latitude,
      longitude: item.location.longitude,
      latitudeDelta: deltas.latitudeDelta,
      longitudeDelta: deltas.longitudeDelta,
    };

    setRegion(targetRegion);
    setSelectedRegion(item.id);
    setLoading(true);

    const targetLevel = inferMapLevel(item.type);
    if (targetLevel) {
      setMapLevel(targetLevel);
    }

    setRegionInfoLoading(true);
    fetchRegionInfoByCoordinates(item.location.latitude, item.location.longitude, true)
      .then((info) => {
        if (!info) {
        setRegionInfoError('No climate data available for this region');
          return;
        }
        const overview = formatClimateOverview(info.current_climate, useMapStore.getState().activeLayer);
        openRegionInfo({
          regionId: info.id,
          regionName: info.name,
          regionType: info.type,
          climate: overview,
        });
      })
      .catch((err) => {
        console.error('Failed to load region info', err);
      setRegionInfoError('Failed to load region information');
      });
  }, [setRegion, setMapLevel, clearResults, setSelectedRegion, openRegionInfo, setRegionInfoLoading, setRegionInfoError]);

  const renderResult = ({ item }: { item: RegionSearchResult }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)}>
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultMeta}>{formatRegionMeta(item)}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleChangeText = useCallback((text: string) => {
    setSuppressSearch(false);
    setQuery(text);
    if (text.trim().length === 0) {
      closeRegionInfo();
    }
  }, [closeRegionInfo]);

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        value={query}
        placeholder="Search region (LGA / Suburb)"
        onChangeText={handleChangeText}
        accessibilityLabel="Region search"
        returnKeyType="search"
      />
      {loading && <ActivityIndicator style={styles.indicator} size="small" color="#007AFF" />}
      {!loading && error && <Text style={styles.errorText}>{error}</Text>}
      {data.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderResult}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
    </View>
  );
};

const getDeltasForType = (type: RegionSearchResult['type']) => {
  switch (type) {
    case 'suburb':
      return { latitudeDelta: 0.05, longitudeDelta: 0.05 };
    case 'postcode':
      return { latitudeDelta: 0.08, longitudeDelta: 0.08 };
    case 'city':
      return { latitudeDelta: 0.15, longitudeDelta: 0.15 };
    case 'lga':
    default:
      return { latitudeDelta: 0.35, longitudeDelta: 0.35 };
  }
};

const inferMapLevel = (type: RegionSearchResult['type']) => {
  if (type === 'suburb' || type === 'postcode') {
    return 'suburb' as const;
  }
  if (type === 'lga') {
    return 'lga' as const;
  }
  return undefined;
};

const formatRegionMeta = (item: RegionSearchResult) => {
  const parts: string[] = [];
  parts.push(item.state);
  parts.push(item.type.toUpperCase());
  if (item.population) {
    parts.push(`Population ${item.population.toLocaleString()}`);
  }
  return parts.join(' · ');
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  indicator: {
    position: 'absolute',
    right: 12,
    top: 9,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#D32F2F',
  },
  resultsContainer: {
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    maxHeight: 220,
    overflow: 'hidden',
  },
  resultItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  resultTextContainer: {
    flexDirection: 'column',
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  resultMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 8,
  },
});


