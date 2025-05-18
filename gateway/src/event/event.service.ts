import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Condition,
  ConditionDocument,
  UserAttendance,
  UserAttendanceDocument
} from 'src/db/condition.schema';
import { EventDocument } from 'src/db/event.schema';
import {
  EventCondition,
  EventConditionDocument
} from 'src/db/event_condition.schema';
import { Reward, RewardDocument, RewardType } from 'src/db/reward.schema';
import {
  RewardRequest,
  RewardRequestDocument
} from 'src/db/reward_request.schema';
import { User, UserDocument } from 'src/db/user.schema';
import {
  ErrorCode,
  sendFail,
  sendSuccess,
  sendSuccessList
} from 'src/util/common.util';
import * as util from 'util';
import {
  ConditionVO,
  EventVO,
  mapToEventDocument,
  mapToEventVO,
  mapToRewardDocument,
  mapToRewardVO,
  RewardRequestVO,
  RewardVO
} from './event.domain';
import { syncEventRewards, syncRewardEvents } from './event.util';

/**
 * JWT 유효성 검사 메서드
 * 역할 검사 메서드
 */
@Injectable()
export class EventService {
  constructor(
    @InjectModel(User.name) private userDao: Model<UserDocument>,
    @InjectModel(Event.name) private eventDao: Model<EventDocument>,
    @InjectModel(Reward.name) private rewardDao: Model<RewardDocument>,
    @InjectModel(UserAttendance.name)
    private userAttendanceDao: Model<UserAttendanceDocument>,
    @InjectModel(RewardRequest.name)
    private rewardRequestDao: Model<RewardRequestDocument>,

    @InjectModel(Condition.name)
    private conditionDao: Model<ConditionDocument>,
    @InjectModel(EventCondition.name)
    private eventConditionDao: Model<EventConditionDocument>
  ) {}

  async insertCondition(req: any) {
    const { user } = req;
    const conditionVO = req.body as ConditionVO;

    if (!conditionVO) {
      return sendFail(ErrorCode.PARAM001);
    }

    if (
      !conditionVO.collection_name ||
      !conditionVO.field_name ||
      !conditionVO.field_type ||
      !conditionVO.user_field_name
    ) {
      return sendFail(ErrorCode.PARAM002);
    }

    const isExistCondition = await this.conditionDao.findOne({
      collection_name: conditionVO.collection_name,
      field_name: conditionVO.field_name,
      field_type: conditionVO.field_type
    });
    if (isExistCondition) {
      return sendFail(ErrorCode.EVENT004);
    }

    const savedCondition = await this.conditionDao.create(conditionVO);

    return sendSuccess(savedCondition);
  }

  async updateCondition(req: any) {
    const { user } = req;
    const conditionVO = req.body as ConditionVO;

    if (!conditionVO || !conditionVO._id) {
      return sendFail(ErrorCode.PARAM001);
    }

    if (
      !conditionVO.collection_name ||
      !conditionVO.field_name ||
      !conditionVO.field_type ||
      !conditionVO.user_field_name
    ) {
      return sendFail(ErrorCode.PARAM002);
    }

    const findCondition = await this.conditionDao.findById(conditionVO._id);
    if (!findCondition) {
      return sendFail(ErrorCode.EVENT006);
    }

    const isExistCondition = await this.conditionDao.exists({
      _id: { $ne: conditionVO._id },
      collection_name: conditionVO.collection_name,
      field_name: conditionVO.field_name,
      field_type: conditionVO.field_type
    });
    console.log('isExist', isExistCondition);
    if (isExistCondition) {
      return sendFail(ErrorCode.EVENT004);
    }

    Object.assign(findCondition, conditionVO);
    await findCondition.save();

    return sendSuccess();
  }

  async getConditionList(req: any) {
    const { user } = req;
    const query = req.query;

    if (!query) {
      return sendFail(ErrorCode.PARAM001);
    }

    const page = query.page ?? 0;
    const size = query.size ?? 0;
    const findConditionList = await this.conditionDao
      .find()
      .sort({ reg_dt: -1 }) // 정렬 기준
      .skip(page * size) // page: 0부터 시작
      .limit(size);

    return sendSuccessList(page, size, findConditionList);
  }

