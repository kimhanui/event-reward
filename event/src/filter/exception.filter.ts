import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCode, ResponseDTO, sendFail } from "src/util/common.util";

/**
 * 사전에 핸들링하지 못한 예외는 모두 INTERNAL_SERVER_ERROR 처리
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 인증 예외일 경우 그대로 사용
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    console.error('exception:', request.url, "status:", status, "message", message);

    // const responseBody: ResponseDTO = sendFail(ErrorCode.ERR001);
    response.status(status).json(message);
  }
}