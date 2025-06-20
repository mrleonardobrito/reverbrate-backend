import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class PrismaRequestInterceptor implements NestInterceptor {
    private readonly logger = new Logger(PrismaRequestInterceptor.name);

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
                        `Prisma Request - Method: ${method} | URL: ${url} | Duration: ${duration}ms`
                    );
                },
                error: (error) => {
                    const endTime = Date.now();
                    const duration = endTime - startTime;

                    this.logger.error(
                        `Prisma Request Failed - Method: ${method} | URL: ${url} | Duration: ${duration}ms | Error: ${error.message}`
                    );
                },
            })
        );
    }
}