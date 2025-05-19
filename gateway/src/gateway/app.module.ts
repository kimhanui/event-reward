import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/db/user.schema';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EventModule } from 'src/event/event.module';
import mongoose from 'mongoose';


@Module({
  imports: [
    AuthModule,
    EventModule,
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: [MongooseModule]
})
export class AppModule {
}
