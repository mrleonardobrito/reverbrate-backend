import { AuthModule } from "src/auth/auth.module";
import { SpotifyModule } from "src/common/http/spotify/spotify.module";
import { ReviewsModule } from "src/reviews/reviews.module";
import { UsersController } from "./users.controller";
import { Module } from "@nestjs/common";
import { UsersService } from './users.service';

@Module({
    imports: [
        AuthModule,
        SpotifyModule,
        ReviewsModule,
    ],
    controllers: [
        UsersController,
    ],
    providers: [UsersService],
})
export class UsersModule {}