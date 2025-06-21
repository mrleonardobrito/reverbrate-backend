import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UseGuards, ValidationPipe } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { Review, User } from "@prisma/client";
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { CurrentUser } from "src/auth/decorators/current-user";
import { CreateReviewResponseDto } from "./dtos/create-review.dto";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { UpdateReviewDto } from "./dtos/update-review.dto";
import { ReviewResumedDto } from "./dtos/review.dto";
import { PaginatedRequest } from "src/common/http/dtos/paginated-request.dto";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";

@ApiTags('Reviews')
@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a review for a track' })
    @ApiBody({ type: CreateReviewDto })
    async createReview(@CurrentUser() user: User, @Body() review: CreateReviewDto): Promise<CreateReviewResponseDto> {
        return await this.reviewsService.create(user.id, review);
    }

    @Get()
    @ApiOperation({ summary: 'Get all reviews' })
    @ApiQuery({ type: PaginatedRequest })
    @ApiResponse({ type: PaginatedResponse<ReviewResumedDto> })
    async getAllReviews(@CurrentUser() user: User, @Query() query: PaginatedRequest): Promise<PaginatedResponse<ReviewResumedDto>> {
        return await this.reviewsService.getAllReviews(user.id, query);
    }

    @Get(':track_id')
    @ApiOperation({ summary: 'Get a review by track id' })
    @ApiParam({ name: 'track_id', type: String, required: true })
    async getReviewByTrackId(@CurrentUser() user: User, @Param('track_id') track_id: string): Promise<ReviewResumedDto> {
        return await this.reviewsService.getReviewByTrackId(user.id, track_id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a review by id' })
    async deleteReview(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
        return await this.reviewsService.delete(user.id, id);
    }
}
