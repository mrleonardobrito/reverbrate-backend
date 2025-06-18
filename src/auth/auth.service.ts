import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import SpotifyWebApi from 'spotify-web-api-node';
import crypto from 'crypto';

@Injectable()
export class AuthService {
    private spotifyApi: SpotifyWebApi;

    constructor(private readonly http: HttpService) {
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
            redirectUri: process.env.SPOTIFY_REDIRECT_URI!,
        });
    }

    getSpotifyAuthUrl(): string {
        const scope = ['streaming', 'user-read-email', 'user-top-read'];
        const state = crypto.randomBytes(16).toString('hex');

        return this.spotifyApi.createAuthorizeURL(scope, state);
    }

    getAccessToken() {
        return this.spotifyApi.getAccessToken();
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
