import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    AuthModule,
    PassportModule,
    JwtModule.register({}),
    /*{
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '1h' }
    }*/
    MongooseModule.forRoot('mongodb://localhost:27017/mydb'), // 이곳에 MongoDB 주소
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: []
})
export class AppModule {}
