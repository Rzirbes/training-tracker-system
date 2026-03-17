import { InjuryDto } from '../../injury/dtos';
import { PainDto } from '../../pain/dtos';
import { AddressDto, DominantFoot, FootballPosition } from 'src/app/shared';
import { CreateAthleteClubDto } from './create-athlete-club-dto';

export class FindAthleteResponseDto {
  id: string;
  name: string;
  email: string;
  birthday: Date;
  isEnabled: boolean;
  weight?: number;
  height?: number;
  cpf: string;
  phone: string;
  position: FootballPosition;
  positions: FootballPosition[];
  isMonitorDaily: boolean;
  dominantFoot: DominantFoot;
  bestSkill?: string;
  worstSkill?: string;
  goal?: string;
  observation?: string;
  avatarUrl?: string;
  injuries: InjuryDto[];
  pains: PainDto[];
  clubs: (CreateAthleteClubDto & {
    uuid: string; // ID do contrato e vínculo entre o atleta e o clube
    name: string;
    country: string;
    countryId: string;
    state: string;
    stateId: string;
    city: string;
    cityId: string;
  })[];
  address: AddressDto & {
    country: string;
    state: string;
    city: string;
  };
}
