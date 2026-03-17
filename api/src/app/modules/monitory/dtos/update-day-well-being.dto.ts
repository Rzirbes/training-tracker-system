import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class UpdateDayWellBeingParamDto {
  @IsUUID('4')
  @IsNotEmpty()
  uuid: string;
}

export class UpdateDayWellBeingDto {
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
