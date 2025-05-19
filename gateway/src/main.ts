import { NestFactory } from '@nestjs/core';
import { AppModule } from './gateway/gateway.module';
import { LoggingInterceptor } from './interceptor/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(
    process.env.NODE_ENV === 'production' ? process.env.PORT : 4000
  );
}
bootstrap();
