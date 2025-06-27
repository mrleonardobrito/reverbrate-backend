import { Injectable } from '@nestjs/common';
import { YoutubeAuthStrategy } from './youtube-auth.strategy';
import { SpotifyAuthStrategy } from './spotify-auth.strategy';
import { AuthStrategy } from '../interfaces/auth-strategy.interface';

@Injectable()
export class AuthStrategyFactory {
    private readonly strategies: Record<string, AuthStrategy>;

    constructor(
        private readonly spotifyAuth: SpotifyAuthStrategy,
        private readonly youtubeAuth: YoutubeAuthStrategy,
    ) {
        this.strategies = {
            spotify: this.spotifyAuth,
            youtube: this.youtubeAuth,
        };
    }

    getStrategy(strategy: string = 'spotify'): AuthStrategy {
        const key = strategy.toLowerCase();
        return this.strategies[key] || this.spotifyAuth;
    }
}
