import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { SearchRequest } from './dtos/search-request.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { TrackDto } from 'src/tracks/dtos/track-response.dto';
import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/users/entities/user.entity';

const mockTrack: TrackDto = {
  id: 'track-1',
  uri: 'spotify:track:track-1',
  name: 'Awesome Song',
  artist_name: 'The Mocks',
  artist_uri: 'spotify:artist:the-mocks',
  album_name: 'Mock Album',
  album_uri: 'spotify:album:mock-album',
  cover: 'cover.jpg',
  type: 'track',
  isrc_id: 'USMC10100001', // ADICIONADO
};

const mockPaginatedTracks: PaginatedResponse<TrackDto> = {
  data: [mockTrack],
  total: 1, limit: 10, offset: 0, next: null, previous: null,
};

const mockFollower1 = { id: 'follower-1', name: 'Follower One', nickname: 'follower1_nick', image: 'f1.jpg' } as User;
const mockFollower2 = { id: 'follower-2', name: 'Follower Two', nickname: 'follower2_nick', image: 'f2.jpg' } as User;

const mockReviewFromFollower1: Review = {
  id: 'review-1',
  userId: mockFollower1.id,
  trackId: mockTrack.id,
  rating: 5,
  comment: 'Review from follower 1',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: mockFollower1,
} as Review;

const mockReviewFromFollower2: Review = {
  id: 'review-2',
  userId: mockFollower2.id,
  trackId: mockTrack.id,
  rating: 4,
  comment: 'Review from follower 2',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: mockFollower2,
} as Review;

const mockUserRepository = () => ({ findFollowers: jest.fn() });
const mockReviewRepository = () => ({ findManyByUserAndTracks: jest.fn() });
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar a review da rede formatada como ReviewDto', async () => {
    const userId = 'user-main';
    const req: SearchRequest = { query: 'Track', type: 'track' };
    
    userRepository.findFollowers.mockResolvedValue([mockFollower1]);
    searchRepository.searchTrack.mockResolvedValue(mockPaginatedTracks);
    reviewRepository.findManyByUserAndTracks
      .mockResolvedValueOnce([]) 
      .mockResolvedValueOnce([mockReviewFromFollower1]);

    const result = await service.search(req, userId);
    console.log(JSON.stringify(result, null, 2));

    expect(result.tracks.data[0].network).toBeDefined();
    expect(result.tracks.data[0].network.length).toBe(1);
    
    const networkReview = result.tracks.data[0].network[0];

    expect(networkReview.rate).toBe(mockReviewFromFollower1.rating);
    expect(networkReview.comment).toBe(mockReviewFromFollower1.comment);
    expect(networkReview.created_by.id).toBe(mockFollower1.id);
    expect(networkReview.created_by.name).toBe(mockFollower1.name);

    expect(reviewRepository.findManyByUserAndTracks).toHaveBeenCalledTimes(2);
  });

  it('deve retornar network vazia quando o usuário não segue ninguém', async () => {
    const userId = 'user-main';
    const req: SearchRequest = { query: 'Track', type: 'track' };

    userRepository.findFollowers.mockResolvedValue([]);
    searchRepository.searchTrack.mockResolvedValue(mockPaginatedTracks);
    reviewRepository.findManyByUserAndTracks.mockResolvedValueOnce([]);

    const result = await service.search(req, userId);
    console.log(JSON.stringify(result, null, 2));

    expect(result.tracks.data[0].network).toEqual([]);
    expect(reviewRepository.findManyByUserAndTracks).toHaveBeenCalledTimes(1);
  });

  it('deve retornar reviews de múltiplos seguidores com a estrutura correta', async () => {
    const userId = 'user-main';
    const req: SearchRequest = { query: 'Track', type: 'track' };

    userRepository.findFollowers.mockResolvedValue([mockFollower1, mockFollower2]);
    searchRepository.searchTrack.mockResolvedValue(mockPaginatedTracks);
    
    reviewRepository.findManyByUserAndTracks
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([mockReviewFromFollower1])
      .mockResolvedValueOnce([mockReviewFromFollower2]);

    const result = await service.search(req, userId);
    console.log(JSON.stringify(result, null, 2));

    const networkReviews = result.tracks.data[0].network;
    expect(networkReviews.length).toBe(2);
    
    const followerIds = networkReviews.map(r => r.created_by.id);
    expect(followerIds).toContain(mockFollower1.id);
    expect(followerIds).toContain(mockFollower2.id);

    expect(reviewRepository.findManyByUserAndTracks).toHaveBeenCalledTimes(3);
  });
  
  it('deve retornar network vazia se os seguidores não tiverem reviews', async () => {
    const userId = 'user-main';
    const req: SearchRequest = { query: 'Track', type: 'track' };
    
    userRepository.findFollowers.mockResolvedValue([mockFollower1]);
    searchRepository.searchTrack.mockResolvedValue(mockPaginatedTracks);
    reviewRepository.findManyByUserAndTracks.mockResolvedValue([]);

    const result = await service.search(req, userId);
    console.log(JSON.stringify(result, null, 2));

    expect(result.tracks.data[0].network).toEqual([]);
    expect(reviewRepository.findManyByUserAndTracks).toHaveBeenCalledTimes(2);
  });
});