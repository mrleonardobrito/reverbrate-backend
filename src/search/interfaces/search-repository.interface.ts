import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";
import { SearchRequest } from "../dtos/search-request.dto";
import { SearchResponse } from "../dtos/search-response.dto";
import { ArtistDto } from "src/artists/dtos/search-artist.dto";
import { TrackDto } from "src/tracks/dtos/track-response.dto";

export interface SearchRepository {
    searchTracks(query: SearchRequest): Promise <PaginatedResponse<TrackDto>>;
    searchArtists(query: SearchRequest): Promise <PaginatedResponse<ArtistDto>>;
}