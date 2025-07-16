import { AuthModule } from "src/auth/auth.module";
import { SpotifyModule } from "src/common/http/spotify/spotify.module";
import { ReviewsModule } from "src/reviews/reviews.module";
import { UsersController } from "./users.controller";
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserRepository } from "./repositories/users.repository";

@Module({
    imports: [
        AuthModule,
        SpotifyModule,
        ReviewsModule,
    ],
    controllers: [
        UsersController,
    ],
    providers: [
        UsersService,
        {
            provide: 'UsersRepository',
            useClass: UserRepository
        },
    ],
})
export class UsersModule {}