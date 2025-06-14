import { Types } from 'mongoose';
import { mapToUserVO, UserVO } from 'src/auth/auth.domain';
import { Event } from 'src/db/event.schema';
import { RewardDocument, RewardType } from 'src/db/reward.schema';
import { RewardRequestDocument } from 'src/db/reward_request.schema';

export interface EventVO {
  _id: string;
  title: string;
  content: string;
  start_dt: Date;
  end_dt: Date;
  active_yn: boolean;
  reward_manual_yn: boolean;
  //   conditions: EventConditionVO[];
  conditions: string[];
  reg_dt: Date;
  upd_dt: Date;
  reg_user_id: string;
  upd_user_id: string;
  reward_ids?: string[];
  rewards?: RewardVO[]; // populate 용 필드..
}

export interface EventConditionVO {
  condition_id: string;
  condition?: ConditionVO; // populate 용 필드
  cal_type: string;
  str_val: string;
  min_num: number;
  max_num: number;
  reg_dt: Date;
  upd_dt: Date;
}

export interface ConditionVO {
  _id: string;
  collection_name: string;
  field_name: string;
  field_type: string;
  user_field_name: string;
}

export interface RewardVO {
  _id: string;
  type: RewardType;
  target_id: string;
  amount: number;
  reg_dt: Date;
  upd_dt: Date;
  event_ids?: string[];
  events?: EventVO[];
}

export interface RewardRequestVO {
  _id: string;
  request_state: number;
  failed_reason: string;
  reg_dt: Date;
  upd_dt: Date;
  confirm_user_id?: string;

  user_id: string;
  user?: UserVO;

  event_id: string;
  event: EventVO;
  rewards: RewardVO[];
}

/**** event mapper ****/

export function mapToEventVO(eventDoc: any): EventVO {
  return {
    _id: eventDoc._id.toString(),
    title: eventDoc.title,
    content: eventDoc.content,
    start_dt: eventDoc.start_dt,
    end_dt: eventDoc.end_dt,
    active_yn: eventDoc.active_yn,
    reward_manual_yn: eventDoc.reward_manual_yn,
    reg_dt: eventDoc.reg_dt,
    upd_dt: eventDoc.upd_dt,
    reg_user_id: eventDoc.reg_user_id,
    upd_user_id: eventDoc.upd_user_id,

    // reward_ids: ObjectId[] -> string[]
    reward_ids:
      eventDoc.reward_ids?.map((reward: any) =>
        typeof reward === 'object' ? reward._id.toString() : reward.toString()
      ) ?? [],

    conditions: eventDoc.conditions
  };
}

export function mapToEventDocument(
  eventVO: EventVO
): Event | { _id: Types.ObjectId } {
  return {
    _id: new Types.ObjectId(eventVO._id),
    title: eventVO.title,
    content: eventVO.content,
    start_dt: eventVO.start_dt,
    end_dt: eventVO.end_dt,
    active_yn: eventVO.active_yn,
    reward_manual_yn: eventVO.reward_manual_yn,
    reg_dt: eventVO.reg_dt,
    upd_dt: eventVO.upd_dt,
    reg_user_id: eventVO.reg_user_id,
    upd_user_id: eventVO.upd_user_id,

    // string[] → ObjectId[]
    reward_ids: eventVO.reward_ids?.map((id) => new Types.ObjectId(id)) ?? [],

    conditions: eventVO.conditions
  };
}

/**** reward mapper ****/

export function mapToRewardVO(rewardDoc: any): RewardVO {
  return {
    _id: rewardDoc._id.toString(),
    type: rewardDoc.type,
    target_id: rewardDoc.target_id,
    amount: rewardDoc.amount,
    reg_dt: rewardDoc.reg_dt,
    upd_dt: rewardDoc.upd_dt,
    event_ids:
      rewardDoc.event_ids?.map((id: any) =>
        typeof id === 'object' ? id._id.toString() : id.toString()
      ) ?? []
  };
}

export function mapToRewardDocument(
  rewardDoc: RewardVO
): RewardDocument | { _id: Types.ObjectId } {
  return {
    _id: new Types.ObjectId(rewardDoc._id),
    type: rewardDoc.type,
    target_id: rewardDoc.target_id,
    amount: rewardDoc.amount,
    reg_dt: rewardDoc.reg_dt,
    upd_dt: rewardDoc.upd_dt,
    event_ids: rewardDoc.event_ids?.map((id) => new Types.ObjectId(id)) ?? []
  };
}

export function mapToRewardRequestVO(doc: RewardRequestDocument): RewardRequestVO {
  return {
    _id: doc._id.toString(),
    request_state: doc.request_state,
    failed_reason: doc.failed_reason,
    reg_dt: doc.reg_dt,
    upd_dt: doc.upd_dt,
    confirm_user_id: doc.confirm_user_id,

    user_id:
      typeof doc.user_id === 'object'
        ? doc.user_id._id?.toString()
        : doc.user_id,
    user:
      typeof doc.user_id === 'object' ? mapToUserVO(doc.user_id) : undefined,

    event_id:
      typeof doc.event_id === 'object'
        ? doc.event_id._id?.toString()
        : doc.event_id,
    event:
      typeof doc.event_id === 'object' ? mapToEventVO(doc.event_id) : undefined,

    rewards: doc.rewards?.map((reward) => {
        return {
          _id: (reward as any)._id,
          type: reward.type,
          target_id: reward.target_id,
          amount: reward.amount,
          reg_dt: reward.reg_dt,
          upd_dt: reward.upd_dt
        };})
  };
}

export function mapToRewardRequestDocument(vo: RewardRequestVO): any {
  return {
    request_state: vo.request_state,
    failed_reason: vo.failed_reason,
    reg_dt: vo.reg_dt,
    upd_dt: vo.upd_dt,
    confirm_user_id: vo.confirm_user_id,
    user_id: vo.user_id ? new Types.ObjectId(vo.user_id) : undefined,
    event_id: vo.event_id ? new Types.ObjectId(vo.event_id) : undefined
  };
}