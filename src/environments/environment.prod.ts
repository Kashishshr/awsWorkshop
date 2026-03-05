export const environment = {
  production: true,
  apiUrl: 'https://api.power-grid-simulation.com/api',
  wsUrl: 'wss://api.power-grid-simulation.com',
  logLevel: 'error',
  cacheEnabled: true,
  cacheTTL: 600000, // 10 minutes
  retryAttempts: 5,
  retryDelay: 2000,
  weatherApiUrl: 'https://api.open-meteo.com/v1',
  weatherUpdateInterval: 600000, // 10 minutes
};
