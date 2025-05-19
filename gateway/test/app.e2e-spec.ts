import axios from 'axios';
import { MongoClient, ObjectId } from 'mongodb';
const initMongo = require('./data/init-mongo');
let db: any;
let client: any;

beforeAll(async () => {
  client = await MongoClient.connect('mongodb://root:test@localhost:27017');
  db = client.db('mydb');
  await initMongo();
  console.log("beforeAll done")
});


describe('보상 지급 중복 방지 테스트', () => {
  it('100건 빠른 호출 중 duplicate key 로그가 발생해야 한다', async () => {
    const payload = {
      user_id: 'aaaa',
      event_id: 'event1',
      reward_id: 'reward1'
    };

    // 이벤트 보상 요청
    axios.post('http://localhost:3000/api/reward/request', payload)

    const results = await Promise.allSettled(
        Array.from({ length: 100 }).map(() =>
            axios.post('http://localhost:3000/api/reward/request', payload)
        )
    );

    // 실패 중에 Mongo duplicate key 에러가 있었는지 확인
    const hasDuplicateKeyError = results.some(result =>
        result.status === 'rejected' &&
        result.reason?.response?.data?.message?.includes('E11000')
    );

    expect(hasDuplicateKeyError).toBe(true);
  });
});

afterAll(async () => {
  await client.close();
  console.log("afterAll done")
});