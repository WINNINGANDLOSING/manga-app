import { SetMetadata } from '@nestjs/common';
// in schema, create a field name role with prop type is Role
// create auth/decorators/roles.decorator.ts
// modify jwt-auth.guard
// create roles.guard
import { Role } from '@prisma/client';
export const ROLES_KEY = 'ROLES';
export const Roles = (...roles: [Role, ...Role[]]) => SetMetadata(ROLES_KEY, roles); // ... roles so that in auth.controllers, we can do this: @Roles("A", "B"), no need for []; And [Role, ...Role[]] so that we the Role decorator should have at least one element
