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