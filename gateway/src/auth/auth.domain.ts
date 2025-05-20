
export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN'
}

export interface LoginDTO {
  _id: string;
  pw: string;
}

export interface UserVO {
  _id: string;
  pw: string;
  role: Role;
  reg_dt: Date;
  upd_dt?: Date;
  expire_dt?: Date;
  refresh_token?: string;
}

export function mapToUserVO(user: any): UserVO {
  return {
    _id: user._id,
    pw: user.pw,
    role: user.role,
    reg_dt: user.reg_dt,
    upd_dt: user.upd_dt,
    expire_dt: user.expire_dt,
    refresh_token: user.refresh_token
  };
}

export interface Payload {
  userId: string; // 바꾸고 싶다 user_id로
  role: Role;
  expire_dt?: Date;
  type: string; // refresh, access
}
