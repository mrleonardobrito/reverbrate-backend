import { Test, TestingModule } from '@nestjs/testing';
import { RankingsService } from './rankings.service';
import { Track } from '../tracks/entities/track.entity';
import { TrackDto, TrackWithReviewDto } from '../tracks/dtos/track-response.dto';
import { PaginatedResponse } from '../common/http/dtos/paginated-response.dto';
import { TrackerMapper } from 'src/tracks/mappers/to-paginated-track.mapper';

const mockRankingRepository = () => ({
  findBestTracksByRatingIds: jest.fn(),
});

const mockTrackRepository = () => ({
  findById: jest.fn(),
});

const mockSearchService = () => ({
  enrichTracksWithReviews: jest.fn(),
});

const mockUserRepository = () => ({});
const mockReviewRepository = () => ({});
const mockListRepository = () => ({});

describe('RankingsService', () => {
  let service: RankingsService;
  let rankingRepository: ReturnType<typeof mockRankingRepository>;
  let trackRepository: ReturnType<typeof mockTrackRepository>;
  let searchService: ReturnType<typeof mockSearchService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingsService,
        { provide: 'UserRepository', useFactory: mockUserRepository },
        { provide: 'ReviewRepository', useFactory: mockReviewRepository },
        { provide: 'ListRepository', useFactory: mockListRepository },
        { provide: 'RankingRepository', useFactory: mockRankingRepository },
        { provide: 'TrackRepository', useFactory: mockTrackRepository },
        { provide: 'SearchService', useFactory: mockSearchService },
      ],
    }).compile();

    service = module.get<RankingsService>(RankingsService);
    rankingRepository = module.get('RankingRepository');
    trackRepository = module.get('TrackRepository');
    searchService = module.get('SearchService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBestTracksByRating', () => {
    const mockUserId = 'user-123';
    const mockTrackIds = ['track-1', 'track-2'];
    const mockTrack1 = { id: 'track-1', name: 'Track One' } as Track;
    const mockTrack2 = { id: 'track-2', name: 'Track Two' } as Track;
    const mockPaginatedTrackDto: PaginatedResponse<TrackDto> = {
      data: [new TrackDto(mockTrack1), new TrackDto(mockTrack2)],
      total: 2, limit: 2, offset: 0, next: null, previous: null,
    };
    const mockFinalResponse: PaginatedResponse<TrackWithReviewDto> = {
      data: [new TrackWithReviewDto(mockTrack1, null, []), new TrackWithReviewDto(mockTrack2, null, [])],
      total: 2, limit: 2, offset: 0, next: null, previous: null,
    };
    
    jest.spyOn(TrackerMapper, 'fromTracksToPaginatedTrackDto').mockReturnValue(mockPaginatedTrackDto);

    it('deve retornar uma lista paginada de tracks enriquecidas', async () => {
      rankingRepository.findBestTracksByRatingIds.mockResolvedValue(mockTrackIds);
      trackRepository.findById.mockResolvedValueOnce(mockTrack1).mockResolvedValueOnce(mockTrack2);
      searchService.enrichTracksWithReviews.mockResolvedValue(mockFinalResponse);

      const result = await service.getBestTracksByRating(mockUserId);

      expect(result).toEqual(mockFinalResponse);
      expect(rankingRepository.findBestTracksByRatingIds).toHaveBeenCalledTimes(1);
      expect(trackRepository.findById).toHaveBeenCalledTimes(2);
      expect(TrackerMapper.fromTracksToPaginatedTrackDto).toHaveBeenCalledWith([mockTrack1, mockTrack2]);
      expect(searchService.enrichTracksWithReviews).toHaveBeenCalledWith(mockPaginatedTrackDto, mockUserId);
    });

    it('deve retornar uma resposta paginada vazia se não houver tracks ranqueadas', async () => {
      rankingRepository.findBestTracksByRatingIds.mockResolvedValue([]);
      
      const result = await service.getBestTracksByRating(mockUserId);
      
      expect(result.data).toEqual([]);
      expect(rankingRepository.findBestTracksByRatingIds).toHaveBeenCalledTimes(1);
      expect(trackRepository.findById).not.toHaveBeenCalled();
    });

    it('deve lançar um erro se uma track não for encontrada', async () => {
      rankingRepository.findBestTracksByRatingIds.mockResolvedValue(['track-1', 'missing-id']);
      trackRepository.findById.mockResolvedValueOnce(mockTrack1).mockResolvedValueOnce(null);

      await expect(service.getBestTracksByRating(mockUserId)).rejects.toThrow(
        'Track with id missing-id not found'
      );
    });
  });
});