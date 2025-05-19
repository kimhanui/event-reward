import { Module } from '@nestjs/common';
import { Event, EventSchema } from 'src/db/event.schema';
import { Reward, RewardSchema } from 'src/db/reward.schema';
import {
  RewardRequest,
  RewardRequestSchema
} from 'src/db/reward_request.schema';
import { User, UserSchema } from 'src/db/user.schema';
import { UserAttendance, UserAttendanceSchema } from "../db/user_attendance.schema";
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? process.env.MONGO_URI
        : 'mongodb://localhost:27017/mydb?authSource=admin',
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: UserAttendance.name, schema: UserAttendanceSchema }
    ])
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule {}
