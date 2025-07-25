import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchRepository } from './repositories/spotify-search.repository';
import { SpotifyModule } from '../common/http/spotify/spotify.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaReviewRepository } from 'src/reviews/repositories/prisma-review.repository';
import { UsersModule } from '../users/users.module';
import { PrismaUserRepository } from 'src/users/repositories/prisma-user.repository';

@Module({
  imports: [SpotifyModule, ReviewsModule, AuthModule, UsersModule],
  controllers: [SearchController],
  exports: [SearchService],
  providers: [
    SearchService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'SearchRepository',
      useClass: SearchRepository,
    },
    {
      provide: 'ReviewRepository',
      useClass: PrismaReviewRepository,
    },
  ],
})
export class SearchModule {}
