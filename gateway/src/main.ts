import { NestFactory } from '@nestjs/core';
import { AppModule } from './gateway/gateway.module';
import { LoggingInterceptor } from './interceptor/log.interceptor';

async function bootstrap() {
  console.log('process.env.MONGO_URI', process.env.MONGO_URI);
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
