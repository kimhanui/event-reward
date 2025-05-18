use mydb;
db.dropDatabase();

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
		id: "bbbb",
		pw: "bbbb",
		role: "USER",
		reg_dt: new Date(),
	},
    {
		id: "oooo",
		pw: "oooo",
		role: "OPERATOR",
		reg_dt: new Date(),
	},
    {
		id: "audi",
		pw: "audi",
		role: "AUDITOR",
		reg_dt: new Date(),
	},
]);
print('insert [users]: done');


db.conditions.insertMany([
	{
		"_id": ObjectId('68295deed1ac5611691777f3'),
		"collection_name": "userattendances",
		"field_name": "day_cnt",
		"field_type": "number",
		"user_field_name": "user_id"
	}
]);
print('insert [conditions]: done');


db.events.insertMany([
	{
    "title": "이벤트1",
    "content": "테스트",
    "start_dt": "2025-05-18T05:05:11.723Z",
    "end_dt": "",
    "active_yn": false,
    "reward_manual_yn": false,
    "conditions": [{
        "condition_id":ObjectId('68295deed1ac5611691777f3'),
        "cal_type": "RG",
        // "str_val": "ANSWER"
        "min_num": 3
        // "max_num"
    }]
}
]);
print('insert [events]: done');


db.rewards.insertMany([
	{
    "title": "이벤트1",
    "content": "테스트",
    "start_dt": "2025-05-18T05:05:11.723Z",
    "end_dt": "",
    "active_yn": false,
    "reward_manual_yn": false,
    "conditions": [{
        "condition_id":"68295deed1ac5611691777f3",
        "cal_type": "RG",
        // "str_val": "ANSWER"
        "min_num": 3
        // "max_num"
    }]
}
]);
print('insert [events]: done');





// 실행: mongosh < init-mongo.js
// 인덱스 확인: db.tokens.getIndexes();
// 컬렉션 제거: db.getCollection(collName).drop();