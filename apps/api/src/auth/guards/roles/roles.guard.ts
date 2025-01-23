import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      /* the key which is used to set the role metadata, can be extracted from ROLES_KEY constant from the Roles decorator */ ROLES_KEY,
      /* a list which we specify where we are going to 
      extract the metadata */ [context.getHandler(), context.getClass()], // extract the metadata from the handler and the context, look for the metadata under the role key inside the entire class and if any specific handler has its own metadata on the role key it actually overwrite that metadata for that handler
    ); // <>: generics of the type of the object that we are gonna extract from
    // the metadata which is the list of roles
    if (!requiredRoles) return true; // if we don't have any metadata under the ROLES_KEY, API route is not marked with auth decorator, allow user to access the api route
    const user = context.switchToHttp().getRequest().user; // extract user from the request object, access the user object

    // check if user has the required role, if the role of the user is matched with one of the required roles, this function return trues
    const MatchedRequiredRole = requiredRoles.some(
      (requiredRole) => user.role===requiredRole,
    ); // look inside each element of the required roles, for each role, if at least one of the required roles matches with the user role, return true
    return MatchedRequiredRole;
  }
}
