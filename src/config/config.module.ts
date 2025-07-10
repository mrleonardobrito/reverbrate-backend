import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import Joi from 'joi';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: Joi.object({
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRES_IN: Joi.string().default('1h'),
                JWT_REFRESH_SECRET: Joi.string().required(),
                JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

                SPOTIFY_CLIENT_ID: Joi.string().required(),
                SPOTIFY_CLIENT_SECRET: Joi.string().required(),
                SPOTIFY_REDIRECT_URI: Joi.string().required().default('http://127.0.0.1:3001/auth/callback'),

                DATABASE_URL: Joi.string().required(),

                PORT: Joi.number().default(3000),
                NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

                CORS_ORIGIN: Joi.string().default('http://127.0.0.1:3000'),
                RATE_LIMIT_WINDOW_MS: Joi.string().default('15m'),
                RATE_LIMIT_MAX: Joi.number().default(100),
            }),
            validationOptions: {
                abortEarly: true,
            },
        }),
    ],
})
export class ConfigModule { } 