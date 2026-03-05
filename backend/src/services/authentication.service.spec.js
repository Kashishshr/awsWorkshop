const authService = require('./authentication.service');
const authConfig = require('../../config/auth');

describe('AuthenticationService', () => {
  describe('generateToken', () => {
    it('should generate JWT token', () => {
      const user = {
        id: '123',
        email: 'test@example.com',
        role: 'operator',
        permissions: ['read', 'write'],
      };

      const token = authService.generateToken(user);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should include user data in token', () => {
      const user = {
        id: '123',
        email: 'test@example.com',
        role: 'operator',
        permissions: ['read'],
      };

      const token = authService.generateToken(user);
      const decoded = authService.decodeToken(token);

      expect(decoded.sub).toBe(user.id);
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe(user.role);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token', () => {
      const user = { id: '123', email: 'test@example.com' };
      const token = authService.generateRefreshToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const user = { id: '123', email: 'test@example.com', role: 'operator' };
      const token = authService.generateToken(user);
      const verified = authService.verifyToken(token);

      expect(verified).toBeDefined();
      expect(verified.sub).toBe(user.id);
    });

    it('should return null for invalid token', () => {
      const verified = authService.verifyToken('invalid-token');
      expect(verified).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('should hash password', async () => {
      const password = 'test-password';
      const hash = await authService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
    });
  });

  describe('comparePassword', () => {
    it('should compare password with hash', async () => {
      const password = 'test-password';
      const hash = await authService.hashPassword(password);
      const match = await authService.comparePassword(password, hash);

      expect(match).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'test-password';
      const hash = await authService.hashPassword(password);
      const match = await authService.comparePassword('wrong-password', hash);

      expect(match).toBe(false);
    });
  });

  describe('decodeToken', () => {
    it('should decode token without verification', () => {
      const user = { id: '123', email: 'test@example.com' };
      const token = authService.generateToken(user);
      const decoded = authService.decodeToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.sub).toBe(user.id);
    });

    it('should return null for invalid token', () => {
      const decoded = authService.decodeToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });
});
