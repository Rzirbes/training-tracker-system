import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenExpiredException extends HttpException {
    constructor(message: string) {
        super({ message, name: 'TOKEN_EXPIRED' }, HttpStatus.UNAUTHORIZED);
    }
}
