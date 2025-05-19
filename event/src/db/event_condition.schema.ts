// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import { Types } from 'mongoose';

// export type EventConditionDocument = EventCondition & Document;

// @Schema({ _id: false }) // _id 는 셍상하지 않는다.
// export class EventCondition {
//   @Prop({ type: Types.ObjectId, ref: 'Condition', required: true })
//   condition_id: Types.ObjectId;

//   /**
//    * 비교 연산자
//    * - 'string' type: equals
//    * - 'number' type: equals (min기준), range (min, max기준)
//    */
//   @Prop({ required: true })
//   cal_type: string | 'EQ' | 'RG'; // EQ (equals), RG(range)

//   @Prop()
//   str_val: string;

//   @Prop()
//   min_num: number;

//   @Prop()
//   max_num: number;

//   @Prop({ default: Date.now })
//   reg_dt: Date;

//   @Prop()
//   upd_dt: Date;
// }

// export const EventConditionSchema = SchemaFactory.createForClass(EventCondition);
// EventConditionSchema.index({ reg_dt: -1 });

