import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class MonotonyMonitoringResponseDto {
  week: string[];
  monotony: number[];
  strain: number[];
  acuteChronicLoadRatio: number[];
  load: {
    planned: number[];
    performed: number[];
  };
}

export class MonotonyMonitoringRequestDto {
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
