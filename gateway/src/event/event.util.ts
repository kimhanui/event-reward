import { Types } from "mongoose";
import { EventDocument } from "src/db/event.schema";
import { Reward, RewardDocument } from "src/db/reward.schema";

// Reward -> Event 관계 동기화
export async function syncRewardEvents(rewardDoc: any, newRewardDoc: any, rewardModel: any, eventModel: any) {
  const rewardObjectId = rewardDoc._id;
  const newEventIds: string[] = newRewardDoc.event_ids?.map((id) => id.toString()) ?? [];
  
  const prevEventIds = rewardDoc.event_ids?.map((id) => id.toString()) ?? [];
  const newEventIdSet = new Set(newEventIds);

  // 2. 삭제 대상 
  const toRemove = prevEventIds
    .filter((id) => !newEventIdSet.has(id))
    .map((id) => new Types.ObjectId(id));

  // 3. 추가 대상 
  const toAdd = newEventIds
    .filter((id) => !prevEventIds.includes(id))
    .map((id) => new Types.ObjectId(id));

  // 4. 기존 연결 제거
  if (toRemove.length > 0) {
    await eventModel.updateMany(
      { _id: { $in: toRemove } },
      { $pull: { reward_ids: rewardObjectId } }
    );
  }

  // 5. 새 연결 추가
  if (toAdd.length > 0) {
    await eventModel.updateMany(
      { _id: { $in: toAdd } },
      { $addToSet: { reward_ids: rewardObjectId } }
    );
  }

  // 6. Reward 문서의 event_ids 동기화
  await rewardModel.updateOne({ _id: rewardObjectId }, newRewardDoc);
}



// Event -> Reward 관계 동기화
export async function syncEventRewards(
  eventDoc: any,
  newEventDoc: any,
  rewardModel: any,
  eventModel: any
) {
  const eventObjectId = eventDoc._id;
  const newRewardIds = newEventDoc.reward_ids?.map((id) => id.toString()) ?? [];

  const prevRewardIds = eventDoc.reward_ids?.map((id) => id.toString()) ?? [];
  const newRewardIdSet = new Set(newRewardIds);

  // 2. 삭제 대상 (기존에는 있었지만, 이제는 없는)
  const toRemove = prevRewardIds
    .filter((id) => !newRewardIdSet.has(id))
    .map((id) => new Types.ObjectId(id));
  // 3. 추가 대상 (이제는 있는데, 이전엔 없던)
  const toAdd = newRewardIds
    .filter((id) => !prevRewardIds.includes(id))
    .map((id) => new Types.ObjectId(id));

  // 4. 기존 reward → event 연결 제거
  if (toRemove.length > 0) {
    await rewardModel.updateMany(
      { _id: { $in: toRemove } },
      { $pull: { event_ids: eventObjectId } }
    );
  }

  // 5. 새로운 reward → event 연결 추가
  if (toAdd.length > 0) {
    await rewardModel.updateMany(
      { _id: { $in: toAdd } },
      { $addToSet: { event_ids: eventObjectId } }
    );
  }

  // 6. Event 문서의 reward_ids 갱신
  await eventModel.updateOne({ _id: eventObjectId }, newEventDoc);
}
