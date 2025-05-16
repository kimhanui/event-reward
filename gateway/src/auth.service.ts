// auth.service.ts
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { ErrorCode, ResponseDTO, sendFail, sendSuccess } from './common.util';
import { convertToUserVO, LoginDTO, Payload, Role, UserVO } from './auth.domain';
import { Token, TokenDocument } from './token.schema';
import * as bcrypt from 'bcrypt';

// TODO auth 서버로 이동
@Injectable()
export class AuthService {
  // TODO 환경변수 처리
  private readonly ACCESS_SECRET = 'ACCESS_SECRET';
  private readonly REFRESH_SECRET = 'REFRESH_SECRET';
  private readonly ACCESS_DURATION = 15 * 60; // 15m
  private readonly REFRESH_DURATION = 7 * 60 * 60 * 24; // 7d
  private readonly TEST_DURATION = 3; // 7d

  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userDao: Model<UserDocument>,
    @InjectModel(Token.name) private tokenDao: Model<TokenDocument>
  ) {}

  async insertUser(user: UserVO): Promise<ResponseDTO> {
    if (!user) {
      return sendFail(ErrorCode.PARAM001);
    }

    if (
      !(4 <= user.id?.length && user.id?.length <= 10) || // id : 4~10자
      !(4 <= user.pw?.length && user.pw?.length <= 10) || // pw : 4~10자
      !Object.values(Role).includes(user.role)
    ) {
      return sendFail(ErrorCode.PARAM002);
    }

    const findUser = await this.userDao.findOne({ _id: user.id });
    if (findUser) {
      return sendFail(ErrorCode.AUTH002);
    }

    const resultUser = await this.userDao.create({
      _id: user.id,
      pw: await this.bycryptPassword(user.pw),
      role: user.role
    });
    const uuser = convertToUserVO(resultUser);
    return sendSuccess(uuser);
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

  /**
   * id, pw입력 시 유효성 체크 후 AT, RT를 반환.
   */
  async login(user: LoginDTO): Promise<ResponseDTO> {
    console.log('login:', user);
    // 유효성 검사
    const findUser = await this.userDao.findOne({ _id: user.id }).exec();
    if (findUser === null) {
      return sendFail(ErrorCode.AUTH001);
    }

    if (!(await this.equalsPassword(user.pw, findUser.pw))) {
      return sendFail(ErrorCode.AUTH003);
    }

    // TODO 매번 갱신? or 있던거 그대로 쓰기?
    // AT, RT 저장
    const payload = this.getPayload(findUser);
    const access_token = this.createAccessToken(payload);
    const refresh_token = this.createRefreshToken(payload);

    await this.tokenDao.updateOne(
      { user_id: findUser.id, type: 'AT' },
      {
        $set: {
          token: access_token,
          expire_dt: new Date(Date.now() + 1000 * this.ACCESS_DURATION)
        }
      },
      { upsert: true }
    );

    await this.tokenDao.updateOne(
      { user_id: findUser.id, type: 'RT' },
      {
        $set: {
          token: refresh_token,
          expire_dt: new Date(Date.now() + 1000 * this.REFRESH_DURATION)
        }
      },
      { upsert: true }
    );

    return sendSuccess({
      access_token,
      refresh_token
    });
  }

  createAccessToken(payload: Payload) {
    const access_token = this.jwtService.sign(payload, {
      secret: this.ACCESS_SECRET,
      expiresIn: this.ACCESS_DURATION
    });
    return access_token;
  }

  createRefreshToken(payload: Payload) {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.REFRESH_SECRET,
      expiresIn: this.REFRESH_DURATION
    });
    return refresh_token;
  }

  getPayload(user: User): Payload {
    // expire_dt: 클라에서 AT만료됐으면 바로 RT로 AT발급받는 API 호출하게 하기 위함.
    return {
      userId: user._id,
      role: user.role,
      expire_dt: new Date()
    };
  }
}
