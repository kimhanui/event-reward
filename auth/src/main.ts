import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { LoggingInterceptor } from './interceptor/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(process.env.NODE_ENV === 'production' ? process.env.PORT : 4001);
}
bootstrap();
