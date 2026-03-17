import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenExpiredException extends HttpException {
  constructor(title: string, message: string) {
    super({ title, message, name: 'TOKEN_EXPIRED' }, HttpStatus.UNAUTHORIZED);
  }
}
