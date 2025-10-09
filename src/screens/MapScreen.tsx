// Main map screen implementing FR-001 and FR-002
import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UniversalMap } from '../components/Map/UniversalMap';

import { Legend } from '../components/UI/Legend';
import { LayerSelector } from '../components/UI/LayerSelector';
import { RegionSearchBar } from '../components/UI/RegionSearchBar';

export const MapScreen: React.FC = () => {
  const [legendVisible, setLegendVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.mapContainer}>
        <UniversalMap />
        
        {/* Map controls overlay */}
        <View style={styles.controlsOverlay}>
          {/* Top Bar with Account Icon, Search Bar, and Layer Selector */}
          <View style={styles.topBar}>
            {/* Account Icon Placeholder (Left) */}
            <TouchableOpacity style={styles.accountButton}>
              <View style={styles.accountIconContainer}>
                {/* Head circle */}
                <View style={styles.accountIconHead} />
                {/* Body/shoulders */}
                <View style={styles.accountIconBody} />
              </View>
            </TouchableOpacity>

            {/* Search Bar (Center) */}
            <RegionSearchBar style={styles.searchBar} />

            {/* Layer Selector (Right) */}
            <LayerSelector style={styles.layerSelectorButton} />
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            {/* Left: Legend Toggle Button */}
            <View style={styles.legendContainer}>
              {legendVisible && (
                <View style={styles.legendPopup}>
                  <Legend layer={undefined as any} />
                </View>
              )}
              <TouchableOpacity 
                style={styles.legendButton}
                onPress={() => setLegendVisible(!legendVisible)}
              >
                <View style={styles.plusIcon}>
                  <View style={styles.plusHorizontal} />
                  <View style={styles.plusVertical} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Right: Locate Me Button */}
            <TouchableOpacity style={styles.locateButton}>
              <Image 
                source={require('../assets/img/locate.png')}
                style={styles.locateIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
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
  topBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    pointerEvents: 'box-none',
  },
  accountButton: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    pointerEvents: 'auto',
  },
  accountIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  accountIconHead: {
    width: 10,
    height: 10,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: '#0A0A0A',
    backgroundColor: 'transparent',
    marginBottom: 1,
  },
  accountIconBody: {
    width: 12,
    height: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: '#0A0A0A',
    backgroundColor: 'transparent',
  },
  searchBar: {
    flex: 1,
    pointerEvents: 'auto',
  },
  layerSelectorButton: {
    pointerEvents: 'auto',
  },
  // Bottom Controls
  bottomControls: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    pointerEvents: 'box-none',
  },
  // Legend Container and Button
  legendContainer: {
    position: 'relative',
    pointerEvents: 'box-none',
  },
  legendPopup: {
    position: 'absolute',
    bottom: 68,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 200,
    pointerEvents: 'auto',
  },
  legendButton: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    pointerEvents: 'auto',
  },
  plusIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    width: 12,
    height: 2,
    backgroundColor: '#0A0A0A',
    borderRadius: 1,
  },
  plusVertical: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: '#0A0A0A',
    borderRadius: 1,
  },
  // Locate Me Button
  locateButton: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    pointerEvents: 'auto',
  },
  locateIcon: {
    width: 20,
    height: 20,
    tintColor: '#0A0A0A',
  },
});
