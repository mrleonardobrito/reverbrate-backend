import { Album } from '../entities/album.entity';

export interface AlbumRepository {
  findById(id: string): Promise<Album>;
}
