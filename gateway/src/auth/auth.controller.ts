import { Body, Controller, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Post(['logout'])
  async logout(@Request() req) {
    const result = await this.authService.logout(req.user);
    return result;
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('user')
  async insertUser(@Body() body: UserVO) {
    const result = await this.authService.insertUser(body);
    return result;
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('user/role')
  async updateUser(@Body() body: UserVO) {
    const result = await this.authService.updateUserRole(body);
    return result;
  }

  @Put('user/refresh/token')
  async refreshToken(@Body() body: {refresh_token}) {
    const result = await this.authService.refreshToken(body);
    return result;
  }

  // 테스트
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin')
  async xxx(@Body() body: UserVO) {
    return sendSuccess();
  }
}
