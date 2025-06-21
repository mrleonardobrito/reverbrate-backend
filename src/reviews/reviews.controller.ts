import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { Review, User } from "@prisma/client";
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { CurrentUser } from "src/auth/decorators/current-user";
import { ReviewDto } from "./dtos/review.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller('reviews')
@ApiTags('Reviews')
@UseGuards(AuthGuard)
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Create a review for a track' })
    @ApiBody({ type: CreateReviewDto })
    async createReview(@CurrentUser() user: User, @Body() review: CreateReviewDto): Promise<{ review: ReviewDto, track_id: string }> {
        return await this.reviewsService.create(user.id, review);
    }
}
