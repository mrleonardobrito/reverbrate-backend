import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';
import { PrismaUserRepository } from 'src/users/repositories/prisma-user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaReviewRepository } from 'src/reviews/repositories/prisma-review.repository';
import { PrismaListsRepository } from 'src/lists/repositories/prisma-lists.repository';
import { ListsModule } from 'src/lists/lists.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { SpotifyTrackRepository } from 'src/tracks/repositories/spotify-track.repository';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { SpotifyArtistsRepository } from 'src/artists/repositories/artists.repository';
import { SpotifyAlbumRepository } from 'src/albums/repositories/spotify-album.repository';
import { SearchModule } from 'src/search/search.module'; 
import { Prisma } from '@prisma/client';
import { PrismaRankingRepository } from './repositories/ranking-tracks.repository';
import { SearchService } from 'src/search/search.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ReviewsModule,
    ListsModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    SearchModule, 
  ],
  controllers: [RankingsController],
  providers: [
    RankingsService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    }, {
      provide: 'ReviewRepository',
      useClass: PrismaReviewRepository,
    }, {
    provide: 'RankingRepository',
    useClass: PrismaRankingRepository,
   }, {
      provide: 'ListRepository',
      useClass: PrismaListsRepository,
    }, {
      provide: 'TrackRepository',
      useClass: SpotifyTrackRepository,
    }, {
      provide: 'ArtistRepository',
      useClass: SpotifyArtistsRepository,
    }, {
      provide: 'AlbumRepository',
      useClass: SpotifyAlbumRepository,
    }
  ]
})
export class RankingsModule { }