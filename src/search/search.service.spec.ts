import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { SearchRequest } from './dtos/search-request.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { TrackDto } from 'src/tracks/dtos/track-response.dto';
import { Review } from 'src/reviews/entities/review.entity';

const mockUserRepository = () => ({
  findFollowers: jest.fn(),
  findById: jest.fn(),
});
const mockReviewRepository = () => ({
  findManyByUserAndTracks: jest.fn(),
});
const mockSearchRepository = () => ({
  searchTrack: jest.fn(),
  searchArtist: jest.fn(),
  searchAlbum: jest.fn(),
});

describe('SearchService', () => {
  let service: SearchService;
  let userRepository: ReturnType<typeof mockUserRepository>;
  let reviewRepository: ReturnType<typeof mockReviewRepository>;
  let searchRepository: ReturnType<typeof mockSearchRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: 'UserRepository', useFactory: mockUserRepository },
        { provide: 'ReviewRepository', useFactory: mockReviewRepository },
        { provide: 'SearchRepository', useFactory: mockSearchRepository },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    userRepository = module.get('UserRepository');
    reviewRepository = module.get('ReviewRepository');
    searchRepository = module.get('SearchRepository');
  });

  it('deve retornar os dados da network dos followings do usuário no search de tracks', async () => {
    const userId = 'user-main';
    const followingId = 'user-following';
    const trackId = 'track-1';
    const reviewId = 'review-1';

    userRepository.findFollowers.mockResolvedValue([followingId]);

    const paginatedTracks: PaginatedResponse<TrackDto> = {
      data: [{ id: trackId, uri: 'uri', type: 'track', name: 'Track 1', artist_name: 'Artist', cover: 'cover' }],
      total: 1, limit: 1, offset: 0, next: null, previous: null
    };
    searchRepository.searchTrack.mockResolvedValue(paginatedTracks);

    const review: Review = {
      id: reviewId,
      userId: followingId,
      trackId: trackId,
    } as any;
    reviewRepository.findManyByUserAndTracks.mockResolvedValue([review]);

    userRepository.findById.mockResolvedValue({ id: followingId, name: 'Following', image: 'img.jpg' });

    const req: SearchRequest = { query: 'Track', type: 'track' } as any;
    const result = await service.search(req, userId);
    console.log(JSON.stringify(result, null, 2));

    expect(result.tracks.data[0].network).toBeDefined();
    expect(result.tracks.data[0].network.length).toBe(1);
    expect(result.tracks.data[0].network[0].createdDBy).toEqual({
      id: followingId,
      name: 'Following',
      image: 'img.jpg',
    });
    expect(result.tracks.data[0].network[0].review).toBeDefined();
  });

  it('deve retornar network vazia quando o usuário não segue ninguém', async () => {
    const userId = 'user-main';
    userRepository.findFollowers.mockResolvedValue([]);
    const paginatedTracks: PaginatedResponse<TrackDto> = {
      data: [{ id: 'track-1', uri: 'uri', type: 'track', name: 'Track 1', artist_name: 'Artist', cover: 'cover' }],
      total: 1, limit: 1, offset: 0, next: null, previous: null
    };
    searchRepository.searchTrack.mockResolvedValue(paginatedTracks);
    reviewRepository.findManyByUserAndTracks.mockResolvedValue([]);
    const req: SearchRequest = { query: 'Track', type: 'track' } as any;
    const result = await service.search(req, userId);
    expect(result.tracks.data[0].network).toEqual([]);
  });

  it('deve retornar network com múltiplos followings e reviews', async () => {
    const userId = 'user-main';
    const followingIds = ['user-following-1', 'user-following-2'];
    const trackId = 'track-1';
    userRepository.findFollowers.mockResolvedValue(followingIds);
    const paginatedTracks: PaginatedResponse<TrackDto> = {
      data: [{ id: trackId, uri: 'uri', type: 'track', name: 'Track 1', artist_name: 'Artist', cover: 'cover' }],
      total: 1, limit: 1, offset: 0, next: null, previous: null
    };
    searchRepository.searchTrack.mockResolvedValue(paginatedTracks);
    const reviews: Review[] = [
      { id: 'review-1', userId: 'user-following-1', trackId } as any,
      { id: 'review-2', userId: 'user-following-2', trackId } as any,
    ];
    reviewRepository.findManyByUserAndTracks.mockImplementation((userId: string) => {
      return Promise.resolve(reviews.filter(r => r.userId === userId));
    });
    userRepository.findById.mockImplementation((id: string) => Promise.resolve({ id, name: `Name-${id}`, image: `${id}.jpg` }));
    const req: SearchRequest = { query: 'Track', type: 'track' } as any;
    const result = await service.search(req, userId);
    
    console.log(JSON.stringify(result, null, 2));
    expect(result.tracks.data[0].network.length).toBe(2);
    expect(result.tracks.data[0].network[0].createdDBy).toEqual({ id: 'user-following-1', name: 'Name-user-following-1', image: 'user-following-1.jpg' });
    expect(result.tracks.data[0].network[1].createdDBy).toEqual({ id: 'user-following-2', name: 'Name-user-following-2', image: 'user-following-2.jpg' });
  });

  it('deve retornar network vazia quando não há reviews dos followings', async () => {
    const userId = 'user-main';
    const followingIds = ['user-following-1', 'user-following-2'];
    userRepository.findFollowers.mockResolvedValue(followingIds);
    const paginatedTracks: PaginatedResponse<TrackDto> = {
      data: [{ id: 'track-1', uri: 'uri', type: 'track', name: 'Track 1', artist_name: 'Artist', cover: 'cover' }],
      total: 1, limit: 1, offset: 0, next: null, previous: null
    };
    searchRepository.searchTrack.mockResolvedValue(paginatedTracks);
    reviewRepository.findManyByUserAndTracks.mockResolvedValue([]);
    const req: SearchRequest = { query: 'Track', type: 'track' } as any;
    const result = await service.search(req, userId);
    expect(result.tracks.data[0].network).toEqual([]);
  });

  it('deve lidar com userId inválido (usuário não autenticado)', async () => {
    const userId = undefined as any;
    userRepository.findFollowers.mockResolvedValue([]);
    const paginatedTracks: PaginatedResponse<TrackDto> = {
      data: [{ id: 'track-1', uri: 'uri', type: 'track', name: 'Track 1', artist_name: 'Artist', cover: 'cover' }],
      total: 1, limit: 1, offset: 0, next: null, previous: null
    };
    searchRepository.searchTrack.mockResolvedValue(paginatedTracks);
    reviewRepository.findManyByUserAndTracks.mockResolvedValue([]);
    const req: SearchRequest = { query: 'Track', type: 'track' } as any;
    const result = await service.search(req, userId);
    expect(result.tracks.data[0].network).toEqual([]);
  });
}); 