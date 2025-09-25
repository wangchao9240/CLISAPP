// API endpoints and environment configuration
const isDevelopment = __DEV__;

export const API_CONFIG = {
  // Tile server configuration
  TILE_SERVER_URL: isDevelopment 
    ? 'http://localhost:8080/tiles'
    : 'https://clisapp-tiles.qut.edu.au',
    
  // API timeouts
  TIMEOUT: isDevelopment ? 10000 : 15000,
  
  // Cache configuration  
  CACHE_ENABLED: true,
  MAX_CACHE_SIZE: isDevelopment ? 100 : 50, // MB
  
  // Logging
  LOG_LEVEL: isDevelopment ? 'debug' : 'error',
} as const;

// Google Maps API key (should be set in native configuration)
export const GOOGLE_MAPS_API_KEY = 'your_google_maps_api_key_here';

// Backend API endpoints (for future use)
export const API_ENDPOINTS = {
  SEARCH: '/api/search',
  REGION_INFO: '/api/regions',
  CLIMATE_DATA: '/api/climate',
} as const;
