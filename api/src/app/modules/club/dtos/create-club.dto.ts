import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateClubRequestDto {
  @IsNotEmpty()
  @IsString({ message: 'Nome precisar ser uma string' })
  name: string;

  @IsNotEmpty()
  @IsUUID('4', { message: 'Identificação do País inválida' })
  @IsString({ message: 'Identificação do País precisar ser uma string' })
  countryId: string;

  @IsNotEmpty()
  @IsUUID('4', { message: 'Identificação do Estado inválida' })
  @IsString({ message: 'Identificação do Estado precisar ser uma string' })
  stateId: string;

  @IsNotEmpty()
  @IsUUID('4', { message: 'Identificação da Cidade inválida' })
  @IsString({ message: 'Identificação da Cidade precisar ser uma string' })
  cityId: string;
}

export class CreateClubResponseDto {
  message: string;
  id: string;
}
