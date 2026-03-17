import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class WeekMonitoringRequestDto {
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

export class WeekMonitoringResponseDto {
  days: Date[];
  PSRs: number[];
  durations: {
    planned: number[];
    performed: number[];
  };
  trainings: {
    planned: number[];
    performed: number[];
  };
  PSEs: {
    planned: number[];
    performed: number[];
  };
}
