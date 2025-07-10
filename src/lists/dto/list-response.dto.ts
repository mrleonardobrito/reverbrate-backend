import { TrackDto } from "src/tracks/dtos/track-response.dto";
import { ArtistDto } from "src/artists/dtos/artists-response.dto";
import { AlbumDto } from "src/albums/dtos/albums-response.dto";

export type ListItemResponseDto = TrackDto | ArtistDto | AlbumDto;

export class ListResponseDto {
    id: string;
    name: string;
    type: string;
    items: ListItemResponseDto[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}