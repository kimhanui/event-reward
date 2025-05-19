import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Condition,
  ConditionDocument,
} from 'src/db/condition.schema';
import { Event, EventDocument } from 'src/db/event.schema';
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
  isObjectId,
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
  mapToRewardRequestVO,
  mapToRewardVO,
  RewardRequestVO,
  RewardVO
} from './event.domain';
import { syncEventRewards, syncRewardEvents } from './event.util';
import { UserAttendance, UserAttendanceDocument } from '../db/user_attendance.schema';
import { Role } from 'src/auth/auth.domain';

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

    if (!conditionVO || !isObjectId(conditionVO._id)) {
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
    if (!eventVO || !isObjectId(eventVO._id)) {
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

    const findEvent = await this.eventDao.findById(eventVO._id);
    if (!findEvent) {
      return sendFail(ErrorCode.EVENT007);
    }

    eventVO.upd_dt = new Date();
    eventVO.upd_user_id = user.userId;
    const newEvent = mapToEventDocument(eventVO);
    // Object.assign(findEvent, updateEvent);
    // await findEvent.save();

    try {
      await syncEventRewards(
        findEvent,
        newEvent,
        this.rewardDao,
        this.eventDao
      );
    } catch (err) {
      console.error('syncEventRewards', err);
      return sendFail(ErrorCode.ERR001);
    }

    return sendSuccess();
  }

  async getEvent(req: any) {
    const eventVO = req.query as EventVO;
    if (!eventVO || !isObjectId(eventVO._id)) {
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

    if (!rewardVO && !isObjectId(rewardVO._id)) {
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

    try {
      await syncRewardEvents(
        findReward,
        newReward,
        this.rewardDao,
        this.eventDao
      );
    } catch (err) {
      console.error('syncRewardEvents', err);
      return sendFail(ErrorCode.ERR001);
    }

    return sendSuccess();
  }

  async getReward(req: any) {
    const rewardVO = req.query as RewardVO;
    if (!rewardVO || !isObjectId(rewardVO._id)) {
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

    console.log('rewardList', rewardList);
    const resultList = rewardList.map(mapToRewardVO);
    return sendSuccessList(page, size, resultList);
  }

  /**
   * 중복 보상 지급 대응 : 복합 고유 인덱스 키 활용
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
      !isObjectId(rewardRequestVO.event_id)
    ) {
      return sendFail(ErrorCode.PARAM002);
    }

    const eventDoc = await this.eventDao
      .findById(rewardRequestVO.event_id)
      .populate('reward_ids');
    // console.log('reward_ids:', eventDoc.reward_ids);

    if (!eventDoc) {
      return sendFail(ErrorCode.EVENT007);
    }

    // 이벤트 현재 진행중인지 검증
    const currDateTime = new Date();
    if (
      (eventDoc.start_dt && eventDoc.start_dt > currDateTime) ||
      (eventDoc.end_dt && eventDoc.end_dt < currDateTime) ||
      eventDoc.active_yn == false
    ) {
      return sendFail(ErrorCode.EVENT008);
    }

    // 요청 이력 검증
    const findRewardRequest = await this.rewardRequestDao.findOne({
      //0, 1은 둘 중 하나만 존재함.
      user_id: rewardRequestVO.user_id,
      event_id: rewardRequestVO.event_id,
      request_state: { $in: [0, 1] }
    });

    // console.log('findRewardRequest', findRewardRequest);

    // 존재할 경우 실패 처리
    if (findRewardRequest && findRewardRequest.request_state == 1) {
      return sendFail(ErrorCode.EVENT009);
    }
    if (findRewardRequest && findRewardRequest.request_state == 0) {
      return sendFail(ErrorCode.EVENT010);
    }

    let savedData = null;
    try {
      rewardRequestVO.request_state = 0;
      savedData = await this.rewardRequestDao.insertOne(rewardRequestVO);
    } catch (err) {
      if (err.code === 11000) {
        console.warn('reward request already pending:', err);
        return sendFail(ErrorCode.EVENT010);
      }
    }

    // 수동 보상 지급 시 처리 종료
    if (eventDoc.reward_manual_yn) {
      return sendSuccess(savedData);
    }

    // 자동 보상 지급 처리
    const fulfilledResult = await this.isUserEventFulfilled(
      rewardRequestVO.user_id,
      eventDoc.conditions
    );

    const result = await this.confirmRewardRequest(
      fulfilledResult,
      savedData,
      eventDoc.reward_ids
    );

    // test용
    if (result.code == 'ERR001') {
      return result;
    }
    return fulfilledResult;
  }

  async updateRewardRequestState(req: any) {
    const { user } = req;
    const rewardRequestVO = req.body as RewardRequestVO;
    if (!rewardRequestVO) {
      return sendFail(ErrorCode.PARAM001);
    }

    if (
      !rewardRequestVO.user_id ||
      !rewardRequestVO.event_id ||
      rewardRequestVO.event_id.length != 24 // TODO 다른쪽에도 적용하기
    ) {
      return sendFail(ErrorCode.PARAM002);
    }

    const eventVO = await this.eventDao
      .findById(rewardRequestVO.event_id)
      .populate('reward_ids');
    console.log('reward_ids:', eventVO.reward_ids);

    if (!eventVO) {
      return sendFail(ErrorCode.EVENT007);
    }

    // 현재 진행중인지 검증
    // const currDateTime = new Date()
    // if ((findEvent.start_dt && findEvent.start_dt > currDateTime) ||
    //     (findEvent.end_dt && findEvent.end_dt < currDateTime) ||
    //     findEvent.active_yn == false){
    //       return sendFail(ErrorCode.EVENT008);
    // }
  }

  async confirmRewardRequest(
    fulfilledResult: any,
    rewardRequestDoc: any,
    rewardsDoc?: any[]
  ) {
    if (fulfilledResult.code === 'OK') {
      rewardRequestDoc.request_state = 1; // 성공
      rewardRequestDoc.upd_dt = new Date();
      rewardRequestDoc.confirm_user_id = 'System';
      rewardRequestDoc.rewards = rewardsDoc.map((e) => ({
        _id: e._id,
        type: e.type,
        target_id: e.target_id,
        amount: e.amount
      }));

      try {
        fulfilledResult.value =
          await this.rewardRequestDao.insertOne(rewardRequestDoc);
      } catch (err) {
        // 이미 처리 됨
        if (err.code === 11000) {
          console.warn('reward request already successes:', err);
          return sendFail(ErrorCode.EVENT009);
        }
      }
    } else {
      rewardRequestDoc.request_state = 2; // 실패
      rewardRequestDoc.failed_reason = `${fulfilledResult.code}:${fulfilledResult.message}`; // 실패
      rewardRequestDoc.upd_dt = new Date();
      rewardRequestDoc.confirm_user_id = 'System';

      try {
        await this.rewardRequestDao.insertOne(rewardRequestDoc);
      } catch (err) {
        // 이미 처리 됨
        if (err.code === 11000) {
          console.warn('reward request already failed:', err);
          return sendFail(ErrorCode.EVENT012);
        }
      }
    }
    return sendSuccess();
  }

  async isUserEventFulfilled(userId: string, conditions: string[]) {
    // 지급 조건 검증
    for (const element of conditions) {
      let whereClause = util.format(element, userId);
      console.log('== fulfilled check whereClause:', whereClause);
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

    const findEvent = await this.eventDao.findById(query.event_id);

    // 지급 조건 검증
    return await this.isUserEventFulfilled(user.user_id, findEvent.conditions);
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
    const { user } = req;

    const page = req.query.page ?? 0;
    const size = req.query.size ?? 10;
    const search_user_id = req.query.user_id;
    const search_event_id = req.query.event_id;
    const search_request_state = req.query.request_state;
    console.log('req.query', req.query);

    const where_clause = {};
    if (search_user_id) where_clause['user_id'] = search_user_id;
    if (search_event_id) where_clause['event_id'] = search_event_id;
    if (search_request_state)
      where_clause['request_state'] = search_request_state;
    console.log('where_clause', where_clause);

    const userRequestList = await this.rewardRequestDao
      .find(where_clause)
      .sort({ reg_dt: -1 }) // 정렬 기준
      .skip(page * size) // page: 0부터 시작
      .limit(size);

    console.log(
      'userRequestList',
      userRequestList.filter((e) => typeof e.event_id === 'object')
    );
    const userRequestDTO = userRequestList.map(mapToRewardRequestVO);
    return sendSuccessList(page, size, userRequestDTO);
  }

  async getRewardRequestMyList(req: any) {
    const { user } = req;

    let user_id = user.userId;

    if (req.user.role == Role.ADMIN) {
      user_id = req.query.user_id;
    }

    const page = req.query.page ?? 0;
    const size = req.query.size ?? 10;

    const userRequestList = await this.rewardRequestDao
      .find({ user_id: user_id })
      .sort({ reg_dt: -1 }) // 정렬 기준
      .skip(page * size) // page: 0부터 시작
      .limit(size);

    const requestList = userRequestList.map(mapToRewardRequestVO);
    return sendSuccessList(page, size, requestList);
  }
}
