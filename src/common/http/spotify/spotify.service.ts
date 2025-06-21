import { Injectable } from '@nestjs/common';
import SpotifyWebApi from 'spotify-web-api-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SpotifyService {
    private readonly _spotify: SpotifyWebApi;

    constructor(readonly config: ConfigService) {
        this._spotify = new SpotifyWebApi({
            clientId: config.get<string>('spotify.clientId'),
            clientSecret: config.get<string>('spotify.clientSecret'),
            redirectUri: config.get<string>('spotify.redirectUri'),
        });
    }

    get spotify() {
        return this._spotify;
    }
}