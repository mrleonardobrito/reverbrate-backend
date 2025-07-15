import { ApiProperty } from '@nestjs/swagger';
import { AlbumDto } from 'src/albums/dtos/search-album.dto';
import { ArtistDto } from 'src/artists/dtos/search-artist.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { TrackDto } from 'src/tracks/dtos/track-response.dto';

export class SearchResponse {
  @ApiProperty({ type: PaginatedResponse<TrackDto> })
  tracks: PaginatedResponse<TrackDto>;

  @ApiProperty({ type: PaginatedResponse<ArtistDto> })
  artists: PaginatedResponse<ArtistDto>;

  @ApiProperty({ type: PaginatedResponse<AlbumDto> })
  albums: PaginatedResponse<AlbumDto>;

  constructor(
    tracks: PaginatedResponse<TrackDto>,
    artists: PaginatedResponse<ArtistDto>,
    albums: PaginatedResponse<AlbumDto>,
  ) {
    this.tracks = tracks;
    this.artists = artists;
    this.albums = albums;
  }
}
