import { Controller, Get, Post, Put, Req } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /* Event */

  @Get('health')
  async health() {
    return 'Event Up';
  }

  @Post()
  async insertEvent(@Req() req) {
    return await this.eventService.insertEvent(req);
  }

  @Put()
  async updateEvent(@Req() req) {
    return await await this.eventService.updateEvent(req);
  }

  @Get()
  async getEvent(@Req() req) {
    return await await this.eventService.getEvent(req);
  }

  @Get('/list')
  async getEventList(@Req() req) {
    return await await this.eventService.getEventList(req);
  }

  /* Reward */

  @Post('reward')
  async insertReward(@Req() req) {
    return await this.eventService.insertReward(req);
  }

  @Put('reward')
  async updateReward(@Req() req) {
    return await this.eventService.updateReward(req);
  }

  @Get('reward')
  async getReward(@Req() req) {
    return await this.eventService.getReward(req);
  }

  @Get('reward/list')
  async getRewardList(@Req() req) {
    return await this.eventService.getRewardList(req);
  }

  @Post('reward/request')
  async insertRewardRequest(@Req() req) {
    return await this.eventService.insertRewardRequest(req);
  }

  // 통합 테스트 용 API
  @Post('reward/request/test')
  async insertRewardRequestTest(@Req() req) {
    return await this.eventService.insertRewardRequest(req);
  }

  @Put('reward/request/confirm')
  async updateRewardRequestState(@Req() req) {
    return await this.eventService.updateRewardRequestState(req);
  }

  @Get('reward/request/list')
  async getRewardRequestAllUserList(@Req() req) {
    return await this.eventService.getRewardRequestAllUserList(req);
  }

  @Get('reward/request/list/my')
  async getRewardRequestMyList(@Req() req) {
    return await this.eventService.getRewardRequestMyList(req);
  }

  // 조건 만족 여부
  @Get('/user/success')
  async isUserEventSuccess(@Req() req) {
    if (req.query.user_id) {
      req.user = {
        userId: req.query.user_id
      };
    }
    return await this.eventService.isUserEventSuccessPublic(req);
  }

  // 출석체크
  @Get('/user/attendance')
  async userAttendance(@Req() req) {
    return await this.eventService.userAttendance(req.query.user_id);
  }
}
