import { Module } from '@nestjs/common';
import { SpotifyTrackRepository } from './repositories/spotify-track.repository';
import { TracksService } from './tracks.service';
import { PrismaReviewRepository } from 'src/reviews/repositories/prisma-review.repository';
import { TracksController } from './tracks.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [AuthModule, RedisModule],
  providers: [
    TracksService,
    SpotifyTrackRepository,
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
  controllers: [TracksController],
})
export class TracksModule { }
