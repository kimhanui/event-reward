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

// ? : 클라에서 요청id UUID로 만드는 방법은? 주기적으로 UUID가 변경되어 0,1 상태에서도 새 요청이 쌓일 수 밖에 없음 (정합성 문제)
// ? : 보상이 운영 중에 변경될 수도 있을까? 막아야할까? 안 막으면 처리 이력에 과거 지급한 대상이 뭔지 안 나올 수 있음. (당시 지급 내역을 embeded로 넣자)
export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
RewardRequestSchema.index(
  { user_id: 1, event_id: 1},
  {
    unique: true,
    partialFilterExpression: { status: { $in: [0, 1] } } // 0,1 은 각 단건만 가능. 2는 다건 가능.
  }
);
