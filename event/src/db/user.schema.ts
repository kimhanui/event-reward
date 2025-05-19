import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/auth.domain';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  _id: string;

  @Prop()
  pw: string;

  @Prop()
  role: Role;

  @Prop({ default: Date.now })
  reg_dt: Date;

  @Prop()
  upd_dt: Date;

  @Prop()
  expire_dt: Date; // access token 만료일. (로그인: duration만큼 뒤, 로그아웃: 현재시간으로 업데이트)

  @Prop()
  refresh_token: string; // 기기 하나 기준.
}

export const UserSchema = SchemaFactory.createForClass(User);