import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SearchModule } from './search/search.module';
import configuration from './config/configuration';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            envFilePath: '.env',
        }),
        PrismaModule,
        AuthModule,
        SearchModule,
        ReviewsModule,
        UsersModule
    ],
})
export class AppModule { }