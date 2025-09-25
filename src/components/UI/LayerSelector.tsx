import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useMapStore } from '../../store/mapStore';
import { CLIMATE_LAYERS } from '../../constants/climateData';

const LAYERS: Array<{ key: keyof typeof CLIMATE_LAYERS; label: string; available: boolean }> = [
  { key: 'pm25', label: 'PM2.5', available: true },
  { key: 'precipitation', label: '降水', available: false },
  { key: 'uv', label: '紫外线', available: false },
  { key: 'humidity', label: '湿度', available: false },
  { key: 'temperature', label: '温度', available: false },
];

export const LayerSelector: React.FC<{ style?: any; onSelected?: () => void }> = ({ style, onSelected }) => {
  const { activeLayer, setActiveLayer } = useMapStore();

  const title = useMemo(() => {
    const found = LAYERS.find(l => l.key === activeLayer);
    return found ? found.label : 'PM2.5';
  }, [activeLayer]);

  const onSelect = (key: keyof typeof CLIMATE_LAYERS, available: boolean) => {
    if (!available) {
      Alert.alert('提示', '该数据维度即将推出');
      return;
    }
    setActiveLayer(key as any);
    onSelected?.();
  };

  return (
    <View style={[styles.container, style]}> 
      {/* <Text style={styles.current}>{title} ▼</Text> */}
      <View style={styles.menu}> 
        {LAYERS.map(item => (
          <TouchableOpacity key={item.key} onPress={() => onSelect(item.key, item.available)} style={styles.item}>
            <Text style={[styles.itemText, item.key === activeLayer && styles.active]}>
              {item.label}{item.key === activeLayer ? ' ✓' : item.available ? '' : '（即将推出）'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  current: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  menu: {
    marginTop: 0,
  },
  item: {
    paddingVertical: 6,
  },
  itemText: {
    fontSize: 13,
    color: '#333',
  },
  active: {
    color: '#007AFF',
    fontWeight: '700',
  },
});
