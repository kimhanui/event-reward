import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles';
import { Role } from 'src/auth/auth.domain';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    // 역할 제한 x
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // JwtStrategy.invalidate에서 반환되는 값인 user에서 role 반환 필요.
    const { user } = context.switchToHttp().getRequest();

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied for role');
    }

    return true;
  }
}
