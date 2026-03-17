import { IsUUID } from 'class-validator';

export class GetCitiesRequestDto {
  @IsUUID()
  state: string;
}