  // TODO conditions, reward_ids 등록 잘 되는지 검증.
  async insertEvent(req: any) {
    const { user } = req;
    const eventVO = req.body as EventVO;
    if (!eventVO) {
      return sendFail(ErrorCode.PARAM001);
    }

    if (!eventVO.title || !eventVO.content) {
      return sendFail(ErrorCode.PARAM002);
    }
    if (
      eventVO.start_dt &&
      eventVO.end_dt &&
      eventVO.start_dt > eventVO.end_dt
    ) {
      return sendFail(ErrorCode.EVENT001);
    }
    if (eventVO.active_yn && !eventVO.reward_ids?.length) {
      return sendFail(ErrorCode.EVENT002);
    }
    if (!eventVO.reward_manual_yn && !eventVO.conditions?.length) {
      return sendFail(ErrorCode.EVENT003);
    }

    eventVO.reg_user_id = user.userId;
    const newEventVO = mapToEventDocument(eventVO);

    const savedEvent = await this.eventDao.create(newEventVO);

    return savedEvent;
  }

  async updateEvent(req: any) {
    const { user } = req;
    const eventVO = req.body as EventVO;
    if (!eventVO || !eventVO._id) {
      return sendFail(ErrorCode.PARAM001);
    }

    if (!eventVO._id || !eventVO.title || !eventVO.content) {
      return sendFail(ErrorCode.PARAM002);
    }
    if (
      eventVO.start_dt &&
      eventVO.end_dt &&
      eventVO.start_dt > eventVO.end_dt
    ) {
      return sendFail(ErrorCode.EVENT001);
    }
    if (eventVO.active_yn && !eventVO.reward_ids?.length) {
      return sendFail(ErrorCode.EVENT002);
    }
    if (!eventVO.reward_manual_yn && !eventVO.conditions?.length) {
      return sendFail(ErrorCode.EVENT003);
    }

    const findEvent = await this.eventDao.findById(eventVO._id);
    if(!findEvent) {
      return sendFail(ErrorCode.EVENT007);
    }

    eventVO.upd_dt = new Date();
    eventVO.upd_user_id = user.userId;
    const newEvent = mapToEventDocument(eventVO);
    // Object.assign(findEvent, updateEvent);
    // await findEvent.save();

    try{
      await syncEventRewards(findEvent, newEvent, this.rewardDao, this.eventDao);
    } catch(err) {
      console.error('syncEventRewards', err);
      return sendFail(ErrorCode.ERR001)
    }
    
    return sendSuccess();
  }

  async getEvent(req: any) {
    const eventVO = req.params as EventVO;
    if (!eventVO || !eventVO._id) {
      return sendFail(ErrorCode.PARAM001);
    }

    const findEvent = await this.eventDao.findById(eventVO._id);
    const resultEvent = mapToEventVO(findEvent);
    return sendSuccess(resultEvent);
  }

  async getEventList(req: any) {
    const page = req.query.page ?? 0;
    const size = req.query.size ?? 10;

    const findEventList = await this.eventDao
      .find()
      .sort({ reg_dt: -1 }) // 정렬 기준
      .skip(page * size) // page: 0부터 시작
      .limit(size);
    const eventVOList = findEventList.map(mapToEventVO);
    return sendSuccessList(page, size, eventVOList);
  }

  async insertReward(req: any) {
    const { user } = req;
    const rewardVO = req.body as RewardVO;

    if (!rewardVO) {
      return sendFail(ErrorCode.PARAM001);
    }

    if (
      !Object.values(RewardType).includes(rewardVO.type) ||
      !rewardVO.target_id ||
      !rewardVO.amount
    ) {
      return sendFail(ErrorCode.PARAM002);
    }

    const savedReward = await this.rewardDao.create(rewardVO);

    return sendSuccess(savedReward);
  }

  async updateReward(req: any) {
    const { user } = req;
    const rewardVO = req.body as RewardVO;

    if (!rewardVO && !rewardVO._id) {
      return sendFail(ErrorCode.PARAM001);
    }

    if (
      !Object.values(RewardType).includes(rewardVO.type) ||
      !rewardVO.target_id ||
      rewardVO.amount < 1
    ) {
      return sendFail(ErrorCode.PARAM002);
    }

    const findReward = await this.rewardDao.findById(rewardVO._id);

    if (!findReward) {
      return sendFail(ErrorCode.EVENT011);
    }
    const newReward = mapToRewardDocument(rewardVO);
    try{
      await syncRewardEvents(
        findReward,
        newReward,
        this.rewardDao,
        this.eventDao
      );
    } catch(err) {
      console.error('syncRewardEvents', err);
      return sendFail(ErrorCode.ERR001)
    }
    // // Object.assign(findReward, mapToRewardDocument(rewardVO));
    // // findReward.save();
    
    // const originEventIds = findReward.event_ids;
    // const updateResult = await this.rewardDao.updateOne(
    //   { _id: rewardVO._id },
    //   mapToRewardDocument(rewardVO) ,
    //   {
    //     $addToSet: {
    //       event_ids: {
    //         $each: rewardVO.event_ids.map((id) => new Types.ObjectId(id))
    //       }
    //     }
    //   }
    // );

    // if (rewardVO.event_ids?.length > 0){
    //   // reward - event
    //   await this.eventDao.updateMany(
    //     {
    //       _id: { $in: rewardVO.event_ids.map((id) => new Types.ObjectId(id)) }
    //     },
    //     { $addToSet: { event_ids: new Types.ObjectId(rewardVO._id) } }
    //   );
    // }


    return sendSuccess();
  }

  async getReward(req: any) {
    const rewardVO = req.query as RewardVO;
    if (!rewardVO || !rewardVO._id) {
      return sendFail(ErrorCode.PARAM001);
    }

    const findReward = await this.rewardDao.findById(rewardVO._id);
    const resultVO = mapToRewardVO(findReward);

    return sendSuccess(resultVO);
  }

  async getRewardList(req: any) {
    const page = req.query.page ?? 0;
    const size = req.query.size ?? 10;

    const rewardList = await this.rewardDao
      .find()
      .sort({ reg_dt: -1 }) // 정렬 기준
      .skip(page * size) // page: 0부터 시작
      .limit(size);

    console.log("rewardList", rewardList)
    const resultList = rewardList.map(mapToRewardVO);
    return sendSuccessList(page, size, resultList);
  }

  /**
   * 중복 보상 지급 대응:
   * 1. throttling: 1s?
   * 2. 
   */
  async insertRewardRequest(req: any) {
    const { user } = req;
    const rewardRequestVO = req.body as RewardRequestVO;
    if (!rewardRequestVO) {
      return sendFail(ErrorCode.PARAM001);
    }
    rewardRequestVO.user_id = user.userId;
    if (
      !rewardRequestVO.user_id ||
      !rewardRequestVO.event_id ||
      rewardRequestVO.event_id.length != 24 // TODO 다른쪽에도 적용하기
    ) {
      return sendFail(ErrorCode.PARAM002);
    }

    const eventVO = await this.eventDao.findById(rewardRequestVO.event_id);
    if (!eventVO) {
      return sendFail(ErrorCode.EVENT007);
    }

    // 이벤트 현재 진행중인지 검증
    const currDateTime = new Date();
    if (
      (eventVO.start_dt && eventVO.start_dt > currDateTime) ||
      (eventVO.end_dt && eventVO.end_dt < currDateTime) ||
      eventVO.active_yn == false
    ) {
      return sendFail(ErrorCode.EVENT008);
    }

    // 쿼리 생성
    const whereClause: any = {
      user_id: rewardRequestVO.user_id,
      event_id: rewardRequestVO.event_id,
      request_state: { $in: [0, 1] } // 0,1은 1건만 존재. 2는 다건 존재가능.
    };

    const findRewardRequest = await this.rewardRequestDao
      .findOne(whereClause)
      .sort({ request_state: -1 })
      .limit(1);

    if (findRewardRequest.request_state == 1) {
      return sendFail(ErrorCode.EVENT009);
    }
    if (findRewardRequest.request_state == 0) {
      return sendFail(ErrorCode.EVENT010);
    }

    const savedData = await this.rewardRequestDao.create(rewardRequestVO);

    if (eventVO.reward_manual_yn) {
      return sendSuccess(savedData);
    }

    // 자동 보상 지급 처리
    const resultUserSuccess = await this.isUserEventSuccess(user.user_id, eventVO.conditions);
    if(resultUserSuccess.code === 'OK') {
      savedData.request_state = 1 // 성공
      savedData.upd_dt = new Date();
      savedData.confirm_user_id = 'System';
      
      const resultData = savedData.save();
      resultUserSuccess.value = resultData;
    } else {
      savedData.request_state = 2; // 실패
      savedData.upd_dt = new Date();
      savedData.confirm_user_id = 'System';

      savedData.save();
    }

    return resultUserSuccess;
  }

