import { ListItemResponseDto } from '../dto/list-response.dto';
import { ListType } from '../entities/list.entity';
import { ListItem } from '../entities/list.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Album } from 'src/albums/entities/album.entity';
import { TrackWithReviewDto } from 'src/tracks/dtos/track-response.dto';
import { ArtistDto } from 'src/artists/dtos/artists-response.dto';
import { AlbumDto } from 'src/albums/dtos/albums-response.dto';

export class ListItemMapper {
  static toResponseDto(type: ListType, listItem: ListItem): ListItemResponseDto {
    switch (type) {
      case ListType.TRACK:
        return new TrackWithReviewDto(listItem as Track);
      case ListType.ARTIST:
        return new ArtistDto(listItem as Artist);
      case ListType.ALBUM:
        return new AlbumDto(listItem as Album);
      default:
        throw new Error('Invalid list type');
    }
  }
}
