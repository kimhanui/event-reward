import { NestFactory } from '@nestjs/core';
import { AppModule } from './gateway/gateway.module';
import { LoggingInterceptor } from './interceptor/log.interceptor';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { UserInjectInterceptor } from './interceptor/user.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new UserInjectInterceptor());
  const connection = app.get<Connection>(getConnectionToken());

  if (connection.readyState === 1) {
    console.log('🌱 [bootstrap] MongoDB already open');
  } else {
    connection.once('open', () => {
      console.log('🌱 [bootstrap] MongoDB connection opened');
    });
  }

  await app.listen(
    process.env.NODE_ENV === 'production' ? process.env.PORT : 4000
  );
}
bootstrap();
