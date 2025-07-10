import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AlbumRepository } from './interfaces/album-repository.interface';
import { ReviewsService } from 'src/reviews/reviews.service';
import { AlbumDto } from './dtos/albums-response.dto';
import { AlbumMapper } from './mapper/album.mapper';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject('AlbumRepository')
    private readonly albumRepository: AlbumRepository,
    private readonly reviewService: ReviewsService,
  ) { }

  async findById(userId: string, id: string): Promise<AlbumDto> {
    const album = await this.albumRepository.findById(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    const reviews = await this.reviewService.getAllReviews(userId, {
      limit: 1000000,
      offset: 0,
    });
    return AlbumMapper.toDto(album, reviews.data);
  }
}
