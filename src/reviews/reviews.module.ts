import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SpotifyModule } from 'src/common/http/spotify/spotify.module';
import { PrismaReviewRepository } from './repositories/prisma-review.repository';
import { SpotifyTrackRepository } from 'src/tracks/repositories/spotify-track.repository';

@Module({
    imports: [PrismaModule, AuthModule, SpotifyModule],
    controllers: [ReviewsController],
    providers: [
        ReviewsService,
        {
            provide: 'ReviewRepository',
            useClass: PrismaReviewRepository,
        },
        {
            provide: 'TrackRepository',
            useClass: SpotifyTrackRepository,
        },
    ],
    exports: [ReviewsService],
})
export class ReviewsModule { } 