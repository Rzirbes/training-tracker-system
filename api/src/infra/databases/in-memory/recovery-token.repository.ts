import { Injectable } from '@nestjs/common';
import { TokenEntity, IRecoveryTokenRepository } from 'src/app/modules/auth';

@Injectable()
export class RecoveryTokenInMemoryRepository
  implements IRecoveryTokenRepository
{
  private tokens: TokenEntity[] = [];
  async findByToken(refreshToken: string): Promise<TokenEntity | null> {
    const token = this.tokens.find(
      (token) => token.getToken() === refreshToken,
    );
    return token ?? null;
  }

  async save(token: TokenEntity): Promise<TokenEntity> {
    this.tokens.push(token);
    return token;
  }

  async update(token: TokenEntity): Promise<void> {
    this.tokens = this.tokens.map((t) => {
      if (t.getToken() === token.getToken()) {
        return token;
      }
      return t;
    });
  }

  async invalidateTokensByUserId(id: number): Promise<void> {
    this.tokens = this.tokens.map((token) => {
      if (token.getUserId() === id) token.invalid();
      return token;
    });
  }
}
