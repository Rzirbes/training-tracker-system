import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAthleteClubDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'Identificação do Clube inválida' })
  @IsString({ message: 'Identificação do Clube precisar ser uma string' })
  clubId: string;

  @IsNotEmpty({ message: 'Data da chegada é obrigatório' })
  @Type(() => Date)
  @IsDate({ message: 'Data da chegada é inválida' })
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Data da chegada é inválida' })
  endDate?: Date;

  @IsOptional()
  @IsString()
  uuid?: string;
}