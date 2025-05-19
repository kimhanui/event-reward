// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppService } from 'src/gateway/gateway.service';
import { Payload } from '../auth/auth.domain';

// JwtAuthGuard 내부에서 JwtStrategy를 호출해 토큰 파싱, 검증 수행.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private appService: AppService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization: Bearer <token>
      ignoreExpiration: false,
      secretOrKey: 'ACCESS_SECRET'
    });
  }

  /**
   * payload 검증: token이 db에 존재하는지(로그아웃 처리를 위함), 유저 존재하는지, role이 일치하는지
   * @param payload JWT를 인코딩하기 전 JSON 객체 ( {@link JwtService#sign} payload + iat, exp )
   */
  async validate(payload: Payload) {
    // console.log('validate::', payload);
    const result = await this.appService.isTokenValid(payload);

    if (!result) {
      throw new UnauthorizedException('토큰 정보가 유효하지 않습니다.');
    }

    return {
      userId: payload.userId,
      role: payload.role,
      expire_dt: payload.expire_dt
    };
  }
}
