import { Controller, Get, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('proxy')
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Get('b/*')
  async proxyToB(@Req() req: Request, @Res() res: Response) {
    const url = `http://localhost:3001${req.url.replace('/proxy/b', '')}`;
    const result = await firstValueFrom(this.httpService.get(url));
    res.status(result.status).send(result.data);
    res.status(200);
  }

  @Get('c/*')
  async proxyToC(@Req() req: Request, @Res() res: Response) {
    const url = `http://localhost:3002${req.url.replace('/proxy/c', '')}`;
    const result = await firstValueFrom(this.httpService.get(url));
    res.status(result.status).send(result.data);
  }
}
