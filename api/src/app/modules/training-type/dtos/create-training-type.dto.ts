import { IsString } from 'class-validator';

export class CreateTrainingTypeDto {
  @IsString()
  name: string;
}
