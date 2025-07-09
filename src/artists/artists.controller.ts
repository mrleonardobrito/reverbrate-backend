import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistDto } from './dtos/artists-response.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Artists')
@Controller('artists')
@UseGuards(AuthGuard)
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get(':id')
  @ApiOkResponse({ type: ArtistDto })
  @ApiOperation({ summary: 'Get an artist by id' })
  @ApiParam({ name: 'id', type: String, description: 'The id of the artist' })
  async getArtistById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<ArtistDto> {
    return this.artistsService.getArtistById(user.id, id);
  }
}
