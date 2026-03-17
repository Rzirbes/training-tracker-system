import { Injectable } from '@nestjs/common';
import { TokenEntity, IRefreshTokenRepository } from 'src/app/modules/auth';

@Injectable()
export class RefreshTokenInMemoryRepository implements IRefreshTokenRepository {
  private tokens: TokenEntity[] = [];
  async findByToken(refreshToken: string): Promise<TokenEntity | null> {
    const token = this.tokens.find(
      (token) => token.getToken() === refreshToken,
    );
    return token ?? null;
  }

  async invalidateTokensByUserId(userId: number): Promise<void> {
    this.tokens = this.tokens.map((token) => {
      if (token.getUserId() === userId) {
        token.invalid();
      }
      return token;
    });
  }

  async save(token: TokenEntity): Promise<TokenEntity> {
    this.tokens.push(token);
    return token;
  }
}
