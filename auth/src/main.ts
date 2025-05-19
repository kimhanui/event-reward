import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  await app.listen(process.env.NODE_ENV === 'production' ? process.env.PORT : 4001);
}
bootstrap();
