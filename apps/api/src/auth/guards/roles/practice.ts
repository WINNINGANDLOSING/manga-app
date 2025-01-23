import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class RolesGuards2 implements CanActivate{
  constructor(private reflector: Reflector){

  };
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const RequiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(),
        context.getClass(),]
      );
      if(!RequiredRoles) return true;
      const user = context.switchToHttp().getRequest().user;
      const hasRequiredRoles = RequiredRoles.some(role => role === user.role)
  }
}