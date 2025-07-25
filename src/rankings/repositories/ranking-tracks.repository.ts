import { PrismaService } from "src/prisma/prisma.service";
import { RankingRepository } from "../interfaces/ranking-repository.interface";

export class RankingTracksRepository implements RankingRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findBestTracksByRatingIds(): Promise<string[]> {
    const results = await this.prisma.bestTracks.findMany({
      orderBy: {
        average_rating: 'desc',
      },
      take: 4,
      select: {
        track_id: true,
      }})

    return results.map((result) => result.track_id);
  }
}