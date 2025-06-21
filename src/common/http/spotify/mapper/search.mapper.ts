import { SpotifyTrackMapper } from "./track.mapper";
import { SearchResponse } from "src/search/dtos/search-response.dto";

export class SpotifySearchMapper {
    static toDto(response: SpotifyApi.SearchResponse): SearchResponse {
        return {
            tracks: SpotifyTrackMapper.toPaginatedDto(response.tracks),
        };
    }
}   