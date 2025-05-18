import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../auth/auth.domain';

export type RewardDocument = Reward & Document;

@Schema()
export class Reward {
  @Prop({ required: true })
  type: RewardType; // PT(포인트), IT(아이템), CP(쿠폰)

  @Prop({ required: true })
  target_id: string; //	지급 대상 id

  @Prop({ required: true })
  amount: number; //	수량

  @Prop({ default: Date.now })
  reg_dt: Date;

  @Prop()
  upd_dt: Date;

  // .populate('event_ids'); 로 조회시 eager loading 가능
  @Prop({ type: [Types.ObjectId], ref: 'Event' })
  event_ids: Types.ObjectId[]; //	소속 이벤트 id
}

export enum RewardType {
  PT="PT",
  IT="IT",
  CP="CP",
}


export const RewardSchema = SchemaFactory.createForClass(Reward);
RewardSchema.index({reg_dt: -1})