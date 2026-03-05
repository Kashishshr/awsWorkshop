# Power Grid Device Simulation - Architecture

## System Overview

The Power Grid Device Simulation is a full-stack Angular application for monitoring and controlling power grid devices with real-time weather integration and device health monitoring.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Angular 17+ Application                             │   │
│  │  ├─ Components (UI Layer)                            │   │
│  │  ├─ Services (Business Logic)                        │   │
│  │  ├─ NgRx Store (State Management)                    │   │
│  │  └─ HTTP/WebSocket (Communication)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP + WebSocket
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Nginx Reverse Proxy                         │
│  ├─ Load Balancing                                          │
│  ├─ SSL/TLS Termination                                     │
│  └─ Static File Serving                                     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────▼──────────────┐          ┌────────────▼──────────┐
│  Express.js Backend  │          │  WebSocket Server     │
│  ├─ REST API         │          │  (Socket.io)          │
│  ├─ Authentication   │          │  ├─ Real-time Events  │
│  ├─ Authorization    │          │  ├─ Room Management   │
│  ├─ Business Logic   │          │  └─ Broadcasting      │
│  └─ Error Handling   │          └───────────────────────┘
└───────┬──────────────┘
        │
    ┌───┴────────────────────────────┐
    │                                │
┌───▼──────────────┐      ┌──────────▼──────┐
│  PostgreSQL DB   │      │  Redis Cache    │
│  ├─ Users        │      │  ├─ Sessions    │
│  ├─ Devices      │      │  ├─ Cache Data  │
│  ├─ Weather      │      │  └─ Queues     │
│  └─ Health Data  │      └─────────────────┘
└──────────────────┘
```

## Frontend Architecture

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  ├─ Components                          │
│  ├─ Templates                           │
│  └─ Styles                              │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         Business Logic Layer            │
│  ├─ Services                            │
│  ├─ Guards                              │
│  └─ Interceptors                        │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         State Management Layer          │
│  ├─ NgRx Store                          │
│  ├─ Actions                             │
│  ├─ Reducers                            │
│  ├─ Selectors                           │
│  └─ Effects                             │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         Data Access Layer               │
│  ├─ HTTP Client                         │
│  ├─ WebSocket Client                    │
│  ├─ Cache Service                       │
│  └─ Local Storage                       │
└─────────────────────────────────────────┘
```

### Core Module Structure

```
src/app/core/
├── store/
│   ├── app.state.ts          # State interface
│   ├── app.actions.ts        # Actions
│   ├── app.reducer.ts        # Reducer
│   ├── app.selectors.ts      # Selectors
│   ├── app.effects.ts        # Effects
│   └── index.ts              # Barrel export
├── services/
│   ├── state-management.service.ts
│   ├── error-handling.service.ts
│   ├── logging.service.ts
│   ├── cache.service.ts
│   └── websocket.service.ts
├── interceptors/
│   ├── auth.interceptor.ts
│   ├── error.interceptor.ts
│   └── logging.interceptor.ts
├── models/
│   ├── user.model.ts
│   ├── device.model.ts
│   ├── weather.model.ts
│   ├── health.model.ts
│   ├── api-response.model.ts
│   └── error.model.ts
├── guards/
│   ├── auth.guard.ts
│   ├── permission.guard.ts
│   └── unsaved-changes.guard.ts
└── core.module.ts
```

### State Management (NgRx)

```
AppState
├── user
│   ├── authenticated: boolean
│   ├── profile: User | null
│   ├── permissions: string[]
│   ├── loading: boolean
│   └── error: string | null
├── ui
│   ├── selectedDeviceId: string | null
│   ├── viewMode: 'map' | 'list' | 'grid'
│   ├── sidebarOpen: boolean
│   ├── theme: 'light' | 'dark'
│   └── mobileMenuOpen: boolean
├── settings
│   ├── language: string
│   ├── notifications: boolean
│   ├── autoRefresh: boolean
│   └── refreshInterval: number
├── loading
│   ├── global: boolean
│   └── byKey: { [key: string]: boolean }
└── error
    ├── global: string | null
    └── byKey: { [key: string]: string }
```

