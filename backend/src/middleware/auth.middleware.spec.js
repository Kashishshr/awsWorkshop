const { verifyToken, optionalVerifyToken } = require('./auth.middleware');
const authService = require('../services/authentication.service');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      correlationId: 'test-correlation-id',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const user = { id: '123', email: 'test@example.com', role: 'operator' };
      const token = authService.generateToken(user);
      req.headers.authorization = `Bearer ${token}`;

      verifyToken(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.sub).toBe(user.id);
      expect(next).toHaveBeenCalled();
    });

    it('should reject missing token', () => {
      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid token', () => {
      req.headers.authorization = 'Bearer invalid-token';

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle malformed authorization header', () => {
      req.headers.authorization = 'InvalidFormat token';

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('optionalVerifyToken', () => {
    it('should verify token if present', () => {
      const user = { id: '123', email: 'test@example.com', role: 'operator' };
      const token = authService.generateToken(user);
      req.headers.authorization = `Bearer ${token}`;

      optionalVerifyToken(req, res, next);

      expect(req.user).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    it('should continue without token', () => {
      optionalVerifyToken(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    it('should continue with invalid token', () => {
      req.headers.authorization = 'Bearer invalid-token';

      optionalVerifyToken(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });
  });
});
