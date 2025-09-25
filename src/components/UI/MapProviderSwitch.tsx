// Development component for switching map providers
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettingsStore } from '../../store/settingsStore';

interface MapProviderSwitchProps {
  style?: any;
}

export const MapProviderSwitch: React.FC<MapProviderSwitchProps> = ({ style }) => {
  const { mapProvider, setMapProvider } = useSettingsStore();

  const handleProviderChange = (provider: 'react-native-maps' | 'maplibre') => {
    if (provider !== mapProvider) {
      setMapProvider(provider);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Map Provider</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.leftButton,
            mapProvider === 'react-native-maps' && styles.activeButton,
          ]}
          onPress={() => handleProviderChange('react-native-maps')}
        >
          <Text
            style={[
              styles.buttonText,
              mapProvider === 'react-native-maps' && styles.activeButtonText,
            ]}
          >
            RN Maps
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.button,
            styles.rightButton,
            mapProvider === 'maplibre' && styles.activeButton,
          ]}
          onPress={() => handleProviderChange('maplibre')}
        >
          <Text
            style={[
              styles.buttonText,
              mapProvider === 'maplibre' && styles.activeButtonText,
            ]}
          >
            MapLibre
          </Text>
        </TouchableOpacity>
      </View>
      
      {mapProvider === 'maplibre' && (
        <Text style={styles.warning}>
          ⚠️ MapLibre implementation coming soon
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
  },
  leftButton: {
    borderRightWidth: 0.5,
    borderRightColor: '#ddd',
  },
  rightButton: {
    borderLeftWidth: 0.5,
    borderLeftColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  warning: {
    fontSize: 10,
    color: '#ff9500',
    textAlign: 'center',
    marginTop: 4,
  },
});
