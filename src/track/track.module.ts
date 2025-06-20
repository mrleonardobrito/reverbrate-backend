import { Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TrackService } from './track.service';
import { AuthModule } from 'src/auth/auth.module';
import { TracksController } from './track.controller';
import { SpotifyTrackRepository } from './repositories/track';
import SpotifyWebApi from 'spotify-web-api-node';
import { SPOTIFY_API_CLIENT } from './constants';
import { SpotifyHttpService } from 'src/common/http/spotify/spotify-http.service';

@Module({
    imports: [AuthModule],
    controllers: [TracksController],
    providers: [
        SpotifyHttpService,
        {
            provide: TrackService,
            useClass: TrackService,
            scope: Scope.REQUEST,
        },
        {
            provide: 'TrackRepository',
            useClass: SpotifyTrackRepository,
            scope: Scope.REQUEST,
        },
        {
            provide: SPOTIFY_API_CLIENT,
            scope: Scope.REQUEST,
            useFactory: (request: Request) => {
                const accessToken = request.cookies?.['access_token'];
                const spotifyApi = new SpotifyWebApi();
                if (accessToken) {
                    spotifyApi.setAccessToken(accessToken);
                }
                return spotifyApi;
            },
            inject: [REQUEST],
        },
    ],
    exports: [TrackService],
})
export class TracksModule {}