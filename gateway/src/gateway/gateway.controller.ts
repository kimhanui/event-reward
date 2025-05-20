import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import {InjectConnection} from "@nestjs/mongoose";
import {Connection} from "mongoose";
import {ObjectId} from "mongodb";
import {RolesGuard} from "../jwt/role.guard";
import {Role} from "../auth/auth.domain";
import {RolesDecorator} from "../jwt/roles.decorator";

@Controller()
export class AppController {
  constructor(
      @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get('health')
  async health() {
    return 'Gateway Up';
  }

  @Get('init/mongo')
  async init() {
    try {
      await this.initMongo(this.connection)
      return 'init ok';
    } catch(err) {
      console.error('mongo init failed:', err)
      return 'init failed';
    }
  }

  async initMongo(db) {
    try {
      // 1) users (pw: 'aaaa')
      await db.collection('users').insertMany([
        { _id: 'admin', pw: "$2b$10$05mNmt1ZVoZDs/0jzLJz3.bfYAU7aUWqbFvontEpFamBbT39XzpAa", role: 'ADMIN',   reg_dt: new Date() },
        { _id: 'aaaa',  pw: "$2b$10$05mNmt1ZVoZDs/0jzLJz3.bfYAU7aUWqbFvontEpFamBbT39XzpAa", role: 'USER',    reg_dt: new Date() },
        { _id: 'bbbb',  pw: "$2b$10$05mNmt1ZVoZDs/0jzLJz3.bfYAU7aUWqbFvontEpFamBbT39XzpAa", role: 'USER',    reg_dt: new Date() },
        { _id: 'oooo',  pw: "$2b$10$05mNmt1ZVoZDs/0jzLJz3.bfYAU7aUWqbFvontEpFamBbT39XzpAa", role: 'OPERATOR',reg_dt: new Date() },
        { _id: 'audit', pw: "$2b$10$05mNmt1ZVoZDs/0jzLJz3.bfYAU7aUWqbFvontEpFamBbT39XzpAa", role: 'AUDITOR', reg_dt: new Date() },
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

  // 테스트
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Role.ADMIN)
  @Get('admin/test')
  async admin() {
    return 'ok';
  }
}
