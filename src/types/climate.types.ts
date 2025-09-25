// Climate data types for CLISApp
export type ClimateLayer = 'pm25' | 'precipitation' | 'uv' | 'humidity' | 'temperature';

export type MapLevel = 'lga' | 'suburb';

export interface ClimateDataConfig {
  name: string;
  colorScale: string[];
  unit: string;
  thresholds: number[];
  description: string;
}

export interface ClimateDataPoint {
  latitude: number;
  longitude: number;
  value: number;
  timestamp: string;
  layer: ClimateLayer;
}

export interface RegionData {
  id: string;
  name: string;
  level: MapLevel;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  bounds: {
    northeast: { latitude: number; longitude: number };
    southwest: { latitude: number; longitude: number };
  };
  climateData?: Record<ClimateLayer, number>;
}
