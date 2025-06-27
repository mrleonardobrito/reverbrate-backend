import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthStrategy, AuthTokens } from '../interfaces/auth-strategy.interface';
import { SpotifyService } from 'src/common/http/spotify/spotify.service';
import SpotifyWebApi from 'spotify-web-api-node';
import * as crypto from 'crypto';
import { User } from 'src/users/entities/user.entity';
import { UserMapper } from 'src/users/mappers/user.mapper';


@Injectable()
export class SpotifyAuthStrategy implements AuthStrategy {
    private readonly spotifyApi: SpotifyWebApi;

    constructor(private readonly spotifyService: SpotifyService) {
        this.spotifyApi = spotifyService.spotify;
    }

    getAuthorizationUrl(): string {
        const scopes = ['streaming', 'user-read-email', 'user-read-private'];
        const state = crypto.randomBytes(16).toString('hex');
        return this.spotifyApi.createAuthorizeURL(scopes, state);
    }

    async exchangeCodeForTokens(code: string): Promise<AuthTokens> {
        const data = await this.spotifyApi.authorizationCodeGrant(code);
        this.spotifyApi.setAccessToken(data.body['access_token']);
        this.spotifyApi.setRefreshToken(data.body['refresh_token']);

        return {
            accessToken: data.body['access_token'],
            refreshToken: data.body['refresh_token'],
            expiresIn: data.body['expires_in'],
        };
    }

    async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
        this.spotifyApi.setRefreshToken(refreshToken);
        const data = await this.spotifyApi.refreshAccessToken();

        if (!data.body['refresh_token']) {
            throw new HttpException('Refresh token not found', HttpStatus.UNAUTHORIZED);
        }

        this.spotifyApi.setAccessToken(data.body['access_token']);
        this.spotifyApi.setRefreshToken(data.body['refresh_token']);

        return {
            accessToken: data.body['access_token'],
            expiresIn: data.body['expires_in'],
        };
    }

    async getProfile(accessToken: string): Promise<User> {
        const profile = await this.spotifyApi.getMe();
        return UserMapper.toDomain({
            id: profile.body.id,
            email: profile.body.email,
            name: profile.body.display_name || '',
            image: profile.body.images?.[0]?.url || '',
        });
    }
}
