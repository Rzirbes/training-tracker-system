import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class AddressDto {
  @Length(0, 255, {
    message: 'Nome da rua precisa ter menos que 255 caracteres.',
  })
  @IsString()
  @IsOptional()
  street?: string;

  @Length(0, 255, {
    message: 'Nome do bairro precisa ter menos que 255 caracteres.',
  })
  @IsString()
  @IsOptional()
  neighborhood?: string;

  @Length(0, 10, {
    message: 'Número precisa ter menos que 10 caracteres.',
  })
  @IsString()
  @IsOptional()
  buildingNumber?: string;

  @Length(0, 255, {
    message: 'Complemento precisa ter menos que 255 caracteres.',
  })
  @IsString()
  @IsOptional()
  complement?: string;

  @Length(0, 10, {
    message: 'CEP precisa ter menos que 10 caracteres.',
  })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsUUID('4')
  @IsOptional()
  cityId?: string;

  @IsUUID('4')
  @IsOptional()
  stateId?: string;

  @IsUUID('4')
  @IsOptional()
  countryId?: string;
}
