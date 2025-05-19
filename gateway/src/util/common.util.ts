export function sendSuccess(value?: unknown): ResponseDTO {
  return {
    code: 'OK',
    message: 'ok',
    value
  };
}
/**
 * 
 * @param page 요청한 page (최소: 0)
 * @param size 요청한 size (최소: 0)
 * @param list 조회 결과
 */
export function sendSuccessList(
  page: number,
  size: number,
  list?: unknown[]
): ResponseDTO {
  const listObj = {
    list,
    page: page ?? 0,
    size: size ?? 0
  };
  return {
    code: 'OK',
    message: 'ok',
    value: listObj
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
  EVENT001 = 'EVENT001',
  EVENT002 = 'EVENT002',
  EVENT003 = 'EVENT003',
  EVENT004 = 'EVENT004',
  EVENT005 = 'EVENT005',
  EVENT006 = 'EVENT006',
  EVENT007 = 'EVENT007',
  EVENT008 = 'EVENT008',
  EVENT009 = 'EVENT009',
  EVENT010 = 'EVENT010',
  EVENT011 = 'EVENT011',
  EVENT012 = 'EVENT012',
  EVENT013 = 'EVENT013',
  PARAM001 = 'PARAM001',
  PARAM002 = 'PARAM002',
  PARAM003 = 'PARAM003',
  ERR001 = 'ERR001'
}

const ErrorMessage: Record<ErrorCode, string> = {
  [ErrorCode.AUTH001]: '존재하지 않는 회원입니다.',
  [ErrorCode.AUTH002]: '이미 가입된 회원입니다.',
  [ErrorCode.AUTH003]: '아이디와 비밀번호를 확인해주세요.',
  [ErrorCode.EVENT001]:
    '이벤트 종료 시간을 시작 시간보다 나중으로 설정해주세요.',
  [ErrorCode.EVENT002]: '보상 설정 후 활성화 가능합니다.',
  [ErrorCode.EVENT003]: '보상 자동 지급 시 조건 설정이 필요합니다.',
  [ErrorCode.EVENT004]: '이미 동일한 조건으로 등록된 값이 있습니다.',
  [ErrorCode.EVENT005]: '보상 조건을 불충족합니다.',
  [ErrorCode.EVENT006]: '존재하지 않는 조건 입니다.',
  [ErrorCode.EVENT007]: '이벤트가 존재하지 않습니다.',
  [ErrorCode.EVENT008]: '현재 진행 중인 이벤트가 아닙니다.',
  [ErrorCode.EVENT009]: '이미 요청한 이벤트의 보상을 지급받았습니다.',
  [ErrorCode.EVENT010]: '이미 요청한 이벤트의 보상 지급을 신청했습니다.',
  [ErrorCode.EVENT011]: '존재하지 않는 보상 정보 입니다.',
  [ErrorCode.EVENT012]: '이미 요청한 이벤트의 보상 지급이 실패했습니다.',
  [ErrorCode.EVENT013]: '이벤트의 보상 신청이 실패했습니다.',
  [ErrorCode.PARAM001]: '파라미터가 존재하지 않습니다.',
  [ErrorCode.PARAM002]: '파라미터가 유효하지 않습니다.',
  [ErrorCode.PARAM003]: '기존과 동일한 값입니다.',
  [ErrorCode.ERR001]: '서버 에러 발생.'
};

export function isObjectId(str: string) {
  if(!str || str.length != 24) {
    return false;
  }
  return true;
}