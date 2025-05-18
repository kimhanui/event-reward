import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'src/db/event.schema';
import {
  EventCondition,
  EventConditionSchema
} from 'src/db/event_condition.schema';
import { Reward, RewardSchema } from 'src/db/reward.schema';
import {
  RewardRequest,
  RewardRequestSchema
} from 'src/db/reward_request.schema';
import { User, UserSchema } from 'src/db/user.schema';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Condition, ConditionSchema, UserAttendance, UserAttendanceSchema } from 'src/db/condition.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule, //이게 없으면 jwt 검증 x
    JwtModule.register({}),
    MongooseModule.forRoot('mongodb://localhost:27017/mydb'), // 이곳에 MongoDB 주소
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: Condition.name, schema: ConditionSchema },
      { name: EventCondition.name, schema: EventConditionSchema },
      { name: UserAttendance.name, schema: UserAttendanceSchema }
    ])
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule {}
