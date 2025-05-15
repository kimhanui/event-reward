import { Injectable } from '@nestjs/common';

/**
 * JWT 유효성 검사 메서드
 * 역할 검사 메서드
 */
@Injectable()
export class AppService {

  isValidJWT(token: string): boolean {
    // if()
    return false;
    // return 'Hello World!';
  }
}
