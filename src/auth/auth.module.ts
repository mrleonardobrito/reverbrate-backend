import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SpotifyModule } from '../common/http/spotify/spotify.module';
import { AuthGuard } from './guards/auth.guard';
import { SpotifyService } from 'src/common/http/spotify/spotify.service';
import { YoutubeAuthStrategy } from './strategies/youtube-auth.strategy';
import { SpotifyAuthStrategy } from './strategies/spotify-auth.strategy';
import { AuthStrategyFactory } from './strategies/auth-strategy.factory';

@Module({
  imports: [ConfigModule, SpotifyModule],
  controllers: [AuthController],
  providers: [AuthService, SpotifyService, AuthGuard, AuthStrategyFactory, YoutubeAuthStrategy, SpotifyAuthStrategy],
  exports: [AuthService, AuthGuard],
})
export class AuthModule { }
