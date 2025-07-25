import { Track } from '../entities/track.entity';

export interface TrackRepository {
  findById(id: string): Promise<Track | null>;
  findManyByIds(ids: string[]): Promise<Track[]>;
  findNextTrack(currentTrackId: string): Promise<Track>;
  findPreviousTrack(currentTrackId: string): Promise<Track>;
}
