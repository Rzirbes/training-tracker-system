import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateDayWellBeingDto {
  @IsUUID('4')
  @IsNotEmpty({ message: 'Identificação do atleta é obrigatório' })
  athleteId: string;

  @IsNotEmpty({ message: 'Data do bem-estar é obrigatório' })
  @Type(() => Date)
  @IsDate({ message: 'Data do bem-estar é inválida' })
  date: Date;

  @IsNumber()
  sleep: number;

  @IsNumber()
  sleepHours: number;

  @IsNumber()
  energy: number;

  @IsNumber()
  nutrition: number;

  @IsNumber()
  waterIntake: number;

  @IsNumber()
  pain: number;

  @IsNumber()
  stress: number;

  @IsNumber()
  humor: number;

  @IsNumber()
  fatigue: number;

  @IsNumber()
  motivation: number;
}
