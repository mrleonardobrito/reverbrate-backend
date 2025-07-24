import { Album } from '../entities/album.entity';

export interface AlbumRepository {
  findById(id: string): Promise<Album | null>;
  findManyByIds(ids: string[]): Promise<Album[]>;
}
