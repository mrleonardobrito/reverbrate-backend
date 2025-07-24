import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { TracksService } from './tracks.service';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/users/entities/user.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tracks')
@UseGuards(AuthGuard)
export class TracksController {

    constructor(private readonly tracksService: TracksService) { }

    @Get(':id')
    @ApiOperation({ summary: 'Get a track by ID' })
    @ApiResponse({ status: 200, description: 'The track has been successfully retrieved.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Track not found.' })
    async getTrack(@Param('id') id: string, @CurrentUser() user: User) {
        return this.tracksService.findById(user.id, id);
    }
}
