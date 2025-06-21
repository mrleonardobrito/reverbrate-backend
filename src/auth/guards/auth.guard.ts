import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SpotifyService } from 'src/common/http/spotify/spotify.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private spotifyService: SpotifyService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { access_token: accessToken, refresh_token: refreshToken } = request.cookies;

        if (!accessToken) {
            throw new HttpException('Access token not found', HttpStatus.UNAUTHORIZED);
        }

        try {
            await this.validateAndSetUserInfo(accessToken, request);
            return true;
        } catch (error) {
            return await this.handleTokenError(refreshToken, request);
        }
    }

    private async validateAndSetUserInfo(accessToken: string, request: any): Promise<void> {
        this.spotifyService.spotify.setAccessToken(accessToken);
        const userInfo = await this.spotifyService.spotify.getMe();
        request.user = userInfo.body;
    }

    private async handleTokenError(refreshToken: string, request: any): Promise<boolean> {
        if (!refreshToken) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }

        try {
            const tokens = await this.authService.refreshAccessToken(refreshToken);
            await this.validateAndSetUserInfo(tokens.accessToken, request);
            return true;
        } catch (refreshError) {
            throw new HttpException('Session expired, please login again', HttpStatus.UNAUTHORIZED);
        }
    }
}