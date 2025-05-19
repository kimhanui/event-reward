# 이벤트 보상 관리 시스템

## 개요

이벤트 생성, 보상 정의, 유저 보상 요청, 관리자 및 감사자 확인 기능 설계 및 구현

## 실행 방법

```
docker-compose up -d # 컨테이너 실행
docker-compose down  # 컨테이너 종료
```

테스트 데이터 주입 커맨드:

```
# 테스트 데이터 수동 입력 (powershell 기준)
Get-Content .\init\init-mongo.js `
  | docker-compose exec -T mongodb mongosh --username root --password test --authenticationDatabase admin mydb

# linux, max 기준
docker-compose exec -T mongodb mongosh --username root --password test --authenticationDatabase admin mydb < ./init/init-mongo.js
```

## 개발 환경

- macOS 15.4.1
- node.js 18
- nest.js 10
- docker
- `./auth`, `./event`, `./gateway` 폴더 안에 각각의 앱 소스코드와 Dockerfile이 있어 `docker-compose up --build` 로 전체를 빌드, 실행한다.
- docker-compose up -d 대신 build하는 이유: TS->JS로 빌드한 결과물만 담아 경량화 함. 개발 중 코드 강제 반영해주기 위함.

## 디렉토리 구조

- multi repo 로 구성
  > 서버 실행은 MSA 구조지만, 환경설정, prettier 등은 공통으로 적용할 것들이라 mono repo로 구성하려했으나... npm cli등 환경 설정에 시간을 많이 쓰지 않기 위해 multi module로 분리

## 설계

JWT:

- AT(access_token), RT(refresh_token)으로 구성
  - payload: id, role, expire_dt (expire_dt는 클라이언트에서 판단하여 서버 요청 횟수 줄이기 위함. 변조돼도 영향x.)
- 흐름:
  - login 시 AT, RT 발급 (db에 AT 만료예정일, RT값 저장)
  - -> 일정 시간이 지나면 AT 만료. 토큰갱신 API로 AT, RT를 갱신 (RT도 만료됐다면 실패 코드 반환.)
  - 요청 헤더(`Bearer `)에 AT를 포함하여 API 호출시 Gateway서버에서 JwtAuthGuard로 토큰 변조, 만료 여부 검증.
  - -> 성공 시 RoleAuthGuard에 의해 역할 검증. 통과시 Auth나 Event서버로 요청 전달됨.

유저 등록/역할 변경:

- 유저 등록은 누구나 가능. USER 역할로 고정.
- 역할 변경은 ADMIN 역할을 가진자만 가능.

이벤트 설계:

- 가상 이벤트 설정: 유저 출석 체크 3일 연속 시 보상 이벤트
  > 관련 테이블: `userattendances`, 출석체크 API: `GET /auth/user/attendance`
- 이벤트 하나에 여러개의 지급 조건, 여러개의 보상이 등록될 수 있음. (예시: 조건1,2,3 모두를 만족하면 보상1,2,3 모두를 지급한다.)
  > 단, 조건 별 보상 차등 지급은 불가함. (예시: 조건1을 만족했다고 보상1만 지급할 수 없음.)
- 유저에게 이벤트 '진행중' 여부를 노출한다면 start_dt, end_dt, active_yn 세 필드를 종합해 판단해야 함. (클라이언트 개발자가 있다면 이렇게 요청..)
- 이벤트 보상 요청은 실패 처리된 경우엔 여러번 요청 가능하다.
  > 단, 이미 '대기중' 또는 '성공' 처리된 경우 더이상 요청 불가함.

이벤트 중복 방지:

- 동시성 처리가 중요. 실무 기준이므로 다중 서버 환경을 가정한다.
- 전략 후보:
  1. MQ 사용 : 다중 서버 환경에서도 요청 순차 처리할 수 있다. 느리지만 정확히 해결한다. (단, 큐 여러개이면 큐 선택 규칙 세워 요청 순차 처리 유지 필요)
  2. Redis Lock 사용 : Lock에 의해 느려질 수 있으나 Redis의 빠른 read/write 성능으로 이를 보완할 수 있다. (Lock은 TTL 설정 필요)
  3. Mongo Lock 사용 : Lock에 의해 느려질 수 있으나 추가 기술 스펙 없이 해결할 수 있다.
  4. Mongo 원자적 연산 사용 : mongo는 tx없어도 한 문서에 대해선 원자적으로 처리하므로 unique 키를 삽입 시 에러 발생하면 중복 지급 방어 처리할 수 있다. 추가 기술 스펙 없이 해결 가능. ✅
- 해결 방법 요약: RewardRequestSchema에 partial index 생성하여 해결.

  ```
  export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
  RewardRequestSchema.index(
    { user_id: 1, event_id: 1},
    {
      unique: true,
      partialFilterExpression: { status: { $in: [0, 1] } } // 0,1 은 각 단건만 가능. 2는 다건 가능.
    }
  );

  ```
