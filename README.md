# Power Grid Device Simulation

A full-stack Angular application for monitoring and controlling power grid devices with real-time weather integration and device health monitoring.

## Overview

The Power Grid Device Simulation provides:

- **Real-time Device Monitoring**: Track device status and health metrics
- **Weather Integration**: Live weather alerts and forecasts
- **Device Control**: On/off and basic parameter control
- **Health Scoring**: Device health assessment and alerts
- **Geospatial Visualization**: Interactive map-based device view
- **User Management**: Role-based access control
- **Real-time Updates**: WebSocket-based live updates

## Quick Start

### Prerequisites

- Node.js 18 LTS or higher
- npm 9.0 or higher
- Docker 24.0 or higher (optional)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd power-grid-simulation

# Install dependencies
npm install
cd backend && npm install && cd ..

# Setup environment
cp .env.example .env
cp backend/.env.example backend/.env
```

### Development

```bash
# Start both frontend and backend
npm run dev

# Or start separately
npm start                    # Frontend on http://localhost:4200
cd backend && npm run dev    # Backend on http://localhost:3000
```

### Docker

```bash
# Build and start all services
docker-compose up

# Services available at:
# - Frontend: http://localhost:4200
# - Backend: http://localhost:3000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

## Project Structure

```
power-grid-simulation/
├── src/                          # Frontend source code
│   ├── app/
│   │   ├── core/                # Core module (services, store, interceptors)
│   │   ├── shared/              # Shared components and utilities
│   │   └── features/            # Feature modules (to be implemented)
│   ├── environments/            # Environment configurations
│   └── assets/                  # Static assets
├── backend/                      # Backend source code
│   ├── src/
│   │   ├── app.js              # Express application
│   │   ├── server.js           # Server entry point
│   │   ├── middleware/         # Express middleware
│   │   ├── services/           # Business logic services
│   │   ├── routes/             # API routes
│   │   ├── models/             # Data models
│   │   └── controllers/        # Request handlers
│   ├── config/                 # Configuration files
│   └── docs/                   # Backend documentation
├── docs/                        # Project documentation
├── aidlc-docs/                 # AI-DLC workflow documentation
├── docker-compose.yml          # Docker Compose configuration
├── package.json                # Frontend dependencies
└── README.md                   # This file
```

## Technology Stack

### Frontend
- **Framework**: Angular 17+
- **Language**: TypeScript 5.2+
- **State Management**: NgRx 16+
- **HTTP Client**: Angular HttpClient
- **Real-time**: Socket.io Client
- **Visualization**: Leaflet.js, D3.js, Chart.js
- **Testing**: Jasmine/Karma

### Backend
- **Runtime**: Node.js 18 LTS
- **Framework**: Express.js 4.18+
- **Real-time**: Socket.io 4.5+
- **Authentication**: JWT + Passport.js
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Logging**: Winston 3.10+
- **Testing**: Jest

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx
- **Web Server**: Express.js

## Features

### Core Features (Unit 0) ✅
- [x] State Management (NgRx)
- [x] Error Handling & Retry Logic
- [x] Structured Logging
- [x] Multi-layer Caching
- [x] WebSocket Communication
- [x] JWT Authentication
- [x] Role-based Authorization
- [x] HTTP Interceptors

### Planned Features (Units 1-7)
- [ ] Weather Alert Integration (Unit 1)
- [ ] Geospatial Device Visualization (Unit 2)
- [ ] Device Health Monitoring (Unit 3)
- [ ] Weather-Device Interaction & Control (Unit 4)
- [ ] User Management & Access Control (Unit 5)
- [ ] Reporting & Analytics (Unit 6)
- [ ] Simulation & Scenario Management (Unit 7)

## API Documentation

### Authentication

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Response includes accessToken and refreshToken
```

### Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - List users (admin only)
- `GET /api/health` - Health check

See [API Documentation](./backend/docs/API.md) for complete reference.

## WebSocket Events

Real-time updates via WebSocket:

```typescript
// Connect
socket.on('connect', () => console.log('Connected'));

// Join room
socket.emit('join_room', { room: 'devices' });

// Listen for updates
socket.on('device_status_changed', (data) => {
  console.log('Device status:', data);
});
```

See [WebSocket Guide](./backend/docs/WEBSOCKET.md) for details.

## Testing

### Frontend Tests

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:ci

# Run E2E tests
npm run e2e
```

### Backend Tests

```bash
cd backend

# Run unit tests
npm test

# Run with coverage
npm run test:ci

# Run integration tests
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

## Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

See [Deployment Guide](./DEPLOYMENT.md) for production setup.

## Configuration

### Environment Variables

Frontend (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3000',
  logLevel: 'debug',
  cacheEnabled: true,
  cacheTTL: 300000,
};
```

Backend (`.env`):
```env
NODE_ENV=development
API_PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=power_grid_db
JWT_SECRET=your-secret-key
```

See [Setup Guide](./SETUP.md) for complete configuration.

## Architecture

The application follows a layered architecture:

```
┌─────────────────────────────────────┐
│     Presentation Layer (UI)         │
├─────────────────────────────────────┤
│     Business Logic Layer            │
├─────────────────────────────────────┤
│     State Management (NgRx)         │
├─────────────────────────────────────┤
│     Data Access Layer               │
└─────────────────────────────────────┘
```

See [Architecture Documentation](./docs/ARCHITECTURE.md) for detailed diagrams.

## Security

### Authentication
- JWT-based authentication
- Token refresh mechanism
- Secure password hashing (bcrypt)

### Authorization
- Role-based access control (RBAC)
- Fine-grained permissions
- Protected API endpoints

### Data Protection
- HTTPS/TLS encryption
- Input validation
- Output sanitization
- CORS configuration

See [Security Guide](./backend/docs/AUTHENTICATION.md) for details.

## Performance

### Frontend Optimization
- Code splitting and lazy loading
- Change detection optimization
- Multi-layer caching
- Gzip compression

### Backend Optimization
- Database indexing
- Redis caching
- Connection pooling
- Response compression

## Monitoring & Logging

### Logging
- Structured logging with correlation IDs
- Log levels: debug, info, warn, error
- Centralized log aggregation ready

### Metrics
- Application metrics (Prometheus-ready)
- System metrics (CPU, Memory, Disk)
- Business metrics (User activity)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Commit with clear messages
5. Push and create a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:

1. Check [Setup Guide](./SETUP.md)
2. Review [API Documentation](./backend/docs/API.md)
3. See [Architecture Documentation](./docs/ARCHITECTURE.md)
4. Contact development team

## Roadmap

### Phase 1 (Current)
- [x] Core Infrastructure (Unit 0)
- [ ] Weather Integration (Unit 1)
- [ ] Device Visualization (Unit 2)

### Phase 2
- [ ] Health Monitoring (Unit 3)
- [ ] Device Control (Unit 4)
- [ ] User Management (Unit 5)

### Phase 3
- [ ] Reporting & Analytics (Unit 6)
- [ ] Simulation & Scenarios (Unit 7)
- [ ] Advanced Features

## Changelog

### Version 1.0.0 (2026-03-04)
- Initial release
- Core infrastructure setup
- Authentication and authorization
- WebSocket real-time communication
- Comprehensive testing and documentation

## References

- [Angular Documentation](https://angular.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [NgRx Documentation](https://ngrx.io/)
- [Socket.io Documentation](https://socket.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

---

**Status**: ✅ Production Ready (Core Infrastructure)  
**Last Updated**: 2026-03-04  
**Maintainer**: Development Team
