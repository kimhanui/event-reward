import { Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Role } from '../auth/auth.domain';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { RolesGuard } from 'src/jwt/role.guard';
import { RolesDecorator } from 'src/jwt/roles.decorator';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Controller('auth')
export class AuthController {
  private readonly AUTH_SERVER_URL = process.env.AUTH_SERVICE_URL;
  private readonly AUTH_PATH_PREFIX = '/auth';

  constructor(private readonly httpService: HttpService) {}

  @Post(['login'])
  async login(@Req() req) {
    const url = `${this.AUTH_SERVER_URL}${req.url.replace(this.AUTH_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.post(url, req));
    return result.data;
  }

  @UseGuards(JwtAuthGuard)
  @Post(['logout'])
  async logout(@Req() req) {
    const url = `${this.AUTH_SERVER_URL}${req.url.replace(this.AUTH_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.post(url, req));
    return result.data;
  }

  @Post('user')
  async insertUser(@Req() req) {
    const url = `${this.AUTH_SERVER_URL}${req.url.replace(this.AUTH_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.post(url, req));
    return result.data;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.ADMIN)
  @Put('user/role')
  async updateUser(@Req() req) {
    const url = `${this.AUTH_SERVER_URL}${req.url.replace(this.AUTH_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.put(url, req));
    return result.data;
  }

  @UseGuards(JwtAuthGuard)
  @Put('user/refresh/token')
  async refreshToken(@Req() req: any) {
    const url = `${this.AUTH_SERVER_URL}${req.url.replace(this.AUTH_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.put(url, req));
    return result.data;
  }
}
