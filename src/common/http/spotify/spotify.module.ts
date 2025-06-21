import { Global, Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyRequestInterceptor } from './interceptors/spotify-request.interceptor';
import { SpotifyErrorInterceptor } from './interceptors/spotify-error.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        SpotifyService,
        {
            provide: APP_INTERCEPTOR,
            useClass: SpotifyRequestInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: SpotifyErrorInterceptor,
        }
    ],
    exports: [SpotifyService],
})
export class SpotifyModule { } 