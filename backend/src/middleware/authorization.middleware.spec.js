const { requireRole, requirePermission } = require('./authorization.middleware');

describe('Authorization Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {
        sub: '123',
        email: 'test@example.com',
        role: 'operator',
        permissions: ['read', 'write'],
      },
      correlationId: 'test-correlation-id',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('requireRole', () => {
    it('should allow user with required role', () => {
      const middleware = requireRole(['operator']);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject user without required role', () => {
      const middleware = requireRole(['admin']);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow user with one of multiple roles', () => {
      const middleware = requireRole(['admin', 'operator']);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject unauthenticated user', () => {
      req.user = undefined;
      const middleware = requireRole(['operator']);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('requirePermission', () => {
    it('should allow user with required permission', () => {
      const middleware = requirePermission(['read']);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow user with all required permissions', () => {
      const middleware = requirePermission(['read', 'write']);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject user without required permission', () => {
      const middleware = requirePermission(['delete']);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalled();
    });

    it('should reject user missing one of multiple permissions', () => {
      const middleware = requirePermission(['read', 'delete']);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should reject unauthenticated user', () => {
      req.user = undefined;
      const middleware = requirePermission(['read']);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should handle user without permissions array', () => {
      req.user.permissions = undefined;
      const middleware = requirePermission(['read']);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
