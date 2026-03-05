# Build Verification Guide

## Overview

This document provides step-by-step instructions for verifying the build process and ensuring all components are working correctly.

## Prerequisites

- Node.js 18 LTS or higher
- npm 9.0 or higher
- Docker 24.0 or higher (for Docker verification)
- PostgreSQL 14+ (for database verification)
- Redis 7+ (for cache verification)

## Build Verification Steps

### Step 1: Verify Dependencies

#### Frontend Dependencies

```bash
npm list
```

Expected output should show:
- angular@17.x.x
- @ngrx/store@16.x.x
- typescript@5.x.x
- rxjs@7.x.x

#### Backend Dependencies

```bash
cd backend
npm list
```

Expected output should show:
- express@4.18.x
- socket.io@4.5.x
- jsonwebtoken@9.x.x
- winston@3.10.x

### Step 2: Verify TypeScript Compilation

#### Frontend

```bash
npx tsc --noEmit
```

Expected: No errors

#### Backend (if using TypeScript)

```bash
cd backend
npx tsc --noEmit
```

Expected: No errors

### Step 3: Verify Linting

#### Frontend

```bash
npm run lint
```

Expected: No errors (warnings acceptable)

#### Backend

```bash
cd backend
npm run lint
```

Expected: No errors (warnings acceptable)

### Step 4: Verify Unit Tests

#### Frontend

```bash
npm run test:ci
```

Expected output:
- All tests pass
- Coverage >= 80%
- No failed tests

#### Backend

```bash
cd backend
npm run test:ci
```

Expected output:
- All tests pass
- Coverage >= 80%
- No failed tests

### Step 5: Verify Production Build

#### Frontend Build

```bash
npm run build:prod
```

Expected output:
- Build completes successfully
- Output in `dist/power-grid-simulation/`
- No build errors
- Bundle size reasonable (~500KB gzipped)

Verify build artifacts:

```bash
ls -lh dist/power-grid-simulation/
```

Should contain:
- `index.html`
- `main.*.js`
- `polyfills.*.js`
- `styles.*.css`
- `assets/` directory

#### Backend Build (if applicable)

```bash
cd backend
npm run build
```

Expected: Build completes successfully

### Step 6: Verify Configuration Files

#### Check Environment Files

```bash
# Frontend
cat src/environments/environment.ts
cat src/environments/environment.prod.ts

# Backend
cat backend/config/database.js
cat backend/config/redis.js
cat backend/config/logger.js
cat backend/config/auth.js
```

Expected: All configuration files present and valid

#### Check Build Configuration

```bash
# Angular
cat angular.json

# TypeScript
cat tsconfig.json
cat tsconfig.app.json
cat tsconfig.spec.json

# ESLint
cat .eslintrc.json
cat backend/.eslintrc.json

# Prettier
cat .prettierrc
```

Expected: All configuration files present and valid

### Step 7: Verify Docker Configuration

#### Check Docker Files

```bash
# Frontend
cat Dockerfile

# Backend
cat backend/Dockerfile

# Compose
cat docker-compose.yml

# Ignore files
cat .dockerignore
cat backend/.dockerignore
```

Expected: All Docker files present and valid

#### Build Docker Images

```bash
docker-compose build
```

Expected:
- Frontend image builds successfully
- Backend image builds successfully
- PostgreSQL image pulls successfully
- Redis image pulls successfully

#### Start Docker Services

```bash
docker-compose up -d
```

Expected:
- All services start successfully
- No errors in logs

#### Verify Services

```bash
# Check running containers
docker-compose ps

# Check frontend
curl http://localhost:4200

# Check backend health
curl http://localhost:3000/api/health

# Check database
docker-compose exec postgres psql -U postgres -d power_grid_db -c "SELECT 1"

# Check Redis
docker-compose exec redis redis-cli ping
```

Expected:
- All containers running
- Frontend responds with HTML
- Backend health check returns 200
- Database connection successful
- Redis responds with PONG

#### Stop Docker Services

```bash
docker-compose down
```

### Step 8: Verify Development Server

#### Start Frontend Dev Server

```bash
npm start
```

Expected:
- Server starts on http://localhost:4200
- No compilation errors
- Browser opens automatically

#### Start Backend Dev Server

```bash
cd backend
npm run dev
```

Expected:
- Server starts on http://localhost:3000
- No errors in console
- Health check endpoint responds

