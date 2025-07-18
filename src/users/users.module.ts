import { AuthModule } from 'src/auth/auth.module';
import { SpotifyModule } from 'src/common/http/spotify/spotify.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ListsModule } from 'src/lists/lists.module';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaReviewRepository } from 'src/reviews/repositories/prisma-review.repository';
import { PrismaListsRepository } from 'src/lists/repositories/prisma-lists.repository';
import { SpotifyTrackRepository } from 'src/tracks/repositories/spotify-track.repository';
import { SpotifyArtistsRepository } from 'src/artists/repositories/artists.repository';
import { SpotifyAlbumRepository } from 'src/albums/repositories/spotify-album.repository';

@Module({
  imports: [AuthModule, SpotifyModule, ReviewsModule, ListsModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'ListRepository',
      useClass: PrismaListsRepository,
    },
    {
      provide: 'TrackRepository',
      useClass: SpotifyTrackRepository,
    },
    {
      provide: 'ArtistRepository',
      useClass: SpotifyArtistsRepository,
    },
    {
      provide: 'AlbumRepository',
      useClass: SpotifyAlbumRepository,
    },
    {
      provide: 'ReviewRepository',
      useClass: PrismaReviewRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule { }
