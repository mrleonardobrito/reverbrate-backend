import { Test, TestingModule } from '@nestjs/testing';
import { RankingsService } from './rankings.service';
import { Track } from '../tracks/entities/track.entity';
import { NotFoundException } from '@nestjs/common';

const mockRankingRepository = () => ({
  findBestTracksByRatingIds: jest.fn(),
});

const mockTrackRepository = () => ({
  findById: jest.fn(),
  findByIds: jest.fn(),
});

const mockUserRepository = () => ({
  findMostFollowedUsers: jest.fn(),
  findFollowers: jest.fn(),
});

const mockReviewRepository = () => ({
  findCountsByUsers: jest.fn(),
  findByUsers: jest.fn(),
  findManyByUserAndTracks: jest.fn(),
});

const mockListRepository = () => ({
  findCountsByUsers: jest.fn(),
});

describe('RankingsService', () => {
  let service: RankingsService;
  let rankingRepository: ReturnType<typeof mockRankingRepository>;
  let trackRepository: ReturnType<typeof mockTrackRepository>;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingsService,
        { provide: 'UserRepository', useFactory: mockUserRepository },
        { provide: 'ReviewRepository', useFactory: mockReviewRepository },
        { provide: 'ListRepository', useFactory: mockListRepository },
        { provide: 'RankingRepository', useFactory: mockRankingRepository },
        { provide: 'TrackRepository', useFactory: mockTrackRepository },
      ],
    }).compile();

    service = module.get<RankingsService>(RankingsService);
    rankingRepository = module.get('RankingRepository');
    trackRepository = module.get('TrackRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBestTracksByRating', () => {
    it('deve retornar uma lista de tracks ordenada pela avaliação', async () => {
      const mockTrackIds = ['track-id-1', 'track-id-2'];
      
      const mockTrack1: Track = {
        id: 'track-id-1',
        name: 'Bohemian Rhapsody',
        artist: 'Queen',
        artist_uri: 'spotify:artist:1dfeR4HaWDbWqFHLkxsg1d',
        album: 'A Night at the Opera',
        album_uri: 'spotify:album:1dfeR4HaWDbWqFHLkxsg1d',
        image: 'https://i.scdn.co/image/ab67616d0000b273e3b5e4b4b4b4b4b4b4b4b4b4',
        uri: 'spotify:track:3z8b6s4z3f7c5e5b4b4b4b4b4b4b4b4b',
        isrcId: 'GB-AHT-75-00001',
      } as Track;

      const mockTrack2: Track = {
        id: 'track-id-2',
        name: 'Stairway to Heaven',
        artist: 'Led Zeppelin',
        artist_uri: 'spotify:artist:36QJpDe2go2KgaRleHCDls',
        album: 'Led Zeppelin IV',
        album_uri: 'spotify:album:2L3s6a99sA3h2SHdC2Y4i6',
        image: 'https://i.scdn.co/image/ab67616d0000b2737a3c8e8b8b8b8b8b8b8b8b8b',
        uri: 'spotify:track:51pQ7v9i2a3M3c3x4y5z67',
        isrcId: 'US-AT2-71-00293',
      } as Track;

      rankingRepository.findBestTracksByRatingIds.mockResolvedValue(mockTrackIds);
      
      trackRepository.findById
        .mockResolvedValueOnce(mockTrack1)
        .mockResolvedValueOnce(mockTrack2);

      const result = await service.getBestTracksByRating();
      console.log(JSON.stringify(result, null, 2));

      expect(result).toEqual([mockTrack1, mockTrack2]);
      expect(result.length).toBe(2);
      expect(rankingRepository.findBestTracksByRatingIds).toHaveBeenCalledTimes(1);
      expect(trackRepository.findById).toHaveBeenCalledTimes(2);
      expect(trackRepository.findById).toHaveBeenCalledWith('track-id-1');
      expect(trackRepository.findById).toHaveBeenCalledWith('track-id-2');
    });

    it('deve retornar um array vazio se não houver tracks ranqueadas', async () => {
      rankingRepository.findBestTracksByRatingIds.mockResolvedValue([]);
      
      const result = await service.getBestTracksByRating();
      console.log(JSON.stringify(result, null, 2));

      expect(result).toEqual([]);
      expect(rankingRepository.findBestTracksByRatingIds).toHaveBeenCalledTimes(1);
      expect(trackRepository.findById).not.toHaveBeenCalled();
    });

    it('deve lançar um erro se uma track ranqueada não for encontrada', async () => {
      const mockTrackIds = ['track-id-1', 'missing-track-id'];
      const mockTrack1: Track = {
        id: 'track-id-1',
        name: 'Bohemian Rhapsody',
        artist: 'Queen',
        artist_uri: 'spotify:artist:1dfeR4HaWDbWqFHLkxsg1d',
        album: 'A Night at the Opera',
        album_uri: 'spotify:album:1dfeR4HaWDbWqFHLkxsg1d',
        image: 'https://i.scdn.co/image/ab67616d0000b273e3b5e4b4b4b4b4b4b4b4b4b4',
        uri: 'spotify:track:3z8b6s4z3f7c5e5b4b4b4b4b4b4b4b4b4',
        isrcId: 'GB-AHT-75-00001',
      } as Track;

      rankingRepository.findBestTracksByRatingIds.mockResolvedValue(mockTrackIds);
      
      trackRepository.findById
        .mockResolvedValueOnce(mockTrack1)
        .mockResolvedValueOnce(null);

      await expect(service.getBestTracksByRating()).rejects.toThrow(
        'Track with id missing-track-id not found',
      );

      expect(rankingRepository.findBestTracksByRatingIds).toHaveBeenCalledTimes(1);
      expect(trackRepository.findById).toHaveBeenCalledTimes(2);
    });
  });
});