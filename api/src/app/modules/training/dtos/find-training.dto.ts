import { IsString, IsUUID } from 'class-validator';
import { PainsDto } from '../../pain/dtos';
import { InjuriesDto } from '../../injury/dtos';

export class FindTrainingRequestDto {
  @IsUUID('4', {
    message: 'Identificação do Atleta inválida.',
  })
  @IsString({ message: 'Identificação do Atleta não é uma string válida.' })
  uuid: string;
}

export class FindTrainingResponseDto {
  id: string;
  date: Date;
  duration: number;
  pse: number;
  psr: number;
  load: number;
  description?: string;
  trainingType: { id: string; name: string };
  injuries: InjuriesDto['injuries'];
  pains: PainsDto['pains'];
}
