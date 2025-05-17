import { NestFactory } from '@nestjs/core';
import { AppModule } from './gateway/app.module';
import { LoggingInterceptor } from './interceptor/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
