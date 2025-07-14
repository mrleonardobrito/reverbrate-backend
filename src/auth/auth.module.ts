import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SpotifyModule } from '../common/http/spotify/spotify.module';
import { AuthGuard } from './guards/auth.guard';
import { SpotifyService } from 'src/common/http/spotify/spotify.service';
import { PrismaProfileRepository } from './repositories/prisma-profile.repository';

@Module({
  imports: [ConfigModule, SpotifyModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    SpotifyService,
    AuthGuard,
    { provide: 'ProfileRepository', useClass: PrismaProfileRepository },
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
