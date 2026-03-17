import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { PaginateRequestDto } from 'src/app/shared';

export class ListAthletesDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isEnabled: boolean;
}

export class ListAthletesRequestDto extends PaginateRequestDto {
  @IsOptional()
  @Transform(({ obj, key }) => {
    const value = obj[key];
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isEnabled?: boolean;
}
