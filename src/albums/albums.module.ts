import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { SpotifyModule } from 'src/common/http/spotify/spotify.module';
import { SpotifyAlbumRepository } from './repositories/spotify-album.repository';
import { PrismaReviewRepository } from 'src/reviews/repositories/prisma-review.repository';

@Module({
  controllers: [AlbumsController],
  imports: [AuthModule, SpotifyModule, ReviewsModule],
  providers: [
    AlbumsService,
    {
      provide: 'AlbumRepository',
      useClass: SpotifyAlbumRepository,
    },
    {
      provide: 'ReviewRepository',
      useClass: PrismaReviewRepository,
    },
  ],
})
export class AlbumsModule {}
