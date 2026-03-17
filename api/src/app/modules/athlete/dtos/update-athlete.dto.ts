import { IsOptional } from 'class-validator';
import { CreateAthleteDto } from './create-athlete.dto';
import { ParseBoolean } from 'src/app/shared';

export class UpdateAthleteDto extends CreateAthleteDto {
  uuid: string;

  @IsOptional()
  @ParseBoolean()
  deletedAvatar?: boolean = false;
}
