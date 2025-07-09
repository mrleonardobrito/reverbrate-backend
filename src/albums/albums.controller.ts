import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/users/entities/user.entity';
import { AlbumDto } from './dtos/albums-response.dto';

@Controller('albums')
@ApiTags('Albums')
@UseGuards(AuthGuard)
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get an album by id' })
  @ApiParam({ name: 'id', description: 'The id of the album' })
  @ApiResponse({
    status: 200,
    description: 'The album',
    type: AlbumDto,
  })
  async findById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.albumsService.findById(user.id, id);
  }
}
