import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ISecurityRepository } from 'src/app/modules/auth';

@Injectable()
export class BcryptRepository implements ISecurityRepository {
  public async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  public async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
