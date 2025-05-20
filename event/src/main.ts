import { NestFactory } from '@nestjs/core';
import { EventModule } from './event/event.module';
import {LoggingInterceptor} from "./interceptor/log.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(EventModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(
    process.env.NODE_ENV === 'production' ? process.env.PORT : 4002
  );
}
bootstrap();
