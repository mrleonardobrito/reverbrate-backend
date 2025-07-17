import { Controller, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { SearchService } from './search.service';
import { SearchResponse } from './dtos/search-response.dto';
import { SearchRequest } from './dtos/search-request.dto';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Search')
@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Search for tracks, artists, or albums on the Spotify API' })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'The search query string, containing the name of the item the user wishes to search for.',
    type: String,
    example: 'Bohemian Rhapsody',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'The type of item to search for. Can be "track", "artist", "album", or "user"',
    enum: ['track', 'artist', 'album', 'user'],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'The maximum number of items to return for all object types (default: 20).',
    type: Number,
    example: 20,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'The number of items to skip for all object types (default: 0).',
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'track_limit',
    required: false,
    description: 'The maximum number of tracks to return (overrides general limit for tracks).',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'artists_limit',
    required: false,
    description: 'The maximum number of artists to return (overrides general limit for artists).',
    type: Number,
    example: 5,
  })
  @ApiQuery({
    name: 'track_offset',
    required: false,
    description: 'The number of tracks to skip (overrides general offset for tracks).',
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'artists_offset',
    required: false,
    description: 'The number of artists to skip (overrides general offset for artists).',
    type: Number,
    example: 0,
  })
  @ApiResponse({ status: 200, description: 'Search results', type: SearchResponse })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid authentication cookie' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async search(
    @Query(new ValidationPipe({ transform: true })) query: SearchRequest,
    @CurrentUser() user: User,
  ): Promise<SearchResponse> {
    return this.searchService.search(query, user.id);
  }
}
