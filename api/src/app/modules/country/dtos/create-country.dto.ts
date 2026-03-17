import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCountryDto {
  @IsNotEmpty()
  @IsString({ message: 'Nome precisar ser uma string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Código do país precisar ser uma string' })
  code?: string;
}

export class CreateCountryResponseDto {
  message: string
  id: string
}