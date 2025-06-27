import { HttpStatus, HttpException, Injectable, Logger } from '@nestjs/common';
import crypto from 'crypto';
import { SpotifyService } from 'src/common/http/spotify/spotify.service';
import { AuthStrategyFactory } from './strategies/auth-strategy.factory';
import { AuthStrategy } from './interfaces/auth-strategy.interface';

@Injectable()
export class AuthService {
    private authStrategy: AuthStrategy;
    constructor(private readonly authStrategyFactory: AuthStrategyFactory) {
        this.authStrategy = this.authStrategyFactory.getStrategy('spotify');
    }

    setCurrentAuthStrategy(strategy: string): void {
        this.authStrategy = this.authStrategyFactory.getStrategy(strategy);
    }

    getCurrentAuthStrategy(): AuthStrategy {
        return this.authStrategy;
    }
}
