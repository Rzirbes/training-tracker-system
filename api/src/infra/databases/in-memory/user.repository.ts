import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserEntity } from 'src/app/modules/user';
import { IUserRepository } from 'src/app/modules/user/repositories';

@Injectable()
export class UserInMemoryRepository implements IUserRepository {
  private users: UserEntity[] = [];
  private ids = 1;

  async create(user: UserEntity): Promise<{ id: number }> {
    user.setId(this.ids++);
    user.setUuid(randomUUID());
    this.users.push(user);
    return { id: user.getId() };
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.users.find((user) => user.getEmail() === email);
    return user || null;
  }

  async findByUuid(uuid: string): Promise<UserEntity | null> {
    const user = this.users.find((user) => user.getUuid() === uuid);
    return user || null;
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = this.users.find((user) => user.getId() === id);
    return user || null;
  }

  async update(user: UserEntity): Promise<void> {
    const findIndex = this.users.findIndex(
      (user) => user.getId() === user.getId(),
    );
    if (findIndex) this.users[findIndex] = user;
  }
}
