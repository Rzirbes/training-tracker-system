import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePasswordDto } from '../dtos/create-password.dto';
import { IRecoveryTokenRepository } from '../repositories/recovery-token.repository';
import { IUserRepository } from '../../user/repositories/user.repository';
import { ISecurityRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreatePasswordUseCase implements IBaseUseCase {
  constructor(
    @Inject('IRecoveryTokenRepository')
    private readonly tokenRepository: IRecoveryTokenRepository,
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute({
    password,
    confirmPassword,
    token,
  }: CreatePasswordDto): Promise<void> {
    const today = new Date();

    if (password !== confirmPassword) {
      throw new BadRequestException({
        title: 'Senha e confirmação de senha não correspondem.',
        message: 'Verifique e tente novamente...',
      });
    }

    this.validatePassword(password);

    const findToken = await this.tokenRepository.findByToken(token);
    if (!findToken)
      throw new BadRequestException({
        title: 'Token não encontrado.',
        message: 'Verifique e tente novamente...',
      });

    const validateDate = today < findToken.getExpiresIn();

    if (!validateDate)
      throw new BadRequestException({
        title: 'Token expirado.',
        message: 'Verifique e tente novamente...',
      });

    if (!findToken.getIsValid())
      throw new BadRequestException({
        title: 'Token inválido.',
        message: 'Verifique e tente novamente...',
      });

    const user = await this.userRepository.findById(findToken.getUserId());

    if (!user)
      throw new NotFoundException({
        title: 'Usuário não encontrado.',
        message: 'Verifique o e-mail e tente novamente...',
      });

    const newPassword = await this.securityRepository.hashPassword(password);

    user.updatePassword(newPassword);

    findToken.invalid();

    await Promise.all([
      this.userRepository.update(user),
      this.tokenRepository.update(findToken),
    ]);
  }

  private validatePassword(password: string): void {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new BadRequestException({
        title: 'Senha inválida.',
        message:
          'A senha deve conter no mínimo 8 caracteres, sendo ao menos letras maiúscula e minúscula (no mínimo uma de cada), números e caracteres especiais. Verifique e tente novamente...',
      });
    }
  }
}
