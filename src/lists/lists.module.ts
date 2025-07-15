import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaListsRepository } from './repositories/prisma-lists.repository';
import { ListsController } from './lists.controller';
import { TracksModule } from 'src/tracks/tracks.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { SpotifyTrackRepository } from 'src/tracks/repositories/spotify-track.repository';
import { SpotifyModule } from 'src/common/http/spotify/spotify.module';
import { SpotifyArtistsRepository } from 'src/artists/repositories/artists.repository';
import { SpotifyAlbumRepository } from 'src/albums/repositories/spotify-album.repository';

@Module({
  imports: [AuthModule, PrismaModule, SpotifyModule, TracksModule, ArtistsModule, AlbumsModule],
  controllers: [ListsController],
  providers: [ListsService, {
    provide: 'TrackRepository',
    useClass: SpotifyTrackRepository,
  }, {
      provide: 'ArtistRepository',
      useClass: SpotifyArtistsRepository,
    }, {
      provide: 'AlbumRepository',
      useClass: SpotifyAlbumRepository,
    }, {
      provide: 'ListRepository',
      useClass: PrismaListsRepository,
    }],
  exports: [ListsService]
})
export class ListsModule { }
