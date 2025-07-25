import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { TrackWithReviewDto } from 'src/tracks/dtos/track-response.dto';
import { Track } from 'src/tracks/entities/track.entity';

@Injectable()
export class RedisService {
    private readonly SIMILAR_TRACKS_EXPIRATION = 60 * 60 * 24;
    private readonly QUEUE_EXPIRATION = 60 * 60 * 24;
    private readonly TIMEOUT = 1000;

    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: Redis,
    ) { }

    private getQueueKey(userId: string): string {
        return `queue:${userId}`;
    }

    private getSimilarTracksKey(trackId: string): string {
        return `similar:${trackId}`;
    }

    async fetchQueue(userId: string): Promise<TrackWithReviewDto[]> {
        const queueKey = this.getQueueKey(userId);
        const trackStrings = await this.redis.lrange(queueKey, 0, -1);
        return trackStrings.map(trackString => JSON.parse(trackString));
    }

    async enqueue(userId: string, track: TrackWithReviewDto): Promise<void> {
        const queueKey = this.getQueueKey(userId);
        await this.redis.rpush(queueKey, JSON.stringify(track));
        await this.redis.expire(queueKey, this.QUEUE_EXPIRATION);
    }

    async dequeue(userId: string, track: TrackWithReviewDto): Promise<void> {
        const queueKey = this.getQueueKey(userId);
        const queue = await this.fetchQueue(userId);

        const trackIndex = queue.findIndex(t => t.id === track.id);
        if (trackIndex === -1) return;

        await this.redis.lrem(queueKey, 1, JSON.stringify(queue[trackIndex]));
    }

    async clearQueue(userId: string): Promise<void> {
        const queueKey = this.getQueueKey(userId);
        await this.redis.del(queueKey);
    }

    async cacheSimilarTracks(trackId: string, similarTracks: Track[]): Promise<void> {
        const key = this.getSimilarTracksKey(trackId);
        const tracksToCache = similarTracks.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artist,
            artist_uri: track.artist_uri,
            album: track.album,
            album_uri: track.album_uri,
            uri: track.uri,
            image: track.image,
            isrcId: track.isrcId,
        }));
        await this.redis.setex(
            key,
            this.SIMILAR_TRACKS_EXPIRATION,
            JSON.stringify(tracksToCache)
        );
    }

    async getSimilarTracks(trackId: string): Promise<Track[] | null> {
        const key = this.getSimilarTracksKey(trackId);
        const cachedTracks = await this.redis.get(key);

        if (!cachedTracks) {
            return null;
        }

        const parsedTracks = JSON.parse(cachedTracks);
        return parsedTracks.map((track: any) => Track.create({
            id: track.id || track._id,
            name: track.name || track._name,
            artist: track.artist || track._artist,
            artist_uri: track.artist_uri || track._artist_uri,
            album: track.album || track._album,
            album_uri: track.album_uri || track._album_uri,
            uri: track.uri || track._uri,
            image: track.image || track._image,
            isrcId: track.isrcId || track._isrcId,
        }));
    }

    async getNextTrackFromQueue(userId: string): Promise<TrackWithReviewDto | null> {
        const queueKey = this.getQueueKey(userId);
        const nextTrack = await this.redis.lpop(queueKey);

        if (!nextTrack) {
            return null;
        }

        return JSON.parse(nextTrack);
    }

    async getPreviousTrackFromQueue(userId: string): Promise<TrackWithReviewDto | null> {
        const queueKey = this.getQueueKey(userId);
        const queue = await this.fetchQueue(userId);

        if (queue.length === 0) {
            return null;
        }

        const lastTrack = queue[queue.length - 1];
        await this.dequeue(userId, lastTrack);

        return lastTrack;
    }
}