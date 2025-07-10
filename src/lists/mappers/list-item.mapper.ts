import { ListItemResponseDto } from "../dto/list-response.dto";
import { ListType } from "../entities/list.entity";
import { TrackMapper } from "src/tracks/mappers/track.mapper";
import { ArtistsMapper } from "src/artists/mappers/artists.mapper";
import { AlbumMapper } from "src/albums/mapper/album.mapper";
import { ListItem } from "../entities/list.entity";
import { Track } from "src/tracks/entities/track.entity";
import { Artist } from "src/artists/entities/artist.entity";
import { Album } from "src/albums/entities/album.entity";

export class ListItemMapper {
    static toResponseDto(type: ListType, listItem: ListItem): ListItemResponseDto {
        switch (type) {
            case ListType.TRACK:
                return TrackMapper.toDto(listItem as Track);
            case ListType.ARTIST:
                return ArtistsMapper.toDto(listItem as Artist, []);
            case ListType.ALBUM:
                return AlbumMapper.toDto(listItem as Album, []);
            default:
                throw new Error('Invalid list type');
        }
    }
}