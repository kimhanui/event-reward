import { Body, Controller, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { LoginDTO, Role, UserVO } from '../auth/auth.domain';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { RolesGuard } from 'src/jwt/role.guard';
import { RolesDecorator } from 'src/jwt/roles.decorator';
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

  @Post('user')
  async insertUser(@Body() body: UserVO) {
    const result = await this.authService.insertUser(body);
    return result;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.ADMIN)
  @Put('user/role')
  async updateUser(@Body() body: UserVO) {
    const result = await this.authService.updateUserRole(body);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('user/refresh/token')
  async refreshToken(@Req() req: any) {
    const result = await this.authService.refreshToken(req);
    return result;
  }
}
