/**
 * Map Provider Switch Component
 * Allows switching between different map providers
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSettingsStore } from '../../store/settingsStore';

interface MapProviderSwitchProps {
  style?: any;
}

export const MapProviderSwitch: React.FC<MapProviderSwitchProps> = ({ style }) => {
  const { baseTileProvider, setBaseTileProvider } = useSettingsStore();

  const providers = [
    { id: 'openstreetmap', name: 'OSM', description: 'Free & Open' },
    { id: 'google', name: 'Google', description: 'Satellite & Street' },
    { id: 'satellite', name: 'Satellite', description: 'Aerial View' },
  ] as const;

  const handleProviderChange = (provider: typeof providers[number]['id']) => {
    setBaseTileProvider(provider);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Map Style</Text>
      <View style={styles.buttonContainer}>
        {providers.map((provider) => (
          <TouchableOpacity
            key={provider.id}
            style={[
              styles.button,
              baseTileProvider === provider.id && styles.activeButton,
            ]}
            onPress={() => handleProviderChange(provider.id)}
          >
            <Text
              style={[
                styles.buttonText,
                baseTileProvider === provider.id && styles.activeButtonText,
              ]}
            >
              {provider.name}
            </Text>
            <Text
              style={[
                styles.descriptionText,
                baseTileProvider === provider.id && styles.activeDescriptionText,
              ]}
            >
              {provider.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    paddingHorizontal: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 9,
    color: '#888',
    textAlign: 'center',
    marginTop: 2,
  },
  activeDescriptionText: {
    color: '#ccc',
  },
});