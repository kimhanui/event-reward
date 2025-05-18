import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ConditionDocument = Condition & Document;

// Condition은 배포 후 수정/삭제할 수 없다.
@Schema()
export class Condition {
  @Prop({ required: true })
  collection_name: string; // 컬렉션 이름

  @Prop({ required: true })
  field_name: string; // 필드 이름

  @Prop({ required: true })
  field_type: 'STRING' | 'NUMBER'; // 필드 타입

  @Prop({ required: true })
  user_field_name: string;

  @Prop({ required: true })
  where_clause: string;
}

export const ConditionSchema = SchemaFactory.createForClass(Condition);
ConditionSchema.index(
  { collection_name: 1, field_name: 1, field_type: 1 },
  { unique: true }
);


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