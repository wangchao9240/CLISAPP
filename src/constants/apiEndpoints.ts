// API endpoints and environment configuration
const isDevelopment = __DEV__;

export const API_CONFIG = {
  // Backend base URL
  BASE_URL: isDevelopment 
    ? 'http://localhost:8000'
    : 'https://clisapp-api.qut.edu.au',
    
  // Tile server configuration (using Phase 0 tile server)
  TILE_SERVER_URL: isDevelopment 
    ? 'http://localhost:8000/tiles'
    : 'https://clisapp-api.qut.edu.au/api/v1/tiles',
    
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

// Backend API endpoints (Phase 0 tile server)
export const API_ENDPOINTS = {
  // Health check (Phase 0 format)
  HEALTH: '/health',
  HEALTH_DETAILED: '/health', // Phase 0 only has basic health
  
  // Tile endpoints (Phase 0 format)
  TILES: '/tiles',
  TILE_STATUS: '/tiles/pm25/info', // Phase 0 tile info endpoint
  
  // Region endpoints (not available in Phase 0, for future use)
  REGIONS_SEARCH: '/api/v1/regions/search',
  REGIONS_INFO: '/api/v1/regions',
  REGIONS_CLIMATE: '/api/v1/regions/climate',
  REGIONS_NEARBY: '/api/v1/regions/nearby',
  REGIONS_BOUNDS: '/api/v1/regions/bounds',
  REGIONS_BY_COORDINATES: '/api/v1/regions/by-coordinates',
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
