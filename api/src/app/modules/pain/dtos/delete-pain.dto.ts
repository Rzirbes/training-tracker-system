import { IsNotEmpty, IsString } from "class-validator";

export class DeletePainDto {
  @IsString()
  @IsNotEmpty({ message: 'Id da lesão é obrigatória' })
  uuid: string
}