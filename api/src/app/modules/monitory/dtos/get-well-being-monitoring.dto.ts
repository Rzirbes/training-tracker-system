import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class GetWellBeingMonitoringRequestDto {
  @IsString()
  @IsUUID('4')
  athleteUuid: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;
}

export class GetWellBeingMonitoringResponseDto {
  days: Date[];
  sleep: number[];
  sleepHours: number[];
  energy: number[];
  pain: number[];
  stress: number[];
  humor: number[];
  nutrition: number[];
  waterIntake: number[];
  motivation: number[];
  fatigue: number[];
}
