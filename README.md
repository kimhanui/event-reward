# 보상관리시스템
## 개요
이벤트 생성, 보상 정의, 유저 보상 요청, 관리자 및 감사자 확인 기능 설계 및 구현

## 실행 방법
```
docker-compose up --build -d
```

## 개발 환경
- macOS 15.4.1
- node.js 24.0.1
- nest.js 11(최신)
- docker
```
# mongodb 설치
docker pull mongodb/mongodb-community-server:latest
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest

# mongosh 설치
brew install mongosh
mongosh --port 27017
# 실행 : mongosh --port 27017

# docker 이미지 생성
docker build . -t <server-name>
docker container run -d -p 3000:3000 nest-docker
```
- `./auth`, `./event`, `./gateway` 폴더 안에 각각의 앱 소스코드와 Dockerfile이 있어 `docker-compose up --build` 로 전체를 빌드, 실행한다.
- docker-compose up -d 대신 build하는 이유: TS->JS로 빌드한 결과물만 담아 경량화 함. 개발 중 코드 강제 반영해주기 위함.

## 디렉토리 구조
* 서버 실행은 MSA 구조지만, 환경설정, prettier 등은 공통으로 적용할 것들이라 모노 레포 구조로 간다.
```aiignore

```

## 설계

JWT 설계
payload: id, role, expire_dt (expire_dt는 서버 요청 횟수 효율화용도. 변조돼도 영향x.)