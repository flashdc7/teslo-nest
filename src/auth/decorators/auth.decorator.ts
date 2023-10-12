import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/ser-role/user-role.guard';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected/role-protected.decorator';

export function AuthDecorator(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards( AuthGuard(), UserRoleGuard),
  );
}