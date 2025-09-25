// Main map screen implementing FR-001 and FR-002
import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UniversalMap } from '../components/Map/UniversalMap';
import { LevelSwitch } from '../components/Map/LevelSwitch';
import { ConnectionStatus } from '../components/UI/ConnectionStatus';
import { MapProviderSwitch } from '../components/UI/MapProviderSwitch';

export const MapScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.mapContainer}>
        <UniversalMap />
        
        {/* Map controls overlay */}
        <View style={styles.controlsOverlay}>
          <ConnectionStatus style={styles.connectionStatus} showDetails={false} />
          <LevelSwitch style={styles.levelSwitch} />
          <MapProviderSwitch style={styles.mapProviderSwitch} />
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
  connectionStatus: {
    position: 'absolute',
    top: 20,
    left: 16,
    minWidth: 120,
  },
  levelSwitch: {
    position: 'absolute',
    top: 20,
    right: 16,
    minWidth: 120,
  },
  mapProviderSwitch: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    minWidth: 200,
  },
});
