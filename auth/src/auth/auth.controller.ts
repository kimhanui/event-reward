import { Body, Controller, Get, Post, Put, Req, Request } from '@nestjs/common';
import { LoginDTO, Payload, UserVO } from '../auth/auth.domain';
import { AuthService } from '../auth/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  async health() {
    return 'Auth Up';
  }

  @Post(['login'])
  async login(@Body() body: any) {
    const result = await this.authService.login(body);
    return result;
  }

  @Post(['logout'])
  async logout(@Body() body: any) {
    const result = await this.authService.logout(body.x_user_id, body);
    return result;
  }

  @Post('user')
  async insertUser(@Body() body: any) {
    // console.log("body:", body)
    const result = await this.authService.insertUser(body.x_user_id, body);
    return result;
  }

  @Put('user/role')
  async updateUser(@Body() body: any) {
    const result = await this.authService.updateUserRole(body.x_user_id, body);
    return result;
  }

  @Put('user/refresh/token')
  async refreshToken(@Req() req: any) {
    const result = await this.authService.refreshToken(req);
    return result;
  }
}
