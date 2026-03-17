import { IsBoolean, IsString } from 'class-validator';

export class FindTrainingTypeDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsBoolean()
  isEnabled: boolean;
}
