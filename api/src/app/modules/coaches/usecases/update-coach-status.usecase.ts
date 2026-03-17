import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IBaseUseCase } from 'src/app/shared';
import type { ICoachRepository } from '../repositories';

@Injectable()
export class UpdateCoachStatusUseCase implements IBaseUseCase {
  constructor(
    @Inject('ICoachRepository')
    private readonly coachRepository: ICoachRepository,
  ) {}

  async execute(uuid: string) {
    try {
      const coach = await this.coachRepository.findByUuid(uuid);
      if (!coach) {
        throw new NotFoundException({
          title: 'Não foi possível encontrar o Colaborador.',
          description: 'Verifique e tente novamente.',
        });
      }
      coach.toggleIsEnabled();
      await this.coachRepository.updateStatus(coach);
      return this.buildMessage(coach.getIsEnabled());
    } catch (error) {
      throw new BadRequestException({
        title: 'Não foi possível atualizar o status do Colaborador.',
        description: error?.message ?? 'Verifique e tente novamente.',
      });
    }
  }

  private buildMessage(isEnabled: boolean) {
    const status = isEnabled ? 'ativado' : 'inativado';
    const title = `Colaborador ${status} com sucesso!`;

    return {
      title,
    };
  }
}
