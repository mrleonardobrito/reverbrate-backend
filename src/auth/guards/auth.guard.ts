import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { SpotifyService } from 'src/common/http/spotify/spotify.service';
import { ProfileRepository } from '../interfaces/profile-repository.interface';

interface AuthenticatedRequest extends Request {
  user?: any;
}

interface Cookies {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private spotifyService: SpotifyService,
    @Inject('ProfileRepository')
    private profileRepository: ProfileRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { access_token: accessToken, refresh_token: refreshToken } = request.cookies as Cookies;

    if (!accessToken) {
      throw new HttpException('Access token not found', HttpStatus.UNAUTHORIZED);
    }

    try {
      await this.validateAndSetUserInfo(accessToken, request);
      return true;
    } catch (error) {
      console.log(error);
      return await this.handleTokenError(refreshToken, request);
    }
  }

  private async validateAndSetUserInfo(accessToken: string, request: AuthenticatedRequest): Promise<void> {
    this.spotifyService.spotify.setAccessToken(accessToken);
    const userInfo = await this.spotifyService.spotify.getMe();
    const user = await this.profileRepository.findByEmail(userInfo.body.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    request.user = user;
  }

  private async handleTokenError(refreshToken: string, request: AuthenticatedRequest): Promise<boolean> {
    if (!refreshToken) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    try {
      const tokens = await this.authService.refreshAccessToken(refreshToken);
      await this.validateAndSetUserInfo(tokens.accessToken, request);
      return true;
    } catch (error) {
      console.log(error);
      throw new HttpException('Session expired, please login again', HttpStatus.UNAUTHORIZED);
    }
  }
}
