import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { SpotifyArtistsRepository } from './repositories/artists.repository';
import { SpotifyModule } from 'src/common/http/spotify/spotify.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaReviewRepository } from 'src/reviews/repositories/prisma-review.repository';

@Module({
  controllers: [ArtistsController],
  imports: [AuthModule, SpotifyModule, ReviewsModule],
  providers: [
    ArtistsService,
    {
      provide: 'ArtistRepository',
      useClass: SpotifyArtistsRepository,
    },
    {
      provide: 'ReviewRepository',
      useClass: PrismaReviewRepository,
    },
  ],
})
export class ArtistsModule {}
