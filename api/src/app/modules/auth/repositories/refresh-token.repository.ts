import { TokenEntity } from '../entities';

export interface IRefreshTokenRepository {
  findByToken(refreshToken: string): Promise<TokenEntity | null>;
  invalidateTokensByUserId(userId: number): Promise<void>;
  save(token: TokenEntity): Promise<TokenEntity>;
}
