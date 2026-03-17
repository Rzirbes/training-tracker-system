import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetInjuryDashboardRequestDto {
  @IsString()
  @IsUUID('4')
  athleteUuid: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}

export class GetInjuryDashboardResponseDto {
  injuryRecovery: {
    type: string;
    dias: number;
  }[];
  bodySide: {
    side: string;
    total: number;
  }[];
  bodyHeatMap: {
    type: string;
    total: number;
  }[];
  recurrence: {
    type: string;
    total: number;
  }[];
  firstGameMinutes: {
    type: string;
    minutos: number;
  }[];
  type: {
    type: string;
    total: number;
  }[];
  occurredDuring: {
    type: string;
    total: number;
  }[];
  degree: {
    degree: string;
    total: number;
  }[];
}