#### Test API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Expected response:
# {
#   "success": true,
#   "data": {
#     "status": "ok",
#     "timestamp": "...",
#     "uptime": ...,
#     "environment": "development"
#   }
# }
```

### Step 9: Verify Code Quality

#### Check Code Coverage

```bash
# Frontend
npm run test:ci
cat coverage/power-grid-simulation/index.html

# Backend
cd backend
npm run test:ci
cat coverage/index.html
```

Expected:
- Overall coverage >= 80%
- Statements >= 80%
- Branches >= 80%
- Functions >= 80%
- Lines >= 80%

#### Check Bundle Size

```bash
npm run build:prod
ls -lh dist/power-grid-simulation/main.*.js
```

Expected:
- Main bundle < 500KB (gzipped)
- Reasonable size for production

### Step 10: Verify Documentation

#### Check Documentation Files

```bash
# API Documentation
cat backend/docs/API.md
cat backend/docs/AUTHENTICATION.md
cat backend/docs/WEBSOCKET.md

# Architecture
cat docs/ARCHITECTURE.md

# Setup
cat SETUP.md

# README
cat README.md
```

Expected: All documentation files present and complete

#### Verify Documentation Links

- [ ] API.md references AUTHENTICATION.md
- [ ] AUTHENTICATION.md references API.md
- [ ] WEBSOCKET.md references API.md
- [ ] ARCHITECTURE.md references all components
- [ ] SETUP.md references all guides
- [ ] README.md references all documentation

## Verification Checklist

### Build Verification
- [ ] Dependencies installed successfully
- [ ] TypeScript compilation successful
- [ ] Linting passes
- [ ] Unit tests pass (80%+ coverage)
- [ ] Production build successful
- [ ] Bundle size acceptable

### Configuration Verification
- [ ] Environment files present
- [ ] Build configuration valid
- [ ] Docker configuration valid
- [ ] All config files present

### Docker Verification
- [ ] Docker images build successfully
- [ ] Docker services start successfully
- [ ] All containers running
- [ ] Health checks pass
- [ ] Database connection works
- [ ] Redis connection works

### Development Verification
- [ ] Frontend dev server starts
- [ ] Backend dev server starts
- [ ] API endpoints respond
- [ ] No console errors

### Quality Verification
- [ ] Code coverage >= 80%
- [ ] Bundle size acceptable
- [ ] No linting errors
- [ ] All tests pass

### Documentation Verification
- [ ] All documentation files present
- [ ] Documentation is complete
- [ ] Links are correct
- [ ] Examples are accurate

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build:prod
```

### Tests Fail

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- --include='**/service.spec.ts'
```

### Docker Issues

```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache

# Start fresh
docker-compose up
```

### Port Already in Use

```bash
# Find process using port
lsof -i :4200
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Performance Verification

### Frontend Performance

```bash
# Build and analyze bundle
npm run build:prod
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/power-grid-simulation/stats.json
```

### Backend Performance

```bash
# Monitor memory usage
node --max-old-space-size=4096 src/server.js

# Monitor with profiling
node --prof src/server.js
node --prof-process isolate-*.log > profile.txt
```

## Security Verification

### Check Dependencies for Vulnerabilities

```bash
# Frontend
npm audit

# Backend
cd backend
npm audit
```

### Verify Security Headers

```bash
# Check Helmet configuration
curl -I http://localhost:3000/api/health
```

Expected headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### Verify CORS Configuration

```bash
# Check CORS headers
curl -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:3000/api/health -v
```

Expected:
- `Access-Control-Allow-Origin: http://localhost:4200`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS`

## Final Verification

Run complete verification:

```bash
#!/bin/bash

echo "=== Build Verification ==="
npm run lint && echo "✓ Linting passed"
npm run test:ci && echo "✓ Tests passed"
npm run build:prod && echo "✓ Build successful"

echo ""
echo "=== Backend Verification ==="
cd backend
npm run lint && echo "✓ Backend linting passed"
npm run test:ci && echo "✓ Backend tests passed"

echo ""
echo "=== All Verifications Complete ==="
```

## Sign-Off

- [ ] All build steps completed successfully
- [ ] All tests pass with 80%+ coverage
- [ ] Production build successful
- [ ] Docker setup verified
- [ ] Documentation complete
- [ ] Security checks passed
- [ ] Performance acceptable

**Verified By**: _______________  
**Date**: _______________  
**Status**: ✅ READY FOR DEPLOYMENT

---

## References

- [Angular Build Guide](https://angular.io/guide/build)
- [Express.js Testing](https://expressjs.com/en/guide/testing.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Karma Documentation](https://karma-runner.github.io/)
