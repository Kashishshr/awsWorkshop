// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3000',
  logLevel: 'debug',
  cacheEnabled: true,
  cacheTTL: 300000, // 5 minutes
  retryAttempts: 3,
  retryDelay: 1000,
  weatherApiUrl: 'https://api.open-meteo.com/v1',
  weatherUpdateInterval: 300000, // 5 minutes
};
