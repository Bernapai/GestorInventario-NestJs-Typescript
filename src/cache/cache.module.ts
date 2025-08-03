import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // 5 minutos
      max: 100, // máximo 100 items en cache
      isGlobal: true, // disponible globalmente
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule { }