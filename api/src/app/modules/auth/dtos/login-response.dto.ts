import { UserCredentialsResponseDto } from './user-credentials-response.dto';

export class LoginResponseDto extends UserCredentialsResponseDto {
  token: string;
  refreshToken: string;
}
