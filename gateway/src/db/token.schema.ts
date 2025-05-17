import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  type: string; // AT, RT

  @Prop()
  token: string;

  @Prop()
  expire_dt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

// TTL 동작시키기 위해 인덱스 설정
// 첫번째 인자: 인덱스를 1이면 오름차순, -1이면 내림차순으로 만든다. (목적이 정렬x, 만료시간 지난 문서 빠르게 찾기 위함)
TokenSchema.index({ expire_dt: 1 }, { expireAfterSeconds: 0 });

// 복합키
TokenSchema.index({user_id: 1, type: 1}, {unique: true})