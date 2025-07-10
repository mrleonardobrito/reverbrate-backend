import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SpotifyService } from '../spotify.service';

@Injectable()
export class SpotifyRequestInterceptor implements NestInterceptor {
    private readonly logger = new Logger(SpotifyRequestInterceptor.name);
    private readonly hiddenFields = ['access_token', 'refresh_token', 'code', 'state'];

    constructor(private readonly spotifyService: SpotifyService) { }


    private hideFieldsOnLog(string: string) {
        const regex = new RegExp(`(${this.hiddenFields.join('|')})=[^&\\s]+`, 'g');
        return string.replace(regex, '$1=***');
    }

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
                        this.hideFieldsOnLog(`Spotify API Request - Method: ${method} | URL: ${url} | Duration: ${duration}ms`)
                    );
                },
            })
        );
    }
} 