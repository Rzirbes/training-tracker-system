import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BodySide, InjuryContext } from 'src/app/shared';

export class PainDto {
  @IsNotEmpty({ message: 'Data da dor é obrigatório' })
  @Type(() => Date)
  @IsDate({ message: 'Data da dor é inválida' })
  date: Date;

  @IsString({ message: 'Região do corpo é obrigatório' })
  @IsNotEmpty({ message: 'Região do corpo é obrigatória' })
  @MaxLength(255, {
    message: 'Região do corpo deve ter no máximo 255 caracteres',
  })
  bodyRegion: string;

  @IsEnum(BodySide, { message: 'Lado do corpo é obrigatório' })
  bodySide: BodySide;

  @IsEnum(InjuryContext, { message: 'Momento da ocorrência é obrigatório' })
  occurredDuring: InjuryContext;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Descrição deve ter no máximo 2000 caracteres' })
  description?: string;

  @IsNotEmpty({ message: 'Intensidade é obrigatório' })
  @Type(() => Number)
  @IsInt({ message: 'Intensidade deve ser um número' })
  intensity: number;

  @IsOptional()
  @IsString()
  uuid: string;
}

export class PainsDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PainDto)
  pains: PainDto[];
}

export class CreatePainsDto {
  @IsArray({ message: 'A lista de dores deve ser um array.' })
  @ArrayNotEmpty({ message: 'É necessário incluir ao menos uma dor.' })
  @ValidateNested({ each: true })
  @Type(() => PainDto)
  pains: PainDto[];

  @IsUUID('4', { message: 'Identificação do Atleta inválida.' })
  @IsString({ message: 'Identificação do Atleta não é uma string.' })
  athleteUuid: string;
}
