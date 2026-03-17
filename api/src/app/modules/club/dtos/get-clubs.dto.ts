import { IsString, IsUUID } from 'class-validator';
import { BaseSelectResponseDto } from 'src/app/shared';

export class GetClubsRequestDto {
  @IsUUID()
  @IsString()
  city: string;
}

export class GetClubsResponseDto {
  clubs: BaseSelectResponseDto[];
}
