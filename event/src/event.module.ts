import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Condition,
  ConditionSchema,
} from 'src/db/condition.schema';
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
import { EventController } from './event/event.controller';
import { EventService } from './event/event.service';
import { UserAttendance, UserAttendanceSchema } from './db/user_attendance.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? process.env.MONGO_URI
        : 'mongodb://localhost:27017/mydb?authSource=admin'
    ),
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
