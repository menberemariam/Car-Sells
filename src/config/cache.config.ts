import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

export const getCacheConfig = (
  configService: ConfigService,
): CacheModuleOptions => ({
  isGlobal: true,
  ttl: 60 * 60 * 24,
});
