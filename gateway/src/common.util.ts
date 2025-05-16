export function sendSuccess(value?: unknown): ResponseDTO {
  return {
    code: 'OK',
    message: 'ok',
    value
  };
}

export function sendFail(code: ErrorCode): ResponseDTO {
  return {
    code,
    message: ErrorMessage[code]
  };
}

export interface ResponseDTO {
  code: string;
  message: string;
  value?: unknown;
}
export enum ErrorCode {
  AUTH001 = 'AUTH001',
  AUTH002 = 'AUTH002',
  AUTH003 = 'AUTH003',
  PARAM001 = 'PARAM001',
  PARAM002 = 'PARAM002'
}

const ErrorMessage: Record<ErrorCode, string> = {
  [ErrorCode.AUTH001]: '존재하지 않는 회원입니다.',
  [ErrorCode.AUTH002]: '이미 가입된 회원입니다.',
  [ErrorCode.AUTH003]: '아이디와 비밀번호를 확인해주세요.',
  [ErrorCode.PARAM001]: '파라미터가 존재하지 않습니다.',
  [ErrorCode.PARAM002]: '파라미터가 유효하지 않습니다.'
};