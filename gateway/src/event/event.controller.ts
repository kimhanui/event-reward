import { Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/auth.domain';
import { RolesDecorator } from 'src/jwt/roles.decorator';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { RolesGuard } from 'src/jwt/role.guard';
import { EventService } from './event.service';

// TODO 서비스단 input에 더 구체적인 타입으로 넣기
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /* Condition (이벤트 추가/수정 사전 작업) */

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.ADMIN)
  @Post('condition')
  async insertConditionData(@Req() req) {
    return await this.eventService.insertCondition(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.ADMIN)
  @Put('condition')
  async updateConditionData(@Req() req) {
    return await this.eventService.updateCondition(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.ADMIN)
  @Get('condition')
  async getConditionData(@Req() req) {
    return await this.eventService.getConditionList(req);
  }

  /* Event */

  @Get('health')
  async health() {
    return 'Event Up';
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Post()
  async insertEvent(@Req() req) {
    return await this.eventService.insertEvent(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Post('reward')
  async insertReward(@Req() req) {
    return await this.eventService.insertReward(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Put('reward')
  async updateReward(@Req() req) {
    return await this.eventService.updateReward(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Get('reward')
  async getReward(@Req() req) {
    return await this.eventService.getReward(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Get('reward/list')
  async getRewardList(@Req() req) {
    return await this.eventService.getRewardList(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.USER, Role.ADMIN) // TODO: ADMIN - user_id 요청 데이터에?
  @Post('reward/request')
  async insertRewardRequest(@Req() req) {
    return await this.eventService.insertRewardRequest(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.ADMIN)
  @Put('reward/request/confirm')
  async updateRewardRequestState(@Req() req) {
    return await this.eventService.updateRewardRequestState(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.OPERATOR, Role.AUDITOR, Role.ADMIN)
  @Get('reward/request/list')
  async getRewardRequestAllUserList(@Req() req) {
    return await this.eventService.getRewardRequestAllUserList(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.USER, Role.ADMIN) // TODO: ADMIN - user_id 요청 데이터에?
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

  @Get('/user/attendance')
  async userAttendance(@Req() req) {
    // if (req.query.user_id) {
    //   req.user = {
    //     userId: req.query.user_id
    //   };
    // }

    return await this.eventService.userAttendance(req.query.user_id);
  }
}
