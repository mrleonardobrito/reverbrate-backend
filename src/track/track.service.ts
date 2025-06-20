import { Injectable, Inject } from "@nestjs/common";
import { TrackResponseDto } from "./dto/track-response.dto";
import { TrackRepository } from "./interfaces/track-repository.interface";

@Injectable()
export class TrackService {
  constructor(
    @Inject('TrackRepository')
    private readonly trackRepository: TrackRepository
  ) { }

  getTracks(name: string): Promise<PaginatedResponse<TrackResponseDto>> {
    return this.trackRepository.getTracks(name);
  }
}