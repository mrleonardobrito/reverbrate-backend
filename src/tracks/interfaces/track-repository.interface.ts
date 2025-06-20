import { Track } from '../entities/track';

export interface TrackRepository {
    findById(id: string): Promise<Track>;
}