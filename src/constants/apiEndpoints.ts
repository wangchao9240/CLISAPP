// API endpoints and environment configuration
const isDevelopment = __DEV__;

export const API_CONFIG = {
  // Backend base URL
  BASE_URL: isDevelopment 
    ? 'http://localhost:8080'
    : 'https://clisapp-api.qut.edu.au',
    
  // Tile server configuration (using backend API)
  TILE_SERVER_URL: isDevelopment 
    ? 'http://localhost:8080/api/v1/tiles'
    : 'https://clisapp-api.qut.edu.au/api/v1/tiles',
    
  // API timeouts
  TIMEOUT: isDevelopment ? 10000 : 15000,
  
  // Cache configuration  
  CACHE_ENABLED: true,
  MAX_CACHE_SIZE: isDevelopment ? 100 : 50, // MB
  
  // Logging
  LOG_LEVEL: isDevelopment ? 'debug' : 'error',
} as const;

// Google Maps API key (configured in native platforms)
// iOS: ios/CLISApp/Info.plist -> GMSApiKey
// Android: android/app/src/main/AndroidManifest.xml -> com.google.android.geo.API_KEY
export const GOOGLE_MAPS_API_KEY = 'configured_in_native_platforms';

// Backend API endpoints (now connected to real backend)
export const API_ENDPOINTS = {
  // Health check
  HEALTH: '/api/v1/health',
  HEALTH_DETAILED: '/api/v1/health/detailed',
  
  // Tile endpoints
  TILES: '/api/v1/tiles',
  TILE_STATUS: '/api/v1/tiles/status',
  
  // Region endpoints
  REGIONS_SEARCH: '/api/v1/regions/search',
  REGIONS_INFO: '/api/v1/regions',
  REGIONS_CLIMATE: '/api/v1/regions/climate',
  REGIONS_NEARBY: '/api/v1/regions/nearby',
  REGIONS_BOUNDS: '/api/v1/regions/bounds',
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
