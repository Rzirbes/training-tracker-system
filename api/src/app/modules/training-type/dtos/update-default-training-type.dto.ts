import { IsString, IsUUID } from "class-validator";

export class UpdateDefaultTrainingTypeDto {
  @IsUUID('4')
  @IsString()
  trainingTypeId: string
}