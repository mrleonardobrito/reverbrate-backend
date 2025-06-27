// src/auth/strategies/youtube-auth.strategy.ts

import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { AuthStrategy, AuthTokens } from '../interfaces/auth-strategy.interface';
import { User } from 'src/users/entities/user.entity';
import { UserMapper } from 'src/users/mappers/user.mapper';

@Injectable()
export class YoutubeAuthStrategy implements AuthStrategy {
    private readonly oauth2Client: OAuth2Client;

    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            "1055509997011-nq63r1cvi5cac4hihu46qcl1nk4nbp0e.apps.googleusercontent.com",
            "GOCSPX-_0234567890",
            "http://127.0.0.1:3001/auth/callback",
        );
    }

    getAuthorizationUrl(): string {
        const scopes = [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/userinfo.email',
        ];

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
    }

    async exchangeCodeForTokens(code: string): Promise<AuthTokens> {
        const { tokens } = await this.oauth2Client.getToken(code);

        return {
            accessToken: tokens.access_token!,
            refreshToken: tokens.refresh_token || undefined,
            expiresIn: tokens.expiry_date
                ? Math.floor((tokens.expiry_date - Date.now()) / 1000)
                : 3600,
        };
    }

    async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
        this.oauth2Client.setCredentials({ refresh_token: refreshToken });
        const { credentials } = await this.oauth2Client.refreshAccessToken();

        return {
            accessToken: credentials.access_token!,
            expiresIn: credentials.expiry_date
                ? Math.floor((credentials.expiry_date - Date.now()) / 1000)
                : 3600,
        };
    }

    async getProfile(accessToken: string): Promise<User> {
        return UserMapper.toDomain({
            id: '123',
            email: 'test@test.com',
            name: 'Test',
            image: 'https://test.com/image.png'
        });
    }
}
