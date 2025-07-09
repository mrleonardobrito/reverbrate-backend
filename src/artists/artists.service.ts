import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ArtistDto } from './dtos/artists-response.dto';
import { ArtistRepository } from './interface/artists-repository.interface';
import { ArtistsMapper } from './mappers/artists.mapper';
import { ReviewsService } from 'src/reviews/reviews.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject('ArtistRepository')
    private readonly artistRepository: ArtistRepository,
    private readonly reviewsService: ReviewsService,
  ) {}

  async getArtistById(userId: string, id: string): Promise<ArtistDto> {
    const artist = await this.artistRepository.findById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const reviews = await this.reviewsService.getAllReviews(userId, {
      limit: 10000000,
      offset: 0,
    });

    return ArtistsMapper.toDto(artist, reviews.data);
  }
}
