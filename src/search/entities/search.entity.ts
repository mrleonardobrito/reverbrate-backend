import { Artist } from 'src/artists/entities/artist.entity';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { Album } from 'src/albums/entities/album.entity';
import { Track } from 'src/tracks/entities/track.entity';

export type SearchResult = {
  tracks: PaginatedResponse<Track>;
  artists: PaginatedResponse<Artist>;
  albums: PaginatedResponse<Album>;
};

export type SearchType = 'track' | 'artist' | 'album';
