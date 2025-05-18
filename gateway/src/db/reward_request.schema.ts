import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../auth/auth.domain';

export type RewardRequestDocument = RewardRequest & Document;

@Schema()
export class RewardRequest {
  @Prop()
  request_state: number; //	요청 상태 (0:요청, 1:성공, 2:실패)

  @Prop()
  failed_reason: string; //	실패 사유 (0:이미 보상, 1:조건 불충분)

  @Prop({ default: Date.now })
  reg_dt: Date;

  @Prop()
  upd_dt: Date;

  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  user_id: Types.ObjectId; //	요청한 유저 id

  @Prop({ type: [Types.ObjectId], ref: 'Event', required: true })
  event_id: Types.ObjectId; //	이벤트 id

  @Prop()
  confirm_user_id: string; //	처리 담당자 id (수동지급용)
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
