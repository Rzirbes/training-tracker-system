import { TokenTypeEnum } from 'src/app/shared';
import { TokenEntity } from '../entities';

export class AuthTransformer {
  static toTokenEntity(userId: number, type: TokenTypeEnum): TokenEntity {
    return new TokenEntity({
      userId,
      type,
    });
  }
}
