import {
  Controller, Get
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

/**
 * Proxy 역할의 컨트롤러
 */
@Controller()
export class AppController {
  private readonly AUTH_SERVER_URL = 'http://localhost:3001';
  private readonly EVENT_SERVER_URL = 'http://localhost:3002';

  constructor(
    private readonly httpService: HttpService,
  ) {}

  @Get('health')
  async health() {
    return 'Gateway Up';
  }

  // TODO 주석 해제
  /* Auth Server */

  // @UseGuards(JwtAuthGuard)
  // @Get(['auth', 'auth/*'])
  // async proxyToAuthGet(@Req() req: Request) {
  //   const url = `${this.AUTH_SERVER_URL}${req.url.replace('/auth', '')}`;
  //   const result = await firstValueFrom(this.httpService.get(url));
  //   return result.data;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post(['auth', 'auth/*'])
  // async proxyToAuthPost(@Req() req: Request) {
  //   const url = `${this.AUTH_SERVER_URL}${req.url.replace('/auth', '')}`;
  //   const result = await firstValueFrom(this.httpService.post(url));
  //   return result.data;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Put(['auth', 'auth/*'])
  // async proxyToAuthPut(@Req() req: Request) {
  //   const url = `${this.AUTH_SERVER_URL}${req.url.replace('/auth', '')}`;
  //   const result = await firstValueFrom(this.httpService.put(url));
  //   return result.data;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(['auth', 'auth/*'])
  // async proxyToAuthDelete(@Req() req: Request) {
  //   const url = `${this.AUTH_SERVER_URL}${req.url.replace('/auth', '')}`;
  //   const result = await firstValueFrom(this.httpService.delete(url));
  //   return result.data;
  // }

  // /* Event Server */

  // @UseGuards(JwtAuthGuard)
  // @Get(['event', 'event/*'])
  // async proxyToEventGet(@Req() req: Request) {
  //   const url = `${this.EVENT_SERVER_URL}${req.url.replace('/event', '')}`;
  //   const result = await firstValueFrom(this.httpService.get(url));
  //   return result.data;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post(['event', 'event/*'])
  // async proxyToEventPost(@Req() req: Request) {
  //   const url = `${this.EVENT_SERVER_URL}${req.url.replace('/event', '')}`;
  //   const result = await firstValueFrom(this.httpService.post(url));
  //   return result.data;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Put(['event', 'event/*'])
  // async proxyToEventPut(@Req() req: Request) {
  //   const url = `${this.EVENT_SERVER_URL}${req.url.replace('/event', '')}`;
  //   const result = await firstValueFrom(this.httpService.put(url));
  //   return result.data;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(['event', 'event/*'])
  // async proxyToEventDelete(@Req() req: Request) {
  //   const url = `${this.EVENT_SERVER_URL}${req.url.replace('/event', '')}`;
  //   const result = await firstValueFrom(this.httpService.delete(url));
  //   return result.data;
  // }
}
