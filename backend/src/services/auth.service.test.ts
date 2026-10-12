import { AuthService } from './auth.service';
import { db } from '../config/db.config';
import * as passwordUtil from '../utils/password.util';
import * as tokenUtil from '../utils/token.util';

// Mock dependencies
jest.mock('../config/db.config', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../utils/password.util');
jest.mock('../utils/token.util');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      name: 'Alice Developer',
      email: 'alice@example.com',
      password: 'StrongPassword123!',
    };

    it('should throw an error if a user with the same email already exists', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing-id', email: registerDto.email });

      await expect(AuthService.register(registerDto)).rejects.toThrow(
        'User with this email already exists'
      );
      expect(db.user.findUnique).toHaveBeenCalledWith({ where: { email: registerDto.email } });
      expect(db.user.create).not.toHaveBeenCalled();
    });

    it('should successfully hash password, create user, tokens, and return user data', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue(null);
      (passwordUtil.hashPassword as jest.Mock).mockResolvedValue('hashed_pw_secret');
      (db.user.create as jest.Mock).mockResolvedValue({
        id: 'new-user-id',
        email: registerDto.email,
        name: registerDto.name,
        role: 'USER',
        createdAt: new Date(),
      });
      (tokenUtil.generateAccessToken as jest.Mock).mockReturnValue('mock_access_token');
      (tokenUtil.generateRefreshToken as jest.Mock).mockReturnValue('mock_refresh_token');
      (db.refreshToken.create as jest.Mock).mockResolvedValue({ id: 'rt-1' });

      const result = await AuthService.register(registerDto);

      expect(passwordUtil.hashPassword).toHaveBeenCalledWith('StrongPassword123!');
      expect(db.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: registerDto.email,
            passwordHash: 'hashed_pw_secret',
            name: registerDto.name,
          }),
        })
      );
      expect(result.accessToken).toBe('mock_access_token');
      expect(result.refreshToken).toBe('mock_refresh_token');
      expect(result.user.email).toBe(registerDto.email);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'bob@example.com',
      password: 'CorrectPassword123!',
    };

    it('should throw an error if the user is not found', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.login(loginDto)).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error if the password does not match', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-bob',
        email: loginDto.email,
        passwordHash: 'stored_hash',
      });
      (passwordUtil.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(AuthService.login(loginDto)).rejects.toThrow('Invalid email or password');
    });

    it('should return user info and fresh tokens on successful login', async () => {
      (db.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-bob',
        email: loginDto.email,
        name: 'Bob',
        role: 'USER',
        passwordHash: 'stored_hash',
      });
      (passwordUtil.comparePassword as jest.Mock).mockResolvedValue(true);
      (tokenUtil.generateAccessToken as jest.Mock).mockReturnValue('bob_access_token');
      (tokenUtil.generateRefreshToken as jest.Mock).mockReturnValue('bob_refresh_token');
      (db.refreshToken.create as jest.Mock).mockResolvedValue({ id: 'rt-bob' });

      const result = await AuthService.login(loginDto);

      expect(result.accessToken).toBe('bob_access_token');
      expect(result.refreshToken).toBe('bob_refresh_token');
      expect(result.user.id).toBe('user-bob');
    });
  });

  describe('logout', () => {
    it('should revoke the refresh token in the database', async () => {
      (db.refreshToken.update as jest.Mock).mockResolvedValue({ id: 'rt-1', revoked: true });

      await AuthService.logout('test_refresh_token');

      expect(db.refreshToken.update).toHaveBeenCalledWith({
        where: { token: 'test_refresh_token' },
        data: { revoked: true },
      });
    });

    it('should safely do nothing if no token is passed', async () => {
      await AuthService.logout('');
      expect(db.refreshToken.update).not.toHaveBeenCalled();
    });
  });
});
