import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { SpotifyService } from 'src/common/http/spotify/spotify.service';
import SpotifyWebApi from 'spotify-web-api-node';

@Injectable()
export class AuthService {
    private spotifyApi: SpotifyWebApi;

    constructor(private readonly http: SpotifyService) {
        this.spotifyApi = this.http.spotify;
    }

    getSpotifyAuthUrl(): string {
        const scope = ['streaming', 'user-read-email', 'user-top-read'];
        const state = crypto.randomBytes(16).toString('hex');

        return this.spotifyApi.createAuthorizeURL(scope, state);
    }

    async exchangeCodeForTokens(code: string) {
        const data = await this.spotifyApi.authorizationCodeGrant(code);

        this.spotifyApi.setAccessToken(data.body.access_token);
        this.spotifyApi.setRefreshToken(data.body.refresh_token);

        return {
            access_token: data.body.access_token,
            refresh_token: data.body.refresh_token,
            expires_in: data.body.expires_in
        };
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string, expiresIn: number }> {
        this.spotifyApi.setRefreshToken(refreshToken);
        const data = await this.spotifyApi.refreshAccessToken();

        if (!data.body.refresh_token) {
            throw new HttpException('Refresh Token Expired', HttpStatus.UNAUTHORIZED);
        }

        return {
            accessToken: data.body['access_token'],
            refreshToken: data.body['refresh_token'],
            expiresIn: data.body['expires_in'],
        };
    }
}
