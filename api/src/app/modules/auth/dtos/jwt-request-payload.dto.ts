import { JwtPayloadDto } from './jwt-payload.dto';

export interface JwtRequestPayloadDto extends JwtPayloadDto {
    sub: string;
    iat: number;
    exp: number;
}
