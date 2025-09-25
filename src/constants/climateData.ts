// Climate data layer configurations
import { ClimateDataConfig, ClimateLayer } from '../types/climate.types';

export const CLIMATE_LAYERS: Record<ClimateLayer, ClimateDataConfig> = {
  pm25: {
    name: 'PM2.5 Concentration',
    colorScale: ['#00ff00', '#ffff00', '#ff6600', '#ff0000', '#800080'],
    unit: 'µg/m³',
    thresholds: [0, 12, 35, 55, 150],
    description: 'Particulate matter smaller than 2.5 micrometers',
  },
  precipitation: {
    name: 'Precipitation',
    colorScale: ['#ffffff', '#87ceeb', '#4169e1', '#0000ff', '#00008b'],
    unit: 'mm/hour',
    thresholds: [0, 0.5, 2, 10, 50],
    description: 'Hourly precipitation rate',
  },
  uv: {
    name: 'UV Index',
    colorScale: ['#289500', '#f7e400', '#f85900', '#d8001d', '#6b49c8'],
    unit: 'UVI',
    thresholds: [0, 3, 6, 8, 11],
    description: 'Ultraviolet radiation index',
  },
  humidity: {
    name: 'Relative Humidity',
    colorScale: ['#8B4513', '#DAA520', '#FFD700', '#87CEEB', '#4169E1'],
    unit: '%',
    thresholds: [0, 30, 50, 70, 90],
    description: 'Relative humidity percentage',
  },
  temperature: {
    name: '2m Temperature',
    colorScale: ['#0000ff', '#87ceeb', '#ffff00', '#ff6600', '#ff0000'],
    unit: '°C',
    thresholds: [0, 10, 20, 30, 40],
    description: 'Air temperature at 2 meters above ground',
  },
};

export const DEFAULT_LAYER: ClimateLayer = 'pm25';
