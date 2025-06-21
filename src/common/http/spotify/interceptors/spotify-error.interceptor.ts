import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

type SpotifyError = {
    statusCode: number;
    body: {
        error: {
            status: number;
            message: string;
        };
    };
};

@Injectable()
export class SpotifyErrorInterceptor implements NestInterceptor {
    private readonly logger = new Logger(SpotifyErrorInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                if (this.isSpotifyError(error)) {
                    this.logger.error(`Spotify API Error: ${error.body.error.message}`);
                    return throwError(() => this.handleSpotifyError(error));
                }
                return throwError(() => error);
            })
        );
    }

    private isSpotifyError(error: any): error is SpotifyError {
        return error?.statusCode !== undefined && error?.body?.error !== undefined;
    }

    private handleSpotifyError(error: SpotifyError): HttpException {
        const errorMessage = error.body?.error?.message || 'Unknown error in Spotify API';

        switch (error.statusCode) {
            case 401:
                return new HttpException(
                    'Access token expired or invalid',
                    HttpStatus.UNAUTHORIZED,
                    {
                        cause: errorMessage
                    }
                );
            case 403:
                return new HttpException(
                    'Access not authorized',
                    HttpStatus.FORBIDDEN,
                    {
                        cause: errorMessage
                    }
                );
            case 422:
            case 429:
                return new HttpException(
                    'Too many requests. Try again later',
                    HttpStatus.TOO_MANY_REQUESTS
                );
            case 404:
                return new HttpException(
                    'Resource not found in Spotify',
                    HttpStatus.NOT_FOUND,
                    {
                        cause: errorMessage
                    }
                );
            case 400:
                return new HttpException(
                    errorMessage,
                    HttpStatus.BAD_REQUEST,
                    {
                        cause: errorMessage
                    }
                );
            default:
                return new HttpException(
                    errorMessage,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    {
                        cause: errorMessage
                    }
                );
        }
    }
} 