import { IsNotEmpty, IsString } from "class-validator";

export class GetInjuryRequestDto {
  @IsString()
  @IsNotEmpty()
  uuid: string
}

export class GetInjuryResponseDto {
  date: Date;
  type: string;
  bodyRegion: string;
  degree: string;
  bodySide: string;
  occurredDuring: string;
  description?: string;
  diagnosisConfirmed?: boolean;
  examType?: string;
  requiresSurgery?: boolean;
  surgeryDate?: Date;
  treatmentType?: string;
  returnDatePlanned?: Date;
  returnDateActual?: Date;
  minutesFirstGame?: number;
  notes?: string;
}