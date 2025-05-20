import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class UserInjectInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    console.log("UserInjectInterceptor:", req.user)
    if (req.user) {
      const method = req.method.toUpperCase();
      if (method === 'GET') {
        // GET이면 query에
        req.query.x_user_id = req.user.userId;
      } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        // POST/PUT 등은 body에
        req.body.x_user_id = req.user.userId;
      }
    }

    return next.handle();
  }
}