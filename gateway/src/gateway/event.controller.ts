import { Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/auth.domain';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { RolesGuard } from 'src/jwt/role.guard';
import { RolesDecorator } from 'src/jwt/roles.decorator';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// TODO 서비스단 input에 더 구체적인 타입으로 넣기
@Controller('event')
export class EventController {
  private readonly EVENT_SERVER_URL = process.env.EVENT_SERVICE_URL;
  private readonly EVENT_PATH_PREFIX = '/event';
  private readonly REWARD_PATH_PREFIX = '/reward';
  private readonly EXTERNAL_PATH_PREFIX = '/external';

  constructor(private readonly httpService: HttpService) {}

  /* Event */

  @Get('health')
  async health() {
    return 'Event Up';
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Post()
  async insertEvent(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.EVENT_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.post(url, req));
    return result.data;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Put()
  async updateEvent(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.EVENT_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.put(url, req));
    return result.data;
  }

  @Get()
  async getEvent(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.EVENT_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.get(url, req));
    return result.data;
  }

  @Get('/list')
  async getEventList(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.EVENT_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.get(url, req));
    return result.data;
  }

  /* Reward */

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Post('reward')
  async insertReward(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.REWARD_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.post(url, req));
    return result.data;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Put('reward')
  async updateReward(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.REWARD_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.put(url, req));
    return result.data;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Get('reward')
  async getReward(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.REWARD_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.get(url, req));
    return result.data;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Get('reward/list')
  async getRewardList(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.REWARD_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.get(url, req));
    return result.data;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.USER, Role.ADMIN)
  @Post('reward/request')
  async insertRewardRequest(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.REWARD_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.post(url, req));
    return result.data;
  }

  // 통합 테스트 용 API
  @Post('reward/request/test')
  async insertRewardRequestTest(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.REWARD_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.post(url, req));
    return result.data;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Put('reward/request/confirm')
  async updateRewardRequestState(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.REWARD_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.put(url, req));
    return result.data;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.AUDITOR, Role.ADMIN)
  @Get('reward/request/list')
  async getRewardRequestAllUserList(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.REWARD_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.get(url, req));
    return result.data;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.USER, Role.ADMIN)
  @Get('reward/request/list/my')
  async getRewardRequestMyList(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.REWARD_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.get(url, req));
    return result.data;
  }

  // 조건 만족 여부
  @Get('/external/user/success')
  async isUserEventSuccess(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.EXTERNAL_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.get(url, req));
    return result.data;
  }

  @Get('/external/user/attendance')
  async userAttendance(@Req() req) {
    const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.EXTERNAL_PATH_PREFIX, '')}`;
    const result = await firstValueFrom(this.httpService.get(url, req));
    return result.data;
  }

  /* Condition (이벤트 추가/수정 사전 작업) */

  // 미사용
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @RolesDecorator(Role.ADMIN)
  // @Post('condition')
  // async insertConditionData(@Req() req) {
  //   const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.EVENT_PATH_PREFIX, '')}`;
  //   const result = await firstValueFrom(this.httpService.get(url));
  //   return result.data;
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @RolesDecorator(Role.ADMIN)
  // @Put('condition')
  // async updateConditionData(@Req() req) {
  //   const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.EVENT_PATH_PREFIX, '')}`;
  //   const result = await firstValueFrom(this.httpService.put(url));
  //   return result.data;
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @RolesDecorator(Role.ADMIN)
  // @Get('condition')
  // async getConditionData(@Req() req) {
  //   const url = `${this.EVENT_SERVER_URL}${req.url.replace(this.EVENT_PATH_PREFIX, '')}`;
  //   const result = await firstValueFrom(this.httpService.get(url));
  //   return result.data;
  // }
}
