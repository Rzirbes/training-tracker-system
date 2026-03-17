import { UserRoleEnum } from 'src/app/shared';

class UserLoginResponse {
  name: string;
  type: UserRoleEnum;
  uuid: string;
}

export class UserCredentialsResponseDto {
  user: UserLoginResponse;
}
