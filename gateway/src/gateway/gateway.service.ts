import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payload } from 'src/auth/auth.domain';
import { User, UserDocument } from 'src/db/user.schema';

/**
 * JWT 유효성 검사 메서드
 * 역할 검사 메서드
 */
@Injectable()
export class AppService {

    constructor(@InjectModel(User.name) private userDao: Model<UserDocument>) {}

    async isTokenValid(payload: Payload) : Promise<boolean> {
      console.log('isTokenValid::', JSON.stringify(payload));
      if(!payload){
        return false;
      }

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
