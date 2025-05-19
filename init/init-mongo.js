use mydb;

// pw: 모두 admin
db.users.insertMany([
	{
		_id: "admin",
		pw: "$2b$10$AEcaV08zNAdYbZGeghZ.tusWLoWJcKI76tc97yzJMP0XY3tK2oFfq", 
		role: "ADMIN",
		reg_dt: ISODate(),
	},
	{
		_id: "aaaa",
		pw: "$2b$10$AEcaV08zNAdYbZGeghZ.tusWLoWJcKI76tc97yzJMP0XY3tK2oFfq",
		role: "USER",
		reg_dt: ISODate(),
	},
	{
		_id: "bbbb",
		pw: "$2b$10$AEcaV08zNAdYbZGeghZ.tusWLoWJcKI76tc97yzJMP0XY3tK2oFfq",
		role: "USER",
		reg_dt: ISODate(),
	},
	{
		_id: "oooo",
		pw: "$2b$10$AEcaV08zNAdYbZGeghZ.tusWLoWJcKI76tc97yzJMP0XY3tK2oFfq",
		role: "OPERATOR",
		reg_dt: ISODate(),
	},
	{
		_id: "audit",
		pw: "$2b$10$AEcaV08zNAdYbZGeghZ.tusWLoWJcKI76tc97yzJMP0XY3tK2oFfq",
		role: "AUDITOR",
		reg_dt: ISODate(),
	},
]);
print('insert [users]: done');

db.events.insertOne({
	"_id": ObjectId("665a2234567890abcdef5678"),
	"title": "이벤트1",
	"content": "테스트",
	"start_dt": ISODate("2025-05-18T00:00:00Z"),
	"end_dt": "",
	"active_yn": true,
	"reward_manual_yn": false,
	"conditions": ["{\"user_id\": \"%s\", \"check_cnt\": {\"$gte\": 3}}"],
	"reward_ids": [ObjectId("665a3334567890abcdef9999"), ObjectId("665a3334567890abcdef9998")],
});
print('insert [events]: done');

db.rewards.insertMany([
	{
		"_id": ObjectId("665a3334567890abcdef9999"),
		"type": "CP",
		"target_id": "cp123",
		"amount": 1,
		"event_ids": [ObjectId("665a2234567890abcdef5678")]
	},
	{
		"_id": ObjectId("665a3334567890abcdef9998"),
		"type": "CP",
		"target_id": "cp456",
		"amount": 1,
		"event_ids": [ObjectId("665a2234567890abcdef5678")]
	}
]);
print('insert [rewards]: done');

db.userattendances.insertOne({
	user_id: "aaaa",
	last_check_dt: ISODate("2025-05-21T00:00:00Z"),
	check_cnt: 3,
});
print('insert [userattendances]: done');
