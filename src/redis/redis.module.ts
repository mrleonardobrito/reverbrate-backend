import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: (configService: ConfigService) => {
                const host = configService.get('redis.host');
                const port = configService.get('redis.port');
                return new Redis({ host, port });
            },
            inject: [ConfigService],
        },
        RedisService,
    ],
    exports: [RedisService],
})
export class RedisModule { } 