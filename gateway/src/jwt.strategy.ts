// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// JwtAuthGuard 내부에서 JwtStrategy를 호출해 토큰 파싱, 검증 수행.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization: Bearer <token>
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret'
    });
  }

  /**
   * @param payload JWT를 인코딩하기 전 JSON 객체 ( {@link JwtService#sign} payload 파라미터와 동일)
   */
  async validate(payload: any) {
    // payload는 sign할 때 넣은 정보: 예) { userId, username }
    return { userId: payload.sub, username: payload.username };
  }
}
