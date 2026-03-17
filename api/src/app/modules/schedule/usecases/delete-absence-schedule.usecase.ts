import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from 'src/app/shared';
import { IScheduleRepository } from '../repositories';

@Injectable()
export class DeleteAbsenceScheduleUseCase implements IBaseUseCase {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
  ) {}
  public async execute(uuid: string) {
    const { absence } = await this.validateAbsence(uuid);
    await this.scheduleRepository.deleteAbsence(absence);

    return {
      title: 'Bloqueio de agenda deletado!',
    };
  }

  private async validateAbsence(uuid: string) {
    const absence = await this.scheduleRepository.findAbsenceByUuid(uuid);

    if (!absence)
      throw new NotFoundException({
        title: 'Bloqueio de agenda não encontrado.',
        message:
          'Não foi possível concluir a exclusão pois não encontramos o Bloqueio de agenda. Verifique e tente novamente!',
      });

    return { absence };
  }
}
