/**
 * Air Quality Utilities
 * Helper functions for processing and visualizing PM2.5 air quality data
 */

export interface AirQualityLevel {
  range: string;
  color: string;
  status: string;
  description: string;
  healthImplications: string;
}

export interface PM25Statistics {
  min: number;
  max: number;
  average: number;
  count: number;
  distribution: Record<string, number>;
}

// WHO Air Quality Guidelines for PM2.5 (µg/m³)
export const AIR_QUALITY_LEVELS: AirQualityLevel[] = [
  {
    range: '0-12',
    color: '#00E400',
    status: 'Good',
    description: 'Air quality is considered satisfactory',
    healthImplications: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
  },
  {
    range: '13-35',
    color: '#FFFF00',
    status: 'Moderate',
    description: 'Air quality is acceptable for most people',
    healthImplications: 'Air quality is acceptable for most people. However, sensitive people may experience minor issues.',
  },
  {
    range: '36-55',
    color: '#FF7E00',
    status: 'Unhealthy for Sensitive Groups',
    description: 'Members of sensitive groups may experience health effects',
    healthImplications: 'Active children and adults, and people with respiratory disease should limit prolonged outdoor exertion.',
  },
  {
    range: '56-150',
    color: '#FF0000',
    status: 'Unhealthy',
    description: 'Everyone may begin to experience health effects',
    healthImplications: 'Active children and adults, and people with respiratory disease should avoid prolonged outdoor exertion.',
  },
  {
    range: '151-250',
    color: '#8F3F97',
    status: 'Very Unhealthy',
    description: 'Health warnings of emergency conditions',
    healthImplications: 'Active children and adults, and people with respiratory disease should avoid all outdoor exertion.',
  },
  {
    range: '250+',
    color: '#7E0023',
    status: 'Hazardous',
    description: 'Health alert: everyone may experience serious health effects',
    healthImplications: 'Everyone should avoid all outdoor exertion.',
  },
];

/**
 * Get the color for a PM2.5 value based on WHO Air Quality Guidelines
 */
export const getPM25Color = (pm25Value: number): string => {
  if (pm25Value <= 12) return '#00E400';
  if (pm25Value <= 35) return '#FFFF00';
  if (pm25Value <= 55) return '#FF7E00';
  if (pm25Value <= 150) return '#FF0000';
  if (pm25Value <= 250) return '#8F3F97';
  return '#7E0023';
};

/**
 * Get the status text for a PM2.5 value
 */
export const getPM25Status = (pm25Value: number): string => {
  if (pm25Value <= 12) return 'Good';
  if (pm25Value <= 35) return 'Moderate';
  if (pm25Value <= 55) return 'Unhealthy for Sensitive Groups';
  if (pm25Value <= 150) return 'Unhealthy';
  if (pm25Value <= 250) return 'Very Unhealthy';
  return 'Hazardous';
};

/**
 * Get the air quality level object for a PM2.5 value
 */
export const getAirQualityLevel = (pm25Value: number): AirQualityLevel => {
  return AIR_QUALITY_LEVELS.find(level => {
    const [min, max] = level.range.split('-').map(v => v.replace('+', ''));
    const minVal = parseInt(min);
    const maxVal = max ? parseInt(max) : Infinity;
    return pm25Value >= minVal && pm25Value <= maxVal;
  }) || AIR_QUALITY_LEVELS[AIR_QUALITY_LEVELS.length - 1];
};

/**
 * Calculate statistics for PM2.5 data
 */
export const calculatePM25Statistics = (pm25Values: number[]): PM25Statistics => {
  if (pm25Values.length === 0) {
    return {
      min: 0,
      max: 0,
      average: 0,
      count: 0,
      distribution: {},
    };
  }

  const min = Math.min(...pm25Values);
  const max = Math.max(...pm25Values);
  const average = pm25Values.reduce((sum, val) => sum + val, 0) / pm25Values.length;
  
  // Calculate distribution by air quality status
  const distribution: Record<string, number> = {};
  pm25Values.forEach(value => {
    const status = getPM25Status(value);
    distribution[status] = (distribution[status] || 0) + 1;
  });

  return {
    min,
    max,
    average: Math.round(average * 100) / 100,
    count: pm25Values.length,
    distribution,
  };
};

/**
 * Get opacity for a PM2.5 value (for map visualization)
 */
export const getPM25Opacity = (pm25Value: number): number => {
  // Higher values get higher opacity for better visibility of problem areas
  if (pm25Value <= 12) return 0.6;
  if (pm25Value <= 35) return 0.7;
  if (pm25Value <= 55) return 0.8;
  if (pm25Value <= 150) return 0.85;
  if (pm25Value <= 250) return 0.9;
  return 0.95;
};

/**
 * Extract PM2.5 values from GeoJSON features
 */
export const extractPM25Values = (geojsonFeatures: any[]): number[] => {
  return geojsonFeatures
    .map(feature => feature.properties?.pm25)
    .filter(value => typeof value === 'number' && !isNaN(value));
};

/**
 * Get health recommendations based on PM2.5 level
 */
export const getHealthRecommendations = (pm25Value: number): string[] => {
  const level = getAirQualityLevel(pm25Value);
  const recommendations: string[] = [];

  switch (level.status) {
    case 'Good':
      recommendations.push('Great day for outdoor activities!');
      recommendations.push('Windows can be opened for fresh air');
      break;
    case 'Moderate':
      recommendations.push('Generally good for outdoor activities');
      recommendations.push('Sensitive individuals should monitor symptoms');
      break;
    case 'Unhealthy for Sensitive Groups':
      recommendations.push('Sensitive groups should limit outdoor exposure');
      recommendations.push('Consider indoor activities if you have respiratory issues');
      break;
    case 'Unhealthy':
      recommendations.push('Limit outdoor activities');
      recommendations.push('Keep windows closed');
      recommendations.push('Use air purifiers if available');
      break;
    case 'Very Unhealthy':
      recommendations.push('Avoid outdoor activities');
      recommendations.push('Stay indoors with windows closed');
      recommendations.push('Use air purifiers');
      recommendations.push('Wear N95 masks if you must go outside');
      break;
    case 'Hazardous':
      recommendations.push('Stay indoors at all times');
      recommendations.push('Seal windows and doors');
      recommendations.push('Use air purifiers on highest setting');
      recommendations.push('Avoid all physical activity');
      break;
  }

  return recommendations;
};

/**
 * Format PM2.5 value for display
 */
export const formatPM25Value = (value: number): string => {
  return `${Math.round(value * 10) / 10} μg/m³`;
};

/**
 * Get coordinates center from complex geometry
 */
export const getGeometryCenter = (coordinates: any[]): [number, number] => {
  let totalLng = 0;
  let totalLat = 0;
  let count = 0;

  const flatten = (coords: any[]): void => {
    coords.forEach(coord => {
      if (Array.isArray(coord[0])) {
        flatten(coord);
      } else {
        totalLng += coord[0];
        totalLat += coord[1];
        count++;
      }
    });
  };

  flatten(coordinates);
  
  return count > 0 ? [totalLng / count, totalLat / count] : [153.0251, -27.4698];
};
