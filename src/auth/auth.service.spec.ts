import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { IUser } from 'src/common/interface/user.dto';
import { ISignInResponse } from 'src/common/interface/signIn.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';

const mockUserList: IUser[] = [
  {
    userId: 'user1',
    username: 'testuser1',
  },
  {
    userId: 'user2',
    username: 'testuser2',
  },
];

const mockJwtSignOptions: JwtSignOptions = {
  secret: 'secretsecretsecret',
};

const mockSignInResponse: ISignInResponse = {
  accessToken: 'mockAccessToken',
  username: 'testuser1',
};

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn((payload: any, options: JwtSignOptions) => 'mockAccessToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    (authService as any).usernameList = mockUserList;
    (authService as any).jwtOptions = mockJwtSignOptions;
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a sign-in response with access token', () => {
      const result = authService.login('testuser1');
      expect(result).toEqual(mockSignInResponse);
    });

    it('should throw NotFoundException if user is not found', () => {
      expect(() => authService.login('unknownuser')).toThrow(NotFoundException);
    });
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      const userInfo: IUser = { userId: 'user1', username: 'testuser1' };
      const result = authService.generateToken(userInfo);
      expect(result).toEqual(mockSignInResponse);
    });
  });

  describe('getUsername', () => {
    it('should return the username for valid userId', () => {
      const result = authService.getUsername('user1');
      expect(result).toBe('testuser1');
    });

    it('should return empty string for invalid userId', () => {
      const result = authService.getUsername('test invalid user');
      expect(result).toBe('');
    });
  });
});