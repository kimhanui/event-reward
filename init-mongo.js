// 사용할 DB 선택 (없으면 생성됨)
use mydb;
db.dropDatabase();

// users 컬렉션에 초기 데이터 삽입
db.users.insertMany([
	{
		id: "admin",
		pw: "admin",
		role: "ADMIN",
		reg_dt: new Date(),
	},
    {
		id: "aaaa",
		pw: "aaaa",
		role: "USER",
		reg_dt: new Date(),
	},
    {
		id: "aaab",
		pw: "aaaa",
		role: "USER",
		reg_dt: new Date(),
	},
]);

print('초기 유저 데이터 삽입 완료');

print('테스트 데이터: ');
db.users.findOne();

db.users.find()

// 실행: mongosh < init-mongo.js
// 인덱스 확인: db.tokens.getIndexes();