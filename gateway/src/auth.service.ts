// auth.service.ts
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

// TODO auth 서버로 이동
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    // console.log('login:', JSON.stringify(user));
    const payload = { username: user.username, sub: user.id };
    console.log('payload:', payload);
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
