import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CLIMATE_LAYERS } from '../../constants/climateData';

interface LegendProps {
  layer?: keyof typeof CLIMATE_LAYERS;
  style?: any;
}

export const Legend: React.FC<LegendProps> = ({ layer = 'pm25', style }) => {
  const config = CLIMATE_LAYERS[layer];

  return (
    <View style={[styles.container, style]}> 
      <Text style={styles.title}>{config.name}</Text>
      <View style={styles.rows}>
        {config.thresholds.map((t, idx) => {
          const next = config.thresholds[idx + 1];
          const label = next !== undefined ? `${t}–${next} ${config.unit}` : `${t}+ ${config.unit}`;
          const color = config.colorScale[Math.min(idx, config.colorScale.length - 1)];
          return (
            <View key={`${layer}-${idx}`} style={styles.row}>
              <View style={[styles.swatch, { backgroundColor: color }]} />
              <Text style={styles.label}>{label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 10,
    borderRadius: 8,
    minWidth: 160,
    maxWidth: 220,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  rows: {
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  swatch: {
    width: 16,
    height: 10,
    borderRadius: 2,
    marginRight: 8,
  },
  label: {
    fontSize: 11,
    color: '#444',
  },
});
