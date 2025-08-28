/**
 * CLIS Mobile App
 * React Native Application
 *
 * @format
 */

import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import MapScreen from './src/screens/MapScreen';

// Color palette
const Colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    accent: '#007AFF',
  },
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    accent: '#0A84FF',
  },
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const [showMap, setShowMap] = React.useState(false);

  const openMap = () => {
    setShowMap(true);
  };

  const closeMap = () => {
    setShowMap(false);
  };

  if (showMap) {
    return <MapScreen navigation={{ goBack: closeMap }} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{backgroundColor: theme.background}}>
        
        {/* Header */}
        <View style={[styles.header, {backgroundColor: theme.accent}]}>
          <Text style={styles.headerText}>CLIS App</Text>
        </View>

        <View style={[styles.content, {backgroundColor: theme.background}]}>
          {/* Welcome Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>
              Welcome to CLIS App
            </Text>
            <Text style={[styles.sectionDescription, {color: theme.textSecondary}]}>
              Visualize Queensland air quality data with PM2.5 concentration levels on an interactive map.
            </Text>
          </View>

          {/* Map Button Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>
              Queensland Air Quality Map
            </Text>
            <Text style={[styles.sectionDescription, {color: theme.textSecondary}]}>
              Explore real-time PM2.5 air quality data across Queensland regions with interactive visualization.
            </Text>
            <TouchableOpacity
              style={[styles.mapButton, {backgroundColor: theme.accent}]}
              onPress={openMap}
            >
              <Text style={styles.mapButtonText}>Open Air Quality Map</Text>
            </TouchableOpacity>
          </View>

          {/* Development Guide */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>
              Development Guide
            </Text>
            <Text style={[styles.sectionDescription, {color: theme.textSecondary}]}>
              Press{' '}
              <Text style={[styles.highlight, styles.bold, {color: theme.accent}]}>
                Cmd + M
              </Text>{' '}
              (macOS) or{' '}
              <Text style={[styles.highlight, styles.bold, {color: theme.accent}]}>
                Ctrl + M
              </Text>{' '}
              (Windows/Linux) to open the developer menu.
            </Text>
          </View>

          {/* Features Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>
              App Features
            </Text>
            <View style={styles.featureList}>
              <Text style={[styles.featureItem, {color: theme.textSecondary}]}>
                • Interactive Queensland air quality visualization
              </Text>
              <Text style={[styles.featureItem, {color: theme.textSecondary}]}>
                • Real-time PM2.5 concentration data
              </Text>
              <Text style={[styles.featureItem, {color: theme.textSecondary}]}>
                • WHO Air Quality Guidelines compliance
              </Text>
              <Text style={[styles.featureItem, {color: theme.textSecondary}]}>
                • Cross-platform support (iOS & Android)
              </Text>
              <Text style={[styles.featureItem, {color: theme.textSecondary}]}>
                • Dark/Light theme toggle
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  highlight: {
    fontWeight: '700',
  },
  bold: {
    fontWeight: '700',
  },
  featureList: {
    marginTop: 12,
  },
  featureItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  mapButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
