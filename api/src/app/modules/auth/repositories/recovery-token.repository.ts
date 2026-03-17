import { TokenEntity } from '../entities';

export interface IRecoveryTokenRepository {
  findByToken(recoveryToken: string): Promise<TokenEntity | null>;
  save(token: TokenEntity): Promise<TokenEntity>;
  update(token: TokenEntity): Promise<void>;
  invalidateTokensByUserId(id: number): Promise<void>;
}
