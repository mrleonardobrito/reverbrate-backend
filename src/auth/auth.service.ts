import { HttpStatus, HttpException, Injectable, Logger, Inject } from '@nestjs/common';
import { Request } from 'express';
import crypto from 'crypto';
import { SpotifyService } from 'src/common/http/spotify/spotify.service';
import SpotifyWebApi from 'spotify-web-api-node';
import { ProfileRepository } from './interfaces/profile-repository.interface';
import { SignupRequestDto } from './dtos/signup-request.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  private spotifyApi: SpotifyWebApi;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
    private readonly http: SpotifyService,
  ) {
    this.spotifyApi = this.http.spotify;
  }

  getSpotifyAuthUrl(): string {
    const scope = [
      'streaming',
      'user-read-email',
      'user-top-read',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'app-remote-control',
    ];
    const state = crypto.randomBytes(16).toString('hex');
    const authUrl = this.spotifyApi.createAuthorizeURL(scope, state);
    return authUrl;
  }

  async exchangeCodeForTokens(code: string) {
    const data = await this.spotifyApi.authorizationCodeGrant(code);

    this.spotifyApi.setAccessToken(data.body.access_token);
    this.spotifyApi.setRefreshToken(data.body.refresh_token);

    return {
      access_token: data.body.access_token,
      refresh_token: data.body.refresh_token,
      expires_in: data.body.expires_in,
    };
  }

  extractToken(req: Request) {
    const accessToken = req.cookies?.['access_token'] as string | undefined;
    const refreshToken = req.cookies?.['refresh_token'] as string | undefined;
    const expiresIn = req.cookies?.['expires_in'] as number | undefined;

    if (!accessToken) {
      throw new HttpException('Access Token not found', HttpStatus.UNAUTHORIZED);
    }

    if (!refreshToken) {
      throw new HttpException('Refresh Token not found', HttpStatus.UNAUTHORIZED);
    }

    return { accessToken, refreshToken, expiresIn };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    this.spotifyApi.setRefreshToken(refreshToken);
    const data = await this.spotifyApi.refreshAccessToken();

    if (!data.body.refresh_token) {
      throw new HttpException('Refresh Token Expired', HttpStatus.UNAUTHORIZED);
    }
    this.spotifyApi.setAccessToken(data.body.access_token);
    return {
      accessToken: data.body['access_token'],
      refreshToken: data.body['refresh_token'],
      expiresIn: data.body['expires_in'],
    };
  }

  async needSignUp() {
    const me = await this.spotifyApi.getMe().catch(() => {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    });
    if (!me.body.email) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.profileRepository.findByEmail(me.body.email);
    if (!user) {
      return true;
    }
    return false;
  }

  async signup(body: SignupRequestDto) {
    const spotifyUser = await this.spotifyApi.getMe();
    const image = spotifyUser.body.images?.[0]?.url;
    const newUser = User.create({
      id: crypto.randomUUID(),
      nickname: body.nickname,
      bio: body.bio,
      name: body.name,
      email: body.email,
      image: image,
      isPrivate: false,
    });
    await this.profileRepository.create(newUser);
    return {
      access_token: this.spotifyApi.getAccessToken(),
      refresh_token: this.spotifyApi.getRefreshToken(),
    };
  }
}
