import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const createJwtConfig = (configService: ConfigService): JwtModuleOptions => ({
    secret: configService.get<string>('jwt.secret'),
    signOptions: {
        expiresIn: configService.get<string>('jwt.expiresIn', '1h'),
    },
}); 