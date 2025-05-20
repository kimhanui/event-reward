// scripts/init-mongo.js
const { ObjectId } = require('mongodb');

export async function initMongo(db) {
    try {
        // 1) users
        await db.collection('users').insertMany([
            { _id: 'admin', pw: 'aaaa', role: 'ADMIN',   reg_dt: new Date() },
            { _id: 'aaaa',  pw: 'aaaa', role: 'USER',    reg_dt: new Date() },
            { _id: 'bbbb',  pw: 'aaaa', role: 'USER',    reg_dt: new Date() },
            { _id: 'oooo',  pw: 'aaaa', role: 'OPERATOR',reg_dt: new Date() },
            { _id: 'audit', pw: 'aaaa', role: 'AUDITOR', reg_dt: new Date() },
        ]);
        console.log('✅ insert [users]');

        // 2) events
        const eventId = new ObjectId('665a2234567890abcdef5678');
        await db.collection('events').insertOne({
            _id:             eventId,
            title:           '이벤트1',
            content:         '테스트',
            start_dt:        new Date('2025-05-18T00:00:00Z'),
            end_dt:          '',
            active_yn:       true,
            reward_manual_yn:false,
            conditions:      ['{"user_id": "%s", "check_cnt": {"$gte": 3}}'],
            reward_ids:      [
                new ObjectId('665a3334567890abcdef9999'),
                new ObjectId('665a3334567890abcdef9998'),
            ],
        });
        console.log('✅ insert [events]');

        // 3) rewards
        await db.collection('rewards').insertMany([
            {
                _id:       new ObjectId('665a3334567890abcdef9999'),
                type:      'CP',
                target_id: 'cp123',
                amount:    1,
                event_ids: [eventId],
            },
            {
                _id:       new ObjectId('665a3334567890abcdef9998'),
                type:      'CP',
                target_id: 'cp456',
                amount:    1,
                event_ids: [eventId],
            },
        ]);
        console.log('✅ insert [rewards]');

        // 4) userattendances
        await db.collection('userattendances').insertOne({
            user_id:       'aaaa',
            last_check_dt: new Date('2025-05-21T00:00:00Z'),
            check_cnt:     3,
        });
        console.log('✅ insert [userattendances]');
    } catch (err) {
        console.error('❌ init-mongo error:', err);
    }
}

module.exports = initMongo;
