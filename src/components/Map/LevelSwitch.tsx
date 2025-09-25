// LGA ↔ Suburb level switching component (FR-002)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMapStore } from '../../store/mapStore';
import { MapLevel } from '../../types/climate.types';

interface LevelSwitchProps {
  style?: any;
}

export const LevelSwitch: React.FC<LevelSwitchProps> = ({ style }) => {
  const { mapLevel, setMapLevel, isLoading } = useMapStore();

  const handleLevelChange = (level: MapLevel) => {
    if (level !== mapLevel && !isLoading) {
      setMapLevel(level);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Map Level</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.leftButton,
            mapLevel === 'lga' && styles.activeButton,
          ]}
          onPress={() => handleLevelChange('lga')}
          disabled={isLoading}
        >
          <Text
            style={[
              styles.buttonText,
              mapLevel === 'lga' && styles.activeButtonText,
            ]}
          >
            LGA
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.button,
            styles.rightButton,
            mapLevel === 'suburb' && styles.activeButton,
          ]}
          onPress={() => handleLevelChange('suburb')}
          disabled={isLoading}
        >
          <Text
            style={[
              styles.buttonText,
              mapLevel === 'suburb' && styles.activeButtonText,
            ]}
          >
            Suburb
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
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
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
