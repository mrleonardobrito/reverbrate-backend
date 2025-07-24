import { Artist } from '../entities/artist.entity';

export interface ArtistRepository {
  findById(id: string): Promise<Artist | null>;
  findManyByIds(ids: string[]): Promise<Artist[]>;
}
