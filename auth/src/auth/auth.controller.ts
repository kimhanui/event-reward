import { Body, Controller, Post, Put, Req, Request } from '@nestjs/common';
import { LoginDTO, UserVO } from '../auth/auth.domain';
import { AuthService } from '../auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(['login'])
  async login(@Body() body: LoginDTO) {
    const result = await this.authService.login(body);
    return result;
  }

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

  @Put('user/role')
  async updateUser(@Body() body: UserVO) {
    const result = await this.authService.updateUserRole(body);
    return result;
  }

  @Put('user/refresh/token')
  async refreshToken(@Req() req: any) {
    const result = await this.authService.refreshToken(req);
    return result;
  }
}
