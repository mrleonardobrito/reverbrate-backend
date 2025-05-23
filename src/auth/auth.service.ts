import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as qs from 'qs';

@Injectable()
export class AuthService {
    private readonly clientId = process.env.SPOTIFY_CLIENT_ID;
    private readonly clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    private readonly redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    constructor(private readonly http: HttpService) { }

    getSpotifyAuthUrl(): string {
        const scope = 'user-read-email user-top-read';
        const query = qs.stringify({
            response_type: 'code',
            client_id: this.clientId,
            scope,
            redirect_uri: this.redirectUri,
        });
        return `https://accounts.spotify.com/authorize?${query}`;
    }

    async exchangeCodeForTokens(code: string) {
        const body = qs.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.redirectUri,
            client_id: this.clientId,
            client_secret: this.clientSecret,
        });

        const response = await firstValueFrom(
            this.http.post('https://accounts.spotify.com/api/token', body, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }),
        );

        return response.data;
    }
}
