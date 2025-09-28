import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useMapStore } from '../../store/mapStore';
import { RegionClimateStat } from '../../types/region.types';
import { CLIMATE_LAYER_ORDER } from '../../constants/climateData';

const formatValue = (stat: RegionClimateStat | null) => {
  if (!stat) return '--';
  const value = Number.isFinite(stat.value) ? stat.value.toFixed(stat.layer === 'humidity' ? 0 : 1) : '--';
  return `${value} ${stat.unit ?? ''}`.trim();
};

export const RegionInfoPanel: React.FC = () => {
  const { regionInfo, closeRegionInfo } = useMapStore();

  if (!regionInfo.visible) {
    return null;
  }

  const { regionName, regionType, climate, loading, error } = regionInfo;
  const primary = climate?.primary ?? null;
  const secondary = CLIMATE_LAYER_ORDER
    .filter((layer) => climate?.secondary.some((item) => item.layer === layer))
    .map((layer) => climate?.secondary.find((item) => item.layer === layer)!)
    .filter(Boolean);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.regionName}>{regionName}</Text>
          <Text style={styles.regionMeta}>{regionType === 'suburb' ? 'Suburb' : 'LGA'}</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={closeRegionInfo}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.primaryBlock}>
        <Text style={styles.primaryTitle}>{primary?.name ?? '环境数据'}</Text>
        <Text style={styles.primaryValue}>{formatValue(primary)}</Text>
        {primary?.category && <Text style={styles.primaryCategory}>{primary.category}</Text>}
      </View>

      <ScrollView horizontal contentContainerStyle={styles.secondaryGrid} showsHorizontalScrollIndicator={false}>
        {loading && (
          <View style={styles.secondaryItem}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonValue} />
          </View>
        )}
        {!loading && secondary.map((item) => (
          <View key={item.layer} style={styles.secondaryItem}>
            <Text style={styles.secondaryTitle}>{item.name}</Text>
            <Text style={styles.secondaryValue}>{formatValue(item)}</Text>
            {item.category && <Text style={styles.secondaryCategory}>{item.category}</Text>}
          </View>
        ))}
        {secondary.length === 0 && !loading && !error && (
          <Text style={styles.emptyHint}>暂无其他维度数据</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {loading && <Text style={styles.statusText}>正在加载区域信息...</Text>}
        {!loading && error && <Text style={styles.errorText}>{error}</Text>}
        {!loading && !error && primary?.lastUpdated && (
          <Text style={styles.statusText}>数据时间: {new Date(primary.lastUpdated).toLocaleString()}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: 'rgba(255,255,255,0.97)',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  regionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  regionMeta: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  closeText: {
    fontSize: 20,
    color: '#111827',
    marginTop: -2,
  },
  primaryBlock: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  primaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
  },
  primaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  primaryCategory: {
    marginTop: 6,
    fontSize: 12,
    color: '#2563EB',
  },
  secondaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryItem: {
    width: 130,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  secondaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  secondaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  secondaryCategory: {
    marginTop: 4,
    fontSize: 11,
    color: '#2563EB',
  },
  emptyHint: {
    fontSize: 12,
    color: '#9CA3AF',
    alignSelf: 'center',
    marginTop: 16,
  },
  footer: {
    marginTop: 18,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
  },
  skeletonTitle: {
    width: 80,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 8,
  },
  skeletonValue: {
    width: 60,
    height: 18,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
});
