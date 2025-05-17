import { User } from '../db/user.schema';

export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN'
}

export interface LoginDTO {
  id: string;
  pw: string;
}

export interface UserVO {
  id: string;
  pw: string;
  role: Role;
  reg_dt: Date;
  upd_dt: Date;
}

export function convertToUserVO(user: User): UserVO {
  return {
    id: user._id,
    pw: user.pw,
    role: user.role,
    reg_dt: user.reg_dt,
    upd_dt: user.upd_dt
  };
}

export interface Payload {
  userId: string;
  role: Role;
  expire_dt: Date;
}
