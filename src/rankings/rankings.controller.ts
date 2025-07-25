import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RankingsService } from './rankings.service';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { TrackWithReviewDto } from 'src/tracks/dtos/track-response.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';

@Controller('rankings')
@ApiTags('Rankings')
@UseGuards(AuthGuard)
export class RankingsController {
    constructor(private readonly rankingsService: RankingsService) { }

    @Get('user')
    async getUserRankings(@Query() query: PaginatedRequest) {
        return this.rankingsService.getMostFollowedUsers(query);
    }

    @Get('best-tracks')
    @ApiResponse({ status: 200, description: 'best tracks results', type: PaginatedResponse<TrackWithReviewDto> })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid query parameters' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid authentication cookie' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getBestTracks(@CurrentUser() user: User, @Query() query: PaginatedRequest): Promise<PaginatedResponse<TrackWithReviewDto>> {
        return this.rankingsService.getBestTracksByRating(user.id);
    }
}
