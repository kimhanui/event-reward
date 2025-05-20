import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/db/user.schema';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { AppController } from './gateway.controller';
import { AppService } from './gateway.service';
import { AuthController } from './auth.controller';
import { EventController } from './event.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? process.env.MONGO_URI
        : 'mongodb://localhost:27017/mydb?authSource=admin'
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule
  ],
  controllers: [AppController, AuthController, EventController],
  providers: [AppService, JwtStrategy],
  exports: [MongooseModule]
})
export class AppModule {}
