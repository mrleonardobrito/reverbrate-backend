import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TracksModule } from './track/track.module';

@Module({
    imports: [PrismaModule, AuthModule, ConfigModule, TracksModule],
})
export class AppModule { }