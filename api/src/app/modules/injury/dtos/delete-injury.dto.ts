import { IsNotEmpty, IsString } from "class-validator";

export class DeleteInjuryDto {
  @IsString()
  @IsNotEmpty({ message: 'Id da lesão é obrigatória' })
  uuid: string
}