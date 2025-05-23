import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    process.env.SPOTIFY_CLIENT_ID = 'test_client_id';
    process.env.SPOTIFY_CLIENT_SECRET = 'test_client_secret';
    process.env.SPOTIFY_REDIRECT_URI = 'http://localhost:3002/auth/callback';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve gerar a URL de autenticação do Spotify corretamente', () => {
    const url = service.getSpotifyAuthUrl();
    expect(url).toContain('https://accounts.spotify.com/authorize?');
    expect(url).toContain('client_id=test_client_id');
    expect(url).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3002%2Fauth%2Fcallback');
  });

  it('deve trocar o código por tokens usando o endpoint do Spotify', async () => {
    const mockResponse = {
      data: {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} },
    };
    jest.spyOn(service['http'], 'post').mockReturnValueOnce(of(mockResponse as AxiosResponse));
    const result = await service.exchangeCodeForTokens('test_code');
    expect(result).toEqual({
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    });
  });
});
