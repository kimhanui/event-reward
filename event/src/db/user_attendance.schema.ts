import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserAttendanceDocument = UserAttendance & Document;

// 연속 출석 기록 컬렉션 (이벤트 보상 조건용)
@Schema()
export class UserAttendance {
  @Prop({ required: true, unique: true })
  user_id: string; // 유저 id

  @Prop()
  last_check_dt: Date; // 마지막 출석일

  @Prop()
  check_cnt: number; // 연속 출석 일 수
}

export const UserAttendanceSchema = SchemaFactory.createForClass(UserAttendance);
UserAttendanceSchema.index({ check_cnt : -1});