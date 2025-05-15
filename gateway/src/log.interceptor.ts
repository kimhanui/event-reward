import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const info = `[${request.method}] ${request.url} ${JSON.stringify(request.body)}`;
    console.log(`== Call:: ${info}`);

    const now = Date.now();
    return next.handle().pipe(
      tap((respData) =>
        console.log(
          `== Response:: [${request.method}] ${request.url} (${Date.now() - now}ms)`,
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
