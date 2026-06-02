import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  app.useGlobalFilters(new AllExceptionsFilter());
   app.enableCors({
    origin: process.env.WEB_URL,
    credentials: true,
  });
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
