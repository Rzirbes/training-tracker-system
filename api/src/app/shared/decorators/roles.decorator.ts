import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../enums';

export const rolesGuardMetaData = 'roles';
export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(rolesGuardMetaData, roles);
