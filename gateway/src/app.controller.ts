import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './jwt.guard';
import { AuthService } from './auth.service';

/**
 * Proxy 역할의 컨트롤러
 */

@Controller()
export class AppController {
  private readonly AUTH_SERVER_URL = 'http://localhost:3001';
  private readonly EVENT_SERVER_URL = 'http://localhost:3002';

  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService
  ) {}

  @Get('health')
  async health(@Req() req: Request, @Res() res: Response) {
    res.status(200).send('Gateway Up');
  }

  /* Auth Server */
  /**
   * 토큰 발급 (임시 api)
   * @param req
   * @param res
   */
  @Get(['login'])
  async tmpLogin(@Req() req: Request, @Res() res: Response) {
    const result = this.authService.login(req.query);
    console.log("result", result);
    res.status(200).send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get(['auth', 'auth/*'])
  async proxyToAuthGet(@Req() req: Request, @Res() res: Response) {
    const url = `${this.AUTH_SERVER_URL}${req.url.replace('/auth', '')}`;
    const result = await firstValueFrom(this.httpService.get(url));
    res.status(result.status).send(result.data);
  }

  @UseGuards(JwtAuthGuard)
  @Post(['auth', 'auth/*'])
  async proxyToAuthPost(@Req() req: Request, @Res() res: Response) {
    const url = `${this.AUTH_SERVER_URL}${req.url.replace('/auth', '')}`;
    const result = await firstValueFrom(this.httpService.post(url));
    res.status(result.status).send(result.data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(['auth', 'auth/*'])
  async proxyToAuthPut(@Req() req: Request, @Res() res: Response) {
    const url = `${this.AUTH_SERVER_URL}${req.url.replace('/auth', '')}`;
    const result = await firstValueFrom(this.httpService.put(url));
    res.status(result.status).send(result.data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(['auth', 'auth/*'])
  async proxyToAuthDelete(@Req() req: Request, @Res() res: Response) {
    const url = `${this.AUTH_SERVER_URL}${req.url.replace('/auth', '')}`;
    const result = await firstValueFrom(this.httpService.delete(url));
    res.status(result.status).send(result.data);
  }

  /* Event Server */

  @UseGuards(JwtAuthGuard)
  @Get(['event', 'event/*'])
  async proxyToEventGet(@Req() req: Request, @Res() res: Response) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace('/event', '')}`;
    const result = await firstValueFrom(this.httpService.get(url));
    res.status(result.status).send(result.data);
  }

  @UseGuards(JwtAuthGuard)
  @Post(['event', 'event/*'])
  async proxyToEventPost(@Req() req: Request, @Res() res: Response) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace('/event', '')}`;
    const result = await firstValueFrom(this.httpService.post(url));
    res.status(result.status).send(result.data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(['event', 'event/*'])
  async proxyToEventPut(@Req() req: Request, @Res() res: Response) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace('/event', '')}`;
    const result = await firstValueFrom(this.httpService.put(url));
    res.status(result.status).send(result.data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(['event', 'event/*'])
  async proxyToEventDelete(@Req() req: Request, @Res() res: Response) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace('/event', '')}`;
    const result = await firstValueFrom(this.httpService.delete(url));
    res.status(result.status).send(result.data);
  }
}
