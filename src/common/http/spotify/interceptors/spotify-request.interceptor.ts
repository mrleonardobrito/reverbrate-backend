import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SpotifyService } from '../spotify.service';

@Injectable()
export class SpotifyRequestInterceptor implements NestInterceptor {
    private readonly logger = new Logger(SpotifyRequestInterceptor.name);

    constructor(private readonly spotifyService: SpotifyService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;

        const startTime = Date.now();

        return next.handle().pipe(
            tap({
                next: () => {
                    const endTime = Date.now();
                    const duration = endTime - startTime;

                    this.logger.log(
                        `Spotify API Request - Method: ${method} | URL: ${url} | Duration: ${duration}ms`
                    );
                },
            })
        );
    }
} 