import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TracksModule } from './track/track.module';
import { SpotifyHttpService } from './common/http/spotify/spotify-http.service';

@Module({
  imports: [
    AuthModule,
    TracksModule
  ],
})
export class AppModule { }