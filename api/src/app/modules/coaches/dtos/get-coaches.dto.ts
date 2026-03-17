import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginateRequestDto } from 'src/app/shared';

export class GetCoachesDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isEnabled: boolean;
  schedulerColor: string;
}

export class GetCoachesRequestDto extends PaginateRequestDto {
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
