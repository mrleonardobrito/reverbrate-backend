import { Controller, Get, Query, HttpStatus, HttpException, BadRequestException, UseGuards } from '@nestjs/common';
import { TrackService } from './track.service';
import { ApiCookieAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedTrackResponseDto } from 'src/track/dto/paginated-response-track.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('tracks')
@Controller('tracks')
@UseGuards(AuthGuard)
export class TracksController {
    constructor(private readonly trackService: TrackService) { }

    @Get('/search')
    @ApiCookieAuth()
    @ApiOperation({ summary: 'Search for tracks on the Spotify API by name' })
    @ApiQuery({
        name: 'name',
        required: true,
        description: 'Name of the track to search for',
        type: String
    })
    @ApiResponse({
        status: 200,
        description: 'Success. Returns a list of tracks.',
        type: PaginatedTrackResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request. The "name" parameter was not provided.'
    })
    @ApiResponse({
        status: 404,
        description: 'Not Found. The music is not found'
    })
    async searchTracks(@Query('name') name: string): Promise<PaginatedTrackResponseDto> {
        return this.trackService.getTracks(name);
    }
}
