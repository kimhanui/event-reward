import { Body, Controller, Get, Post, Put, Query, Req } from '@nestjs/common';
import { EventService } from './event.service';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /* Event */

  @Get('health')
  async health() {
    return 'Event Up';
  }

  @Post()
  async insertEvent(@Body() req) {
    return await this.eventService.insertEvent(req.x_user_id, req);
  }

  @Put()
  async updateEvent(@Body() req) {
    return await await this.eventService.updateEvent(req.x_user_id, req);
  }

  @Get()
  async getEvent(@Query() req) {
    return await await this.eventService.getEvent(req.x_user_id, req);
  }

  @Get('/list')
  async getEventList(@Query() req) {
    return await await this.eventService.getEventList(req.x_user_id, req);
  }

  /* Reward */

  @Post('reward')
  async insertReward(@Body() req) {
    return await this.eventService.insertReward(req.x_user_id, req);
  }

  @Put('reward')
  async updateReward(@Body() req) {
    return await this.eventService.updateReward(req.x_user_id, req);
  }

  @Get('reward')
  async getReward(@Query() req) {
    return await this.eventService.getReward(req.x_user_id, req);
  }

  @Get('reward/list')
  async getRewardList(@Query() req) {
    return await this.eventService.getRewardList(req.x_user_id, req);
  }

  @Post('reward/request')
  async insertRewardRequest(@Body() req) {
    return await this.eventService.insertRewardRequest(req.x_user_id, req);
  }

  // 통합 테스트 용 API
  @Post('reward/request/test')
  async insertRewardRequestTest(@Body() req) {
    return await this.eventService.insertRewardRequest(req.x_user_id, req);
  }

  @Put('reward/request/confirm')
  async updateRewardRequestState(@Body() req) {
    return await this.eventService.updateRewardRequestState(req.x_user_id, req);
  }

  @Get('reward/request/list')
  async getRewardRequestAllUserList(@Query() req) {
    return await this.eventService.getRewardRequestAllUserList(req.x_user_id, req);
  }

  @Get('reward/request/list/my')
  async getRewardRequestMyList(@Query() req) {
    return await this.eventService.getRewardRequestMyList(req.x_user_id, req);
  }

  // 조건 만족 여부
  @Get('/user/success')
  async isUserEventSuccess(@Query() req) {
    if (req.query.user_id) {
      req.user = {
        userId: req.query.user_id
      };
    }
    return await this.eventService.isUserEventSuccessPublic(req.x_user_id, req);
  }

  // 출석체크
  @Get('/user/attendance')
  async userAttendance(@Query() req) {
    return await this.eventService.userAttendance(req.query.user_id);
  }
}
