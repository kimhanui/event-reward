import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/auth/auth.domain';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
