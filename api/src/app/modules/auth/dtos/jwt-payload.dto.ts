import { UserRoleEnum } from 'src/app/shared';

export interface JwtPayloadDto {
  userId: number;
  type: UserRoleEnum;
}
