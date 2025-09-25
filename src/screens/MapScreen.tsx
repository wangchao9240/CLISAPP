// Main map screen implementing FR-001 and FR-002
import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { UniversalMap } from '../components/Map/UniversalMap';
import { LevelSwitch } from '../components/Map/LevelSwitch';

export const MapScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.mapContainer}>
        <UniversalMap />
        
        {/* Map controls overlay */}
        <View style={styles.controlsOverlay}>
          <LevelSwitch style={styles.levelSwitch} />
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
  levelSwitch: {
    position: 'absolute',
    top: 20,
    right: 16,
    minWidth: 120,
  },
});
