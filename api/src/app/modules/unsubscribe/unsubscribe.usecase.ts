import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UnsubscribeDto } from './unsubscribe.dto';
import type { IUnsubscribeRepository } from './unsubscribe.repository';
import type { IBaseResponse, IBaseUseCase } from 'src/app/shared';

@Injectable()
export class UnsubscribeUseCase implements IBaseUseCase {
  constructor(
    @Inject('IUnsubscribeRepository')
    private readonly unsubscribeRepository: IUnsubscribeRepository,
  ) {}

  public async execute(input: UnsubscribeDto): Promise<IBaseResponse> {
    const token = await this.unsubscribeRepository.findToken(input.token);

    if (!token) {
      throw new NotFoundException({
        title: 'Não foi possível cancelar a inscrição!',
        message: 'Token não encontrado! Verifique e tente novamente...',
      });
    }

    await this.validateUnsubscribe(input.email);
    await this.unsubscribeRepository.saveEmail(input.email);

    return {
      title: 'Inscrição cancelada com sucesso!',
      message: 'Você não receberá mais os e-mails de monitoramento...',
    };
  }

  private async validateUnsubscribe(email: string) {
    if (await this.unsubscribeRepository.findByEmail(email)) {
      throw new NotFoundException({
        title: 'A inscrição já foi cancela anteriormente!',
        message: 'Caso ainda esteja recebendo e-mails contate o suporte...',
      });
    }
  }
}
