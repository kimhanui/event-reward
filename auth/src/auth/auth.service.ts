// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { ErrorCode, ResponseDTO, sendFail, sendSuccess } from '../util/common.util';
import { User, UserDocument } from '../db/user.schema';
import {
  LoginDTO, mapToUserVO,
  Payload,
  Role,
  UserVO
} from './auth.domain';

@Injectable()
export class AuthService {
  private readonly ACCESS_SECRET = process.env.ACCESS_SECRET ?? 'ACCESS_SECRET';
  private readonly REFRESH_SECRET = process.env.REFRESH_SECRET ?? 'REFRESH_SECRET'
  private readonly ACCESS_DURATION = 15 * 60; // 15m
  private readonly REFRESH_DURATION = 7 * 60 * 60 * 24; // 7d

  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userDao: Model<UserDocument>,
  ) {}

  async insertUser(x_user_id: string, req: any) : Promise<ResponseDTO> {
    const user = req as UserVO
    if (!user) {
      return sendFail(ErrorCode.PARAM001);
    }
    if (
      !(4 <= user._id?.length && user._id?.length <= 10) || // id : 4~10자
      !(4 <= user.pw?.length && user.pw?.length <= 10) //|| // pw : 4~10자
    ) {
      return sendFail(ErrorCode.PARAM002);
    }

    const findUser = await this.userDao.findOne({ _id: user._id });
    if (findUser) {
      return sendFail(ErrorCode.AUTH002);
    }

    const resultUser = await this.userDao.insertOne({
      _id: user._id,
      pw: await this.bycryptPassword(user.pw),
      role: Role.USER // 고정
    });

    return sendSuccess(mapToUserVO(resultUser));
  }

  private saltRounds = 10; // 해시 반복 횟수 (10~12 추천)
  private async bycryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private async equalsPassword(
    rawPassword: string,
    encryptedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(rawPassword, encryptedPassword);
  }

  async updateUserRole(x_user_id: string, req: any) : Promise<ResponseDTO> {
    const user = req as UserVO
    if (!user) {
      return sendFail(ErrorCode.PARAM001);
    }
    if (
      !(4 <= user._id?.length && user._id?.length <= 10) || // id : 4~10자
      !Object.values(Role).includes(user.role)
    ) {
      return sendFail(ErrorCode.PARAM002);
    }

    const findUser = await this.userDao.findOne({ _id: user._id });
    if (!findUser) {
      return sendFail(ErrorCode.AUTH001);
    }

    if (findUser.role === user.role) {
      return sendFail(ErrorCode.PARAM003);
    }

    findUser.role = user.role;
    findUser.upd_dt = new Date();
    findUser.save();

    return sendSuccess();
  }

  /**
   * id, pw입력 시 유효성 체크 후 AT, RT를 반환.
   */
  async login(user: LoginDTO): Promise<ResponseDTO> {
    // 유효성 검사
    const findUser = await this.userDao.findOne({ _id: user._id }).exec();
    if (findUser === null) {
      return sendFail(ErrorCode.AUTH001);
    }

    if (!(await this.equalsPassword(user.pw, findUser.pw))) {
      return sendFail(ErrorCode.AUTH003);
    }

    const payload = this.getPayload(findUser);
    const dateTimeMs = Date.now();

    payload.expire_dt = new Date(dateTimeMs + 1000 * this.ACCESS_DURATION);
    const access_token = this.createAccessToken(payload);

    payload.expire_dt = new Date(dateTimeMs + 1000 * this.REFRESH_DURATION);
    const refresh_token = this.createRefreshToken(payload);

    findUser.expire_dt = new Date(dateTimeMs + 1000 * this.ACCESS_DURATION);
    findUser.refresh_token = refresh_token;
    await findUser.save();

    return sendSuccess({
      access_token,
      refresh_token
    });
  }

  private createAccessToken(payload: Payload) {
    payload.type = 'access'
    return this.jwtService.sign(payload, {
      secret: this.ACCESS_SECRET,
      expiresIn: this.ACCESS_DURATION
    });
  }

  private createRefreshToken(payload: Payload) {
    payload.type = 'refresh'
    return this.jwtService.sign(payload, {
      secret: this.REFRESH_SECRET,
      expiresIn: this.REFRESH_DURATION
    });
  }

  private getPayload(user: User): Payload {
    // expire_dt: 클라에서 AT만료됐으면 바로 RT로 AT발급받는 API 호출하게 하기 위함.
    return {
      userId: user._id,
      role: user.role,
    } as Payload;
  }

  async logout(x_user_id: string, req: any): Promise<ResponseDTO> {
    if(!x_user_id){
      return sendFail(ErrorCode.PARAM001)
    }
    console.log('logout:', x_user_id);
    const findUser = await this.userDao.findOne({ _id: x_user_id }).exec();
    if (findUser === null) {
      return sendFail(ErrorCode.AUTH001);
    }

    findUser.expire_dt = new Date();
    findUser.refresh_token = null;
    findUser.save();

    return sendSuccess();
  }

  async refreshToken(req: any): Promise<ResponseDTO> {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    const headerSlice = 'Bearer '.length;
    let refreshToken = authHeader.slice(headerSlice);
    
    const verifiedPayload = this.jwtService.verify(refreshToken, {
      secret: this.REFRESH_SECRET
    });

    const payload: Payload = {
      userId: verifiedPayload.userId,
      role: verifiedPayload.role,
      type: verifiedPayload.type,
      expire_dt: verifiedPayload.expire_dt,
    };

    const findUser = await this.userDao.findOne({ _id: payload.userId });
    if (findUser === null) {
      return sendFail(ErrorCode.AUTH001);
    }
    if (findUser.refresh_token !== refreshToken) {
      return sendFail(ErrorCode.PARAM002);
    }

    // AT, RT 재발급
    const dateTimeMs = Date.now();

    payload.expire_dt = new Date(dateTimeMs + 1000 * this.ACCESS_DURATION);
    const newAccessToken = this.createAccessToken(payload);

    payload.expire_dt = new Date(dateTimeMs + 1000 * this.REFRESH_DURATION);
    const newRefreshToken = this.createRefreshToken(payload);

    findUser.expire_dt = new Date(dateTimeMs + 1000 * this.ACCESS_DURATION);
    findUser.refresh_token = newRefreshToken;
    await findUser.save();

    return sendSuccess({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    });
  }
}