  async updateRewardRequestState(req: any) {
    throw new Error('Method not implemented.');

    // 현재 진행중인지 검증
    // const currDateTime = new Date()
    // if ((findEvent.start_dt && findEvent.start_dt > currDateTime) ||
    //     (findEvent.end_dt && findEvent.end_dt < currDateTime) ||
    //     findEvent.active_yn == false){
    //       return sendFail(ErrorCode.EVENT008);
    // }
  }

  async isUserEventSuccess(userId: string, conditions: string[]) {
    // 지급 조건 검증
    for (let i = 0; i < conditions.length; i++) {
      let whereClause = conditions[i];
      whereClause = util.format(whereClause, userId);
      console.log('whereClause:', whereClause);
      const parsed = JSON.parse(whereClause);

      const result = await this.userAttendanceDao.exists(parsed);

      if (!result) {
        return sendFail(ErrorCode.EVENT005);
      }
    }
    return sendSuccess();
  }
  async isUserEventSuccessPublic(req: any) {
    const { user } = req;
    const query = req.query;

    const findEvent = await this.eventDao
      .findById(query.event_id)
      // .populate('conditions.condition_id'); // fixme: 지워도 되나?

    // 지급 조건 검증
    return await this.isUserEventSuccess(user.user_id, findEvent.conditions);
  }

  // FIXME: major issue - conditions 필드
  /**
   *
   * @param userId
   * @param eventCondition populated('condition_id)
   */
  // private async isUserEventSuccess(
  //   userId: string,
  //   eventCondition: EventCondition[]
  // ) {
  //   for (let i = 0; i < eventCondition.length; i++) {
  //     const eventCond = eventCondition[i];
  //     const con = eventCond.condition_id as unknown as Condition;

  //     const collectionName = con.collection_name;
  //     const userFieldName = con.user_field_name;

  //     // const whereClause = Object.assign(
  //     //   {
  //     //     [userFieldName]: userId
  //     //   },
  //     //   this.buildCondition(eventCond)
  //     // );
  //     let whereClause = con.where_clause;
  //     whereClause = util.format(whereClause, userId);
  //     // console.log('whereCluase:', whereClause);
  //     const parsed = JSON.parse(whereClause);

  //     // FIXME: mongoose 연결 정보가 없어 실행자체가 안 됨
  //     // FIXME: 실행되면 where_clause, user_field_name 으로만 사용해보기
  //     // exists 쿼리
  //     const condResult = await mongoose.connection
  //       .collection(collectionName)
  //       .findOne(parsed, { projection: { _id: 1 } });

  //     if (!condResult) {
  //       return Object.assign(sendFail(ErrorCode.EVENT005), { value: con });
  //     }
  //   }
  //   return sendSuccess();
  // }

  // buildCondition(eventCond: EventCondition) {
  //   const cond = eventCond.condition_id;
  //   const { field_name, field_type } = cond as unknown as Condition;
  //   if (eventCond.cal_type === 'EQ' && eventCond.str_val) {
  //     return {
  //       [field_name]:
  //         field_type === 'STRING' ? eventCond.str_val : eventCond.min_num
  //     };
  //   }
  //   if (eventCond.cal_type === 'RG') {
  //     const val = {};
  //     if (eventCond.min_num !== undefined) {
  //       val['$gte'] = eventCond.min_num;
  //     }
  //     if (eventCond.max_num !== undefined) {
  //       val['$lte'] = eventCond.max_num;
  //     }
  //     return { [field_name]: val };
  //   }
  //   return {};
  // }

  async userAttendance(user_id: string) {
    if (!user_id) {
      return sendFail(ErrorCode.PARAM001);
    }
    console.log('user_id:', user_id);
    const result = await this.userAttendanceDao.updateOne(
      { user_id: user_id },
      {
        $set: { last_check_dt: new Date() },
        $inc: { check_cnt: 1 }
      },
      { upsert: true }
    );
    if (result.upsertedCount > 0) {
      console.log('새 문서가 추가됨');
    } else if (result.modifiedCount > 0) {
      console.log('기존 문서가 수정됨');
    }
    return sendSuccess();
  }
  async getRewardRequestAllUserList(req: any) {
    throw new Error('Method not implemented.');
  }
  async getRewardRequestMyList(req: any) {
    throw new Error('Method not implemented.');
  }
}
