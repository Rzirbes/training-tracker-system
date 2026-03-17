import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID } from 'class-validator';

class Training {
  id: string;
  date: Date;
  trainingType: { id: string; name: string };
  duration: number;
  pse: number;
  psr: number;
  load: number;
  description?: string;
}

export class ListTrainingRequestDto {
  @IsUUID('4', {
    message: 'Identificação do Atleta inválida.',
  })
  @IsString({ message: 'Identificação do Atleta não é uma string válida.' })
  athleteUuid: string;

  @Type(() => Date)
  @IsDate({ message: 'Data de inicial inválida.' })
  startDate: Date;

  @Type(() => Date)
  @IsDate({ message: 'Data de final inválida.' })
  endDate: Date;
}

export class ListTrainingResponseDto {
  trainings: Training[];
  charge: {
    week: number;
    previousWeek: number;
    nextWeek: number;
  };
  trainingTotals: {
    week: number;
    previousWeek: number;
    nextWeek: number;
  };
}
