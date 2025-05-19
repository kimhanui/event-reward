import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';

@Controller()
export class AppController {
  @Get('health')
  async health() {
    return 'Gateway Up';
  }

  // 테스트
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me() {
    return 'ok';
  }
}
