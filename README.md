# 보상관리시스템
## 개요
이벤트 생성, 보상 정의, 유저 보상 요청, 관리자 및 감사자 확인 기능 설계 및 구현

## 실행 방법
```
npm run start # docker compose 명령어로 수정!
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
## 디렉토리 구조
* 서버 실행은 MSA 구조지만, 환경설정, prettier 등은 공통으로 적용할 것들이라 모노 레포 구조로 간다.
```aiignore

```
