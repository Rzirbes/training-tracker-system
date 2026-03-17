import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDto } from '../dtos';
import { UserEntity } from '../../user';
import { IBaseUseCase } from 'src/app/shared';
import { ISecurityRepository } from '../repositories';
import { IUserRepository } from '../../user/repositories';

@Injectable()
export class LoginUseCase implements IBaseUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ISecurityRepository')
    private readonly hashRepository: ISecurityRepository,
  ) {}

  public async execute({
    email,
    password,
  }: LoginRequestDto): Promise<UserEntity> {
    const user = await this.validateUser(email);
    await this.validatePassword(password, user.getPassword());

    return user;
  }

  private async validateUser(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      this.unauthenticated();
    }

    if (!user.getIsEnabled()) {
      const title = 'Usuário desabilitado!';
      const message = 'Entre em contato com o administrador...';

      throw new ForbiddenException({ title, message });
    }

    return user;
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const valid = await this.hashRepository.comparePasswords(
      password,
      hashedPassword,
    );

    if (!valid) {
      this.unauthenticated();
    }
  }

  private unauthenticated(): never {
    throw new UnauthorizedException({
      title: 'Não foi possível fazer o login!',
      message: 'Credenciais inválidas.',
    });
  }
}
