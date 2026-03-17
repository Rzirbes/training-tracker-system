import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IBaseResponse, IBaseUseCase } from 'src/app/shared';
import type { IAthleteRepository } from '../repositories';

@Injectable()
export class UpdateAthleteStatusUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
  ) {}

  async execute(uuid: string): Promise<IBaseResponse> {
    const athlete = await this.athleteRepository.findByUuid(uuid);
    if (!athlete) {
      throw new NotFoundException({
        title: 'Não foi possível encontrar o Atleta.',
        description: 'Verifique e tente novamente.',
      });
    }
    athlete.toggleIsEnabled();
    await this.athleteRepository.update(athlete);
    return this.buildMessage(athlete.getIsEnabled());
  }

  private buildMessage(isEnabled: boolean) {
    const title = `Atleta ${isEnabled ? 'ativado' : 'inativado'} com sucesso!`;
    const message = `Ele passará a ${
      isEnabled ? '' : 'não'
    } receber os e-mails de monitoramento.`;

    return {
      title,
      message,
    };
  }
}
