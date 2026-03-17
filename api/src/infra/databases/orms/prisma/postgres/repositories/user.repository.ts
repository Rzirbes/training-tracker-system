import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/app/modules/user';
import { PrismaPGService } from '../prisma-pg.service';
import type { IUserRepository } from 'src/app/modules/user/repositories';

@Injectable()
export class UserPostgresRepository implements IUserRepository {
  private baseInclude = {
    coach: {
      select: { id: true },
    },
  };

  constructor(private readonly prismaService: PrismaPGService) {}

  public async create(user: UserEntity): Promise<{ id: number }> {
    try {
      const email = user.getEmail();
      const name = user.getName();
      const { id } = await this.prismaService.user.create({
        data: {
          email,
          name,
          password: user.getPassword(),
          firstAccess: user.getFirstAccess(),
          role: user.getRole(),
        },
      });
      return { id };
    } catch (err) {
      throw new Error('Não foi possível criar o usuário no banco de dados.');
    }
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: this.baseInclude,
    });
    if (!user) return null;
    return new UserEntity({ ...user, coachId: user?.coach?.id });
  }

  public async findByUuid(uuid: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({ where: { uuid } });
    if (!user) return null;
    return new UserEntity(user);
  }

  public async findById(id: number): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: this.baseInclude,
    });
    if (!user) return null;
    return new UserEntity({ ...user, coachId: user?.coach?.id });
  }

  public async update(user: UserEntity): Promise<void> {
    await this.prismaService.user.update({
      where: { id: user.getId() },
      data: {
        password: user.getPassword(),
        firstAccess: user.getFirstAccess(),
        isEnabled: user.getIsEnabled(),
      },
    });
  }
}
