use mydb;
db.users.insertMany([
	{
		_id: "admin",
		pw: "admin",
		role: "ADMIN",
		reg_dt: new Date(),
	},
	{
		_id: "aaaa",
		pw: "aaaa",
		role: "USER",
		reg_dt: new Date(),
	},
	{
		_id: "bbbb",
		pw: "bbbb",
		role: "USER",
		reg_dt: new Date(),
	},
	{
		_id: "oooo",
		pw: "oooo",
		role: "OPERATOR",
		reg_dt: new Date(),
	},
	{
		_id: "audi",
		pw: "audi",
		role: "AUDITOR",
		reg_dt: new Date(),
	},
]);
print('insert [users]: done');

db.events.insertOne(
	{
		"_id" : new ObjectId('665a2234567890abcdef5678'),
		"title": "이벤트1",
		"content": "테스트",
		"start_dt": new Date("2025-05-18T00:00:0Z"),
		"end_dt": "",
		"active_yn": true,
		"reward_manual_yn": false,
		"conditions": ["{\"user_id\": '%s', \"check_cnt\": {\"%gte\" : 3}}"],
		"reward_ids": [new ObjectId('665a3334567890abcdef9999'), new ObjectId('665a3334567890abcdef9998')],
	}
);
print('insert [events]: done');

db.rewards.insertMany([
	{
		"_id": new ObjectId('665a3334567890abcdef9999'),
		"type": "CP",
		"target_id": "cp123",
		"amount": 1,
		"event_ids": [new ObjectId('665a2234567890abcdef5678')]
	},
	{
		"_id": new ObjectId('665a3334567890abcdef9998'),
		"type": "CP",
		"target_id": "cp456",
		"amount": 1,
		"event_ids": [new ObjectId('665a2234567890abcdef5678')]
	}
]);
print('insert [rewards]: done');

db.userattendances.insertOne({
	user_id: "aaaa",
	last_check_dt: new Date("2025-05-21T00:00:0Z"),
	check_cnt: 3,
})
print('insert [userattendances]: done');
// initMongo()
// 실행: mongosh < init-mongo.js
// 인덱스 확인: db.tokens.getIndexes();
// 컬렉션 제거: db.getCollection(collName).drop();