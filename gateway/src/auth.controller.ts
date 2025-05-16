import {
  Body,
  Controller, Get, Post, Query
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO, UserVO } from './auth.domain';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post(['login'])
  async login(@Body() body: LoginDTO) {
    const result = await this.authService.login(body);
    return result;
  }

  // @UseGuards(JwtAuthGuard) // 오류 원인: token이 없어서!
  @Post('user')
  async insertUser(@Body() body: UserVO) {
    const result = await this.authService.insertUser(body);
    return result;
  }

}
