# Power Grid Device Simulation - Setup Guide

## Prerequisites

- Node.js 18 LTS or higher
- npm 9.0 or higher
- Docker 24.0 or higher (for containerized setup)
- PostgreSQL 14+ or MongoDB 6.0+ (for database)
- Git (for version control)

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd power-grid-simulation
```

### 2. Install Dependencies

#### Frontend

```bash
npm install
```

#### Backend

```bash
cd backend
npm install
cd ..
```

### 3. Setup Environment Variables

#### Root Level

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
FRONTEND_PORT=4200
API_PORT=3000
API_URL=http://localhost:3000/api

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=power_grid_db
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=24h

# CORS
CORS_ORIGIN=http://localhost:4200

# Logging
LOG_LEVEL=debug
```

#### Backend

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your configuration.

### 4. Setup Database

#### Using Docker Compose (Recommended)

```bash
docker-compose up -d postgres redis
```

#### Manual Setup

**PostgreSQL:**

```bash
# Create database
createdb power_grid_db

# Create user
createuser -P postgres
```

**Redis:**

```bash
# Start Redis
redis-server
```

## Development

### Start Frontend

```bash
npm start
```

Frontend will be available at `http://localhost:4200`

### Start Backend

```bash
cd backend
npm run dev
```

Backend will be available at `http://localhost:3000`

### Start Both (Concurrently)

```bash
npm run dev
```

## Docker Setup

### Build Images

```bash
docker-compose build
```

### Start Services

```bash
docker-compose up
```

Services will be available at:
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Testing

### Frontend Unit Tests

```bash
npm test
```

### Frontend E2E Tests

```bash
npm run e2e
```

### Backend Unit Tests

```bash
cd backend
npm test
```

### Backend Integration Tests

```bash
cd backend
npm run test:integration
```

## Building

### Frontend Production Build

```bash
npm run build:prod
```

Output: `dist/power-grid-simulation/`

### Backend Production Build

```bash
cd backend
npm run build
```

## Linting & Formatting

### Frontend

```bash
# Lint
npm run lint

# Format
npm run format
```

### Backend

```bash
cd backend

# Lint
npm run lint

# Format
npm run format
```

## Troubleshooting

### Port Already in Use

If port 4200 or 3000 is already in use:

```bash
# Find process using port
lsof -i :4200
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U postgres -d power_grid_db

# Check Redis is running
redis-cli ping
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

```bash
# Remove all containers
docker-compose down -v

# Rebuild
docker-compose build --no-cache

# Start fresh
docker-compose up
```

## Configuration

### Environment Variables

See `.env.example` for all available configuration options.

### Logging

Configure logging level in `.env`:

```env
LOG_LEVEL=debug    # debug, info, warn, error
```

### Database

Configure database connection in `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=power_grid_db
DB_USER=postgres
DB_PASSWORD=postgres
```

### JWT

Configure JWT settings in `.env`:

```env
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d
```

## Security

### Change Default Secrets

Before deploying to production:

1. Change `JWT_SECRET` in `.env`
2. Change database password
3. Change Redis password (if applicable)
4. Enable HTTPS/TLS
5. Configure CORS properly

### HTTPS Setup

For production, use HTTPS:

```bash
# Generate self-signed certificate (development only)
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

## Performance Tuning

### Frontend

- Enable production mode: `npm run build:prod`
- Use service workers for offline support
- Implement lazy loading for routes
- Optimize bundle size

### Backend

- Enable caching: Configure Redis
- Use database indexes
- Implement rate limiting
- Use connection pooling

## Monitoring

### Logs

View application logs:

```bash
# Frontend (browser console)
# Backend
tail -f logs/combined.log
```

### Health Check

```bash
curl http://localhost:3000/api/health
```

## Next Steps

1. Review [Architecture Documentation](./docs/ARCHITECTURE.md)
2. Read [API Documentation](./backend/docs/API.md)
3. Check [Authentication Guide](./backend/docs/AUTHENTICATION.md)
4. Explore [WebSocket Guide](./backend/docs/WEBSOCKET.md)

## Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review documentation files
3. Check application logs
4. Contact development team

## References

- [Angular Documentation](https://angular.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Docker Documentation](https://docs.docker.com/)
