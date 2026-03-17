import { IsNumber, IsUUID } from 'class-validator';

export class CaptureAthleteWellBeingDto {
  @IsUUID('4')
  token: string;

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
