import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  AddressDto,
  DominantFoot,
  FootballPosition,
  ParseBoolean,
  ParseJsonArrayOf,
  ParseJsonEnumArray,
} from 'src/app/shared';
import { InjuryDto } from '../../injury/dtos';
import { PainDto } from '../../pain/dtos';
import { ParseJsonObjectOf } from 'src/app/shared/decorators/parse-json-object';
import { CreateAthleteClubDto } from './create-athlete-club-dto';

export class CreateAthleteDto {
  @IsString({ message: 'Nome não é uma string' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsDate({ message: 'Data de nascimento inválida' })
  @Type(() => Date)
  birthday: Date;

  // @ParseJsonFloat()
  @IsNumber({}, { message: 'Peso não é um número' })
  @IsOptional()
  weight?: number;

  // @ParseJsonFloat()
  @IsNumber({}, { message: 'Altura não é um número' })
  @IsOptional()
  height?: number;

  @IsOptional()
  @IsString({ message: 'CPF não é uma string' })
  // @MinLength(11, { message: 'CPF é obrigatório' })
  @MaxLength(14, { message: 'CPF deve ter no máximo 22 caracteres' })
  cpf?: string;

  @IsString({ message: 'Celular não é uma string' })
  @MinLength(11, { message: 'Celular é obrigatório' })
  @MaxLength(22, { message: 'Celular deve ter no máximo 22 caracteres' })
  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsEnum(FootballPosition, { message: 'Posição inválida' })
  position?: FootballPosition;

  @IsOptional()
  @IsArray({ message: 'Posições deve ser um array' })
  @IsEnum(FootballPosition, {
    each: true,
    message: 'Cada posição deve ser válida',
  })
  @ParseJsonEnumArray()
  positions?: FootballPosition[];

  @IsOptional()
  @ParseBoolean()
  isMonitorDaily = false;

  @IsOptional()
  @IsEnum(DominantFoot, { message: 'Pé dominante inválido' })
  dominantFoot: DominantFoot;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  bestSkill?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  worstSkill?: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  goal?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  observation?: string;

  @IsOptional()
  avatar?: Express.Multer.File;

  @ParseJsonArrayOf(InjuryDto)
  @IsArray({ message: 'Lesões deve ser um array' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InjuryDto)
  injuries: InjuryDto[];

  @ParseJsonArrayOf(PainDto)
  @IsArray({ message: 'Dores deve ser um array' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PainDto)
  pains: PainDto[];

  @IsOptional()
  @ParseJsonObjectOf(AddressDto)
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @ParseJsonArrayOf(CreateAthleteClubDto)
  @IsArray({ message: 'Clubes deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => CreateAthleteClubDto)
  clubs?: CreateAthleteClubDto[];
}
