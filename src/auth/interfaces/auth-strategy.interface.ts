import { User } from "src/users/entities/user.entity";

export interface AuthStrategy {
    getAuthorizationUrl(): string;
    exchangeCodeForTokens(code: string): Promise<AuthTokens>;
    refreshAccessToken(refreshToken: string): Promise<AuthTokens>;
    getProfile(accessToken: string): Promise<User>;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
}