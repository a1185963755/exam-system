import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGuard, CommonModule, HttpInterceptor } from '@app/common';
import { PrismaModule } from '@app/prisma';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ExcelModule } from '@app/excel';

@Module({
  imports: [PrismaModule, CommonModule, ExcelModule],
  controllers: [AnswerController],
  providers: [
    AnswerService,
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
export class AnswerModule {}
