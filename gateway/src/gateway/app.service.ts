import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payload } from 'src/auth/auth.domain';
import { Token, TokenDocument } from 'src/db/token.schema';
import { User, UserDocument } from 'src/db/user.schema';

/**
 * JWT 유효성 검사 메서드
 * 역할 검사 메서드
 */
@Injectable()
export class AppService {

    private readonly ACCESS_SECRET = 'ACCESS_SECRET';
    private readonly REFRESH_SECRET = 'REFRESH_SECRET';
    private readonly ACCESS_DURATION = 15 * 60; // 15m
    private readonly REFRESH_DURATION = 7 * 60 * 60 * 24; // 7d


    constructor(private jwtService: JwtService,
        @InjectModel(User.name) private userDao: Model<UserDocument>,
        @InjectModel(Token.name) private tokenDao: Model<TokenDocument>
    ) {}

    async isTokenValid(payload: Payload) : Promise<boolean> {
      if(!payload){
        return false;
      }
    
      // TTL이 실시간 처리되지 않음므로 미사용
      // const findToken = await this.tokenDao.exists({user_id: payload.userId, type: 'AT'});
      // if(!findToken) {
      //   return false;
      // }

      const findUser = await this.userDao.findOne({_id: payload.userId});
      if(!findUser){
        return false
      }
      if (findUser.expire_dt < new Date()) {
        console.log('Token Invalid:', findUser._id, ', token 만료(로그아웃)');
        return false;
      }
      if(findUser.role !== payload.role) {
        console.log('Token Invalid:', findUser._id, ', 역할 변경');
        return false;
      }
      
      return true;
    }

}
