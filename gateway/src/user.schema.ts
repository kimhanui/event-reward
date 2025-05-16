import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from './auth.domain';

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
}

export const UserSchema = SchemaFactory.createForClass(User);