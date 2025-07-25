export interface RankingRepository {
    findBestTracksByRatingIds(): Promise<string[]>;
}