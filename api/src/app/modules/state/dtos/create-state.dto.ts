import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateStateDto {
  @IsNotEmpty()
  @IsString({ message: 'Nome precisar ser uma string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'União Federativa (UF) precisar ser uma string' })
  uf?: string;
  
  @IsNotEmpty()
  @IsUUID('4', { message: 'Identificação do País inválida' })
  @IsString({ message: 'Identificação do País precisar ser uma string' })
  countryId: string;
}

export class CreateStateResponseDto {
  message: string
  id: string
}