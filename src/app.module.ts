import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SearchModule } from './search/search.module';
import configuration from './config/configuration';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { ListsController } from './lists/lists.controller';
import { ListsModule } from './lists/lists.module';
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    SearchModule,
    ReviewsModule,
    UsersModule,
    AlbumsModule,
    ArtistsModule,
    ListsModule,
    TracksModule,
  ],
  controllers: [ListsController],
})
export class AppModule { }
