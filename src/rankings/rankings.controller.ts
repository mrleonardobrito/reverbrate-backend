import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { RankingsService } from './rankings.service';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';

@Controller('rankings')
@ApiTags('Rankings')
@UseGuards(AuthGuard)
export class RankingsController {
    constructor(private readonly rankingsService: RankingsService) { }

    @Get('user')
    async getUserRankings(@Query() query: PaginatedRequest) {
        return this.rankingsService.getMostFollowedUsers(query);
    }
}
