// Main map screen implementing FR-001 and FR-002
import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UniversalMap } from '../components/Map/UniversalMap';

import { Legend } from '../components/UI/Legend';
import { LayerSelector } from '../components/UI/LayerSelector';
import { TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';

export const MapScreen: React.FC = () => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.mapContainer}>
        <UniversalMap />
        
        {/* Map controls overlay */}
        <View style={styles.controlsOverlay}>
          <TouchableOpacity style={styles.selectorButton} onPress={() => setSelectorOpen(v => !v)}>
            <Text style={styles.selectorButtonText}>图层</Text>
          </TouchableOpacity>
          {selectorOpen && (
            <LayerSelector style={styles.selectorPanel} onSelected={() => setSelectorOpen(false)} />
          )}
          <Legend style={styles.legend} layer={undefined as any} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none', // Allow touches to pass through to map
  },
  selectorButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectorButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  selectorPanel: {
    position: 'absolute',
    top: 56,
    right: 16,
  },
  legend: {
    position: 'absolute',
    bottom: 24,
    right: 16,
  }
});
