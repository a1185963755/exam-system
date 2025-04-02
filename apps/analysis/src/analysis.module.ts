import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { RedisModule } from '@app/redis';
import { PrismaModule } from '@app/prisma';
import { AuthGuard, CommonModule, HttpInterceptor } from '@app/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [RedisModule, PrismaModule, CommonModule],
  controllers: [AnalysisController],
  providers: [
    AnalysisService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptor,
    },
  ],
})
export class AnalysisModule {}
