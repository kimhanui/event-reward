import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const requestUser = request.user?.userId ?? 'anonymous'
    const info = `[${requestUser}] [${request.method}] ${request.url}`;
    console.log(`== Call::${info}`, request.body);
    const now = Date.now();
    return next.handle().pipe(
      tap((respData) =>
        console.log(
          `== Response:: ${info} (${Date.now() - now}ms)`,
          respData
        )
      ),
      catchError((err) => {
        console.error('== Error::', err);
        throw err;
      })
    );
  }
}
