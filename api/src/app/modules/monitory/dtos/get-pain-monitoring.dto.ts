import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetPainDashboardRequestDto {
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

export class GetPainDashboardResponseDto {
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
  occurredDuring: {
    type: string;
    total: number;
  }[];
}
