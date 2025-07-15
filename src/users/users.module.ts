import { AuthModule } from 'src/auth/auth.module';
import { SpotifyModule } from 'src/common/http/spotify/spotify.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ListsModule } from 'src/lists/lists.module';

@Module({
  imports: [AuthModule, SpotifyModule, ReviewsModule, ListsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
