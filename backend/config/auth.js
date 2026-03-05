require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  apiPort: parseInt(process.env.API_PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
};