## Backend Architecture

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         API Layer (Routes)              │
│  ├─ /auth                               │
│  ├─ /users                              │
│  ├─ /devices                            │
│  ├─ /weather                            │
│  └─ /health                             │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         Middleware Layer                │
│  ├─ Authentication                      │
│  ├─ Authorization                       │
│  ├─ Error Handling                      │
│  ├─ Logging                             │
│  └─ CORS                                │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         Service Layer                   │
│  ├─ Authentication Service              │
│  ├─ User Service                        │
│  ├─ Device Service                      │
│  ├─ Weather Service                     │
│  ├─ Health Service                      │
│  ├─ Cache Service                       │
│  └─ Logging Service                     │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         Data Access Layer               │
│  ├─ Database (PostgreSQL)               │
│  ├─ Cache (Redis)                       │
│  └─ External APIs                       │
└─────────────────────────────────────────┘
```

### Backend Module Structure

```
backend/src/
├── app.js                    # Express app setup
├── server.js                 # Server entry point
├── middleware/
│   ├── auth.middleware.js
│   ├── authorization.middleware.js
│   ├── error.middleware.js
│   └── logging.middleware.js
├── services/
│   ├── authentication.service.js
│   ├── error-handling.service.js
│   ├── logging.service.js
│   ├── cache.service.js
│   └── websocket.service.js
├── routes/
│   ├── auth.routes.js
│   ├── users.routes.js
│   ├── devices.routes.js
│   ├── weather.routes.js
│   └── health.routes.js
├── models/
│   ├── user.model.js
│   ├── device.model.js
│   ├── weather.model.js
│   └── health.model.js
└── controllers/
    ├── auth.controller.js
    ├── users.controller.js
    ├── devices.controller.js
    ├── weather.controller.js
    └── health.controller.js
```

## Data Flow

### Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend sends POST /auth/login
   ↓
3. Backend verifies credentials
   ↓
4. Backend generates JWT tokens
   ↓
5. Frontend stores tokens (localStorage/cookies)
   ↓
6. Frontend includes token in Authorization header
   ↓
7. Backend verifies token on each request
```

### Device Update Flow

```
1. Device status changes
   ↓
2. Backend detects change
   ↓
3. Backend broadcasts via WebSocket
   ↓
4. Frontend receives event
   ↓
5. Frontend dispatches NgRx action
   ↓
6. Store updates state
   ↓
7. Components subscribe to state changes
   ↓
8. UI updates automatically
```

### Caching Strategy

```
Frontend:
├─ Memory Cache (fast, limited size)
├─ IndexedDB (persistent, larger size)
└─ HTTP Cache (browser cache)

Backend:
├─ Redis Cache (fast, distributed)
└─ Database (persistent, authoritative)

Cache Invalidation:
├─ TTL-based expiration
├─ Event-based invalidation
└─ Manual invalidation
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────┐
│         Client Request                  │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    1. Extract JWT from Authorization    │
│       Header                            │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    2. Verify JWT Signature               │
│       (using secret key)                │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    3. Check Token Expiration             │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    4. Extract User Claims                │
│       (id, role, permissions)           │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    5. Check User Role                    │
│       (RBAC)                            │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    6. Check User Permissions             │
│       (Fine-grained access control)     │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    7. Allow/Deny Request                 │
└─────────────────────────────────────────┘
```

### Security Layers

1. **Transport Security**: HTTPS/TLS
2. **Authentication**: JWT tokens
3. **Authorization**: RBAC + Permissions
4. **Input Validation**: Schema validation
5. **Output Encoding**: Sanitization
6. **Logging & Monitoring**: Audit trail

## Deployment Architecture

### Docker Compose Setup

```
┌─────────────────────────────────────────┐
│         Docker Network                  │
│  ┌─────────────────────────────────┐   │
│  │  Frontend Container             │   │
│  │  (Angular + Nginx)              │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Backend Container              │   │
│  │  (Node.js + Express)            │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  PostgreSQL Container           │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Redis Container                │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Nginx Reverse Proxy            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Performance Considerations

### Frontend Optimization

- **Code Splitting**: Lazy loading modules
- **Change Detection**: OnPush strategy
- **Caching**: Multi-layer caching
- **Compression**: Gzip compression
- **Bundling**: Webpack optimization

### Backend Optimization

- **Database Indexing**: Query optimization
- **Caching**: Redis caching
- **Connection Pooling**: Database connections
- **Compression**: Response compression
- **Rate Limiting**: Prevent abuse

## Scalability

### Horizontal Scaling

- **Load Balancing**: Nginx/HAProxy
- **Stateless Services**: No session affinity
- **Distributed Cache**: Redis cluster
- **Database Replication**: Master-slave setup

### Vertical Scaling

- **Resource Allocation**: CPU/Memory
- **Database Optimization**: Indexing
- **Query Optimization**: Efficient queries
- **Connection Pooling**: Reuse connections

## Monitoring & Observability

### Logging

- **Application Logs**: Winston (backend), Console (frontend)
- **Access Logs**: Nginx access logs
- **Error Logs**: Centralized error tracking

### Metrics

- **Application Metrics**: Prometheus
- **System Metrics**: CPU, Memory, Disk
- **Business Metrics**: User activity, transactions

### Tracing

- **Distributed Tracing**: Jaeger
- **Correlation IDs**: Request tracking
- **Performance Monitoring**: Response times

## References

- [Angular Architecture](https://angular.io/guide/architecture)
- [NgRx Documentation](https://ngrx.io/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Microservices Architecture](https://microservices.io/)
