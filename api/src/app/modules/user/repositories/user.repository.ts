import { UserEntity } from '../entities';

export interface IUserRepository {
  create(user: UserEntity): Promise<{ id: number }>;
  update(user: UserEntity): Promise<void>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByUuid(uuid: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
}
