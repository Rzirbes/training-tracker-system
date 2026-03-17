import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
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
import { BodySide, InjuryContext, InjuryDegree } from 'src/app/shared';

export class InjuryDto {
  @IsNotEmpty({ message: 'Data da lesão é obrigatório' })
  @Type(() => Date)
  @IsDate({ message: 'Data da lesão é inválida' })
  date: Date;

  @IsString({ message: 'Tipo da lesão é obrigatório' })
  @IsNotEmpty({ message: 'Tipo da lesão é obrigatório' })
  @MaxLength(255, {
    message: 'Tipo da lesão deve ter no máximo 255 caracteres',
  })
  type: string;

  @IsString({ message: 'Região do corpo é obrigatório' })
  @IsNotEmpty({ message: 'Região do corpo é obrigatória' })
  @MaxLength(255, {
    message: 'Região do corpo deve ter no máximo 255 caracteres',
  })
  bodyRegion: string;

  @IsEnum(BodySide, { message: 'Lado do corpo é obrigatório' })
  bodySide: BodySide;

  @IsEnum(InjuryDegree, { message: 'Grau da lesão é obrigatório' })
  degree: InjuryDegree;

  @IsEnum(InjuryContext, { message: 'Momento da ocorrência é obrigatório' })
  occurredDuring: InjuryContext;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Descrição deve ter no máximo 2000 caracteres' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Confirmação do diagnóstico é obrigatória' })
  diagnosisConfirmed?: boolean = false;

  @IsOptional()
  @IsString()
  examType?: string;

  @IsOptional()
  @IsBoolean({ message: 'Indicação de cirurgia é obrigatória' })
  requiresSurgery?: boolean = false;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Data da cirurgia é inválida' })
  surgeryDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'Tipo de tratamento deve ter no máximo 255 caracteres',
  })
  treatmentType?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Data de retorno planejada é inválida' })
  returnDatePlanned?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Data de retorno real é inválida' })
  returnDateActual?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Minutos no primeiro jogo deve ser um número' })
  minutesFirstGame?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Deve ter no máximo 2000 caracteres' })
  notes?: string;

  @IsOptional()
  @IsString()
  uuid: string;
}

export class InjuriesDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InjuryDto)
  injuries: InjuryDto[];
}

export class CreateInjuriesDto {
  @IsArray({ message: 'A lista de lesões deve ser um array.' })
  @ArrayNotEmpty({ message: 'É necessário incluir ao menos uma lesão.' })
  @ValidateNested({ each: true })
  @Type(() => InjuryDto)
  injuries: InjuryDto[];

  @IsUUID('4', { message: 'Identificação do Atleta inválida.' })
  @IsString({ message: 'Identificação do Atleta não é uma string.' })
  athleteUuid: string;
}
