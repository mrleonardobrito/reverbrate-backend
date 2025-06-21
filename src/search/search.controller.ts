import { Controller, Get, HttpException, HttpStatus, Query, UseGuards, ValidationPipe } from "@nestjs/common";
import { ApiCookieAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { SearchService } from "./search.service";
import { SearchResponse } from "./dtos/search-response.dto";
import { SearchType } from "./entities/search.entity";
import { SearchRequest } from "./dtos/search-request.dto";
import { CurrentUser } from "src/auth/decorators/current-user";
import { User } from "src/users/entities/user.entity";

@ApiTags('Search')
@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get()
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Search for tracks, artists, or albums on the Spotify API' })
    @ApiQuery({ name: 'type', required: false, description: 'Type of search (track, artist, album)', type: String })
    @ApiQuery({ name: 'query', required: true, description: 'Search query', type: String })
    @ApiResponse({ status: 200, description: 'Search results', type: SearchResponse })
    async search(@Query(new ValidationPipe({ transform: true })) query: SearchRequest, @CurrentUser() user: User): Promise<SearchResponse> {
        return this.searchService.search(query, user.id);
    }
}