import { TokenEntity } from '../auth';

export interface IUnsubscribeRepository {
  findToken(token: string): Promise<TokenEntity | null>;
  saveEmail(email: string): Promise<void>;
  findEmails(): Promise<string[]>;
  findByEmail(email: string): Promise<boolean>;
}
