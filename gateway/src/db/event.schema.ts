import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EventCondition, EventConditionSchema } from './event_condition.schema';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  start_dt: Date;

  @Prop()
  end_dt: Date;

  @Prop()
  active_yn: boolean; // true: 활성, false: 비활성

  @Prop()
  reward_manual_yn: boolean; //	true: 수동지급 / false: 자동지급

  // FIXME: major issue : https://github.com/kimhanui/event-reward/issues/8#issuecomment-2888857168
  // @Prop({ type: [EventConditionSchema], required: true })
  // conditions: EventCondition[]; //	조건 (embedded array)

  @Prop({ required: true })
  conditions: string[];

  @Prop({ default: Date.now })
  reg_dt: Date;

  @Prop()
  upd_dt: Date;

  @Prop({ required: true })
  reg_user_id: string; //	등록자 (Admin)

  @Prop()
  upd_user_id: string; //	수정자 (Admin)

  @Prop({ type: [Types.ObjectId], ref: 'Reward' })
  reward_ids: Types.ObjectId[]; //	연결된 보상 ID 목록 (array)
}

// .populate('reward_ids'); 로 조회시 eager loading 가능

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ active_yn: -1, start_dt: 1, end_dt: -1 });
EventSchema.index({ reg_dt: 1 });
