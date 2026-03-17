import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginateRequestDto } from 'src/app/shared';
import { GetPainResponseDto } from './get-pain.dto';
import { Type } from 'class-transformer';

export class ListPainRequestDto extends PaginateRequestDto {
  @IsUUID('4', {
    message: 'Identificação do Atleta inválida.',
  })
  @IsString({ message: 'Identificação do Atleta não é uma string válida.' })
  athleteUuid: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Data de inicial inválida.' })
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Data de final inválida.' })
  endDate?: Date;
}

export class ListPainResponseDto extends GetPainResponseDto {}
