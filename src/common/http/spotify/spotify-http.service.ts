import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class SpotifyHttpService { 
    handleSpotifyApiError(error: any): HttpException {
        const statusCode =
            error.statusCode ||
            error.body?.error?.status ||
            HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            error.body?.error?.message ||
            error.message ||
            'Spotify API Error';

        switch (statusCode) {
            case 400:
                return new HttpException(`Bad Request: ${message}`, HttpStatus.BAD_REQUEST);
            case 401:
                return new HttpException(`Unauthorized: ${message}`, HttpStatus.UNAUTHORIZED);
            case 403:
                return new HttpException(`Forbidden: ${message}`, HttpStatus.FORBIDDEN);
            case 404:
                return new HttpException(`Not Found: ${message}`, HttpStatus.NOT_FOUND);
            case 429:
                return new HttpException(`Too Many Requests: ${message}`, HttpStatus.TOO_MANY_REQUESTS);
            case 500:
                return new HttpException(`Internal Server Error: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
            default:
                return new HttpException(`Spotify API Error: ${message}`, statusCode);
        }
    }

}