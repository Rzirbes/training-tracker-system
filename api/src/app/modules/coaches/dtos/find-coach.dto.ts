import { AddressDto } from 'src/app/shared';

export class FindCoachResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isEnabled: boolean;
  schedulerColor: string;
  address: AddressDto;
}
