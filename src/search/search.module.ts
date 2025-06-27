import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { SpotifySearchRepository } from "./repositories/spotify-search.repository";
import { ReviewsModule } from "../reviews/reviews.module";
import { AuthModule } from '../auth/auth.module';
import { PrismaReviewRepository } from "src/reviews/repositories/prisma-review.repository";

@Module({
    imports: [ReviewsModule, AuthModule],
    controllers: [SearchController],
    providers: [
        SearchService,
        {
            provide: 'SearchRepository',
            useClass: SpotifySearchRepository,
        },
        {
            provide: 'ReviewRepository',
            useClass: PrismaReviewRepository,
        }
    ],
})
export class SearchModule { }