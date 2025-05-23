import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let res: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    res = { redirect: jest.fn(), json: jest.fn() };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('deve redirecionar para a URL de autenticação do Spotify', () => {
      const url = 'http://spotify.com/auth';
      jest.spyOn(authService, 'getSpotifyAuthUrl').mockReturnValue(url);
      controller.login(res);
      expect(res.redirect).toHaveBeenCalledWith(url);
    });
  });

  describe('callback', () => {
    it('deve retornar os tokens em JSON', async () => {
      const tokens = { access_token: 'token1', refresh_token: 'token2' };
      jest.spyOn(authService, 'exchangeCodeForTokens').mockResolvedValue(tokens);
      await controller.callback('code123', '', res);
      expect(res.json).toHaveBeenCalledWith(tokens);
    });

    it('deve lançar BadRequestException se houver error', async () => {
      await expect(controller.callback('code', 'some_error', res)).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se não houver code', async () => {
      await expect(controller.callback('', '', res)).rejects.toThrow(BadRequestException);
    });
  });
});
