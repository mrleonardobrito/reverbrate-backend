import { Injectable } from "@nestjs/common";
import { SearchResponse } from "src/search/dtos/search-response.dto";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto"; 
import { TrackDto } from "src/tracks/dtos/track-response.dto"; 
import { SpotifyMapper } from "./track.mapper";
import { ArtistDto } from "src/artists/dtos/search-artist.dto";

@Injectable()
export class SpotifySearchMapper {

}