import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Token, TokenSchema } from '../db/token.schema';
import { User, UserSchema } from '../db/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
