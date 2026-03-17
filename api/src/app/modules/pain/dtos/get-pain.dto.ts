import { IsNotEmpty, IsString } from "class-validator";

export class GetPainRequestDto {
  @IsString()
  @IsNotEmpty()
  uuid: string
}

export class GetPainResponseDto {
  date: Date;
  bodyRegion: string;
  bodySide: string;
  occurredDuring: string;
  intensity: number
  description?: string;
}