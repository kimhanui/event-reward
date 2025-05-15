import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your_jwt_secret', // TODO 환경변수로 분리
      signOptions: { expiresIn: '1h' }
    }),
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AppModule {}
