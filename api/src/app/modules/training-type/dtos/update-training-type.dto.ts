import { IsString } from 'class-validator';
import { CreateTrainingTypeDto } from './create-training-type.dto';

export class UpdateTrainingTypeDto extends CreateTrainingTypeDto {
  uuid: string;
}
