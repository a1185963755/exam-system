import { NestFactory } from '@nestjs/core';
import { AnalysisModule } from './analysis.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AnalysisModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.port ?? 3004);
}
bootstrap();
