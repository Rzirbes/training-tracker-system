import { IsString, IsUUID } from 'class-validator';
import { CreateTrainingDto } from './create-training.dto';

export class UpdateTrainingDto extends CreateTrainingDto {
  @IsUUID('4', {
    message: 'Identificação do Treino inválida.',
  })
  @IsString({ message: 'Identificação do Treino não é uma string válida.' })
  id: string;
}
