import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCityDto {
  @IsNotEmpty()
  @IsString({ message: 'Nome precisar ser uma string' })
  name: string;

  @IsNotEmpty()
  @IsUUID('4', { message: 'Identificação do Estado inválida' })
  @IsString({ message: 'Identificação do Estado precisar ser uma string' })
  stateId: string;
}

export class CreateCityResponseDto {
  message: string
  id: string
}