import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaReviewRepository } from './repositories/prisma-review.repository';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { AuthModule } from 'src/auth/auth.module';
import { SpotifyTrackRepository } from 'src/tracks/repositories/spotify-track.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    {
      provide: 'ReviewRepository',
      useClass: PrismaReviewRepository,
    },
    {
      provide: 'TrackRepository',
      useClass: SpotifyTrackRepository,
    },
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
