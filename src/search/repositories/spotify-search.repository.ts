import { Injectable } from "@nestjs/common";
import { SearchRepository } from "../interfaces/search-repository.interface";
import { SearchRequest } from "../dtos/search-request.dto";
import { SearchResponse } from "../dtos/search-response.dto";
import { SpotifyService } from "src/common/http/spotify/spotify.service";
import SpotifyWebApi from "spotify-web-api-node";
import { SpotifySearchMapper } from "src/common/http/spotify/mapper/search.mapper";

@Injectable()
export class SpotifySearchRepository implements SearchRepository {
    private readonly spotify: SpotifyWebApi;
    constructor(private readonly spotifyApi: SpotifyService) {
        this.spotify = this.spotifyApi.spotify;
    }

    async search(query: SearchRequest): Promise<SearchResponse> {
        const response = await this.spotify.search(query.query, ["track"], {
            limit: query.limit,
            offset: query.offset,
        });
        return SpotifySearchMapper.toDto(response.body);
    }
}