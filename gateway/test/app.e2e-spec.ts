import axios from 'axios';
/**
 * $ docker-compose -f docker-compose.e2e.yml up -d
 * $ docker-compose exec -T event-reward-mongodb-1 mongosh --username root --password test --authenticationDatabase admin mydb < ./gateway/test/data/init-mongo.js
 */

describe('보상 지급 중복 방지 테스트', () => {
  it('100건 빠른 호출 중 duplicate key 로그가 발생해야 한다', async () => {
    const payload = {
      user_id: 'aaaa',
      event_id: '682b2dab2d62bcf149057b2a',
    };

    // 이벤트 보상 요청
    // axios.post('http://localhost:3000/api/reward/request/test', payload)

    const results = await Promise.allSettled(
        Array.from({ length: 1000 }).map(() =>
            axios.post('http://localhost:3000/api/reward/request/test', payload)
        )
    );

    // 실패 중에 Mongo duplicate key 에러가 있었는지 확인
    const hasDuplicateKeyError = results.some(
      (result) =>
        result.status === 'fulfilled' &&
        result.value?.data?.code === 'ERR001'
    );

    expect(hasDuplicateKeyError).toBe(false);
  });
});