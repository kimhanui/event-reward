import { Body, Controller, Post, Req, Request, UseGuards } from '@nestjs/common';
import { LoginDTO, Role, UserVO } from '../auth/auth.domain';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { RolesGuard } from 'src/jwt/role.guard';
import { Roles } from 'src/decorator/roles';
import { sendSuccess } from 'src/util/common.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(['login'])
  async login(@Body() body: LoginDTO) {
    const result = await this.authService.login(body);
    return result;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(['logout'])
  async logout(@Request() req) {
    const user = req.user;
    const result = await this.authService.logout(req.user);
    return result;
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  @Post('user')
  async insertUser(@Body() body: UserVO) {
    const result = await this.authService.insertUser(body);
    return result;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin')
  async xxx(@Body() body: UserVO) {
    return sendSuccess();
  }
}
