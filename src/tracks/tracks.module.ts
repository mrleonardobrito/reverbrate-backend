import { Module } from '@nestjs/common';
import { SpotifyTrackRepository } from './repositories/spotify-track.repository';
import { TracksService } from './tracks.service';
import { PrismaReviewRepository } from 'src/reviews/repositories/prisma-review.repository';

@Module({
  imports: [],
  providers: [
    TracksService,
    {
      provide: 'TrackRepository',
      useClass: SpotifyTrackRepository,
    },
    {
      provide: 'ReviewRepository',
      useClass: PrismaReviewRepository,
    },
  ],
  exports: [TracksService],
})
export class TracksModule {}
