import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../db/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? process.env.MONGO_URI
        : 'mongodb://localhost:27017/mydb?authSource=admin',
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService]
  // exports: [AuthService]
})
export class AuthModule {}
