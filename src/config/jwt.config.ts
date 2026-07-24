import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get('JWT_SECRET'),
  signOptions: {
    expiresIn: configService.get('JWT_EXPIRATION'),
  },
});

export const getJwtRefreshConfig = (
  configService: ConfigService,
): JwtModuleOptions => ({
  secret: configService.get('JWT_REFRESH_SECRET'),
  signOptions: {
    expiresIn: configService.get('JWT_REFRESH_EXPIRATION'),
  },
});
