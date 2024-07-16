import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ISignInRequest, ISignInResponse } from 'src/common/interface/signIn.dto';
import { AuthService } from './auth.service';

const mockSignInRequest: ISignInRequest = {
  username: 'testuser',
};

const mockSignInResponse: ISignInResponse = {
  accessToken: 'mockAccessToken',
  username: mockSignInRequest.username
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn((username: string): ISignInResponse => mockSignInResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', () => {
      const result = authController.login(mockSignInRequest);
      expect(result).toEqual(mockSignInResponse);
      expect(authService.login).toHaveBeenCalledWith(mockSignInRequest.username);
    });

    it('should return a response with status 200', () => {
      const response = authController.login(mockSignInRequest);
      expect(response).toEqual(mockSignInResponse);
    });
  });
});
