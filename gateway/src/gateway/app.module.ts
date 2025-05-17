import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Token, TokenSchema } from 'src/db/token.schema';
import { User, UserSchema } from 'src/db/user.schema';

@Module({
  imports: [
    AuthModule,
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forRoot('mongodb://localhost:27017/mydb'), // 이곳에 MongoDB 주소
    MongooseModule.forFeature([
          { name: Token.name, schema: TokenSchema },
          { name: User.name, schema: UserSchema }
        ]),
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: []
})
export class AppModule {}
