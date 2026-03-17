import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from 'src/app/shared';
import { IScheduleRepository } from '../repositories';
import { AthleteCancelScheduleResponseDto } from '../dtos';

@Injectable()
export class AthleteCancelScheduleUseCase implements IBaseUseCase {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
  ) {}
  public async execute(id: string): Promise<AthleteCancelScheduleResponseDto> {
    const { schedule } = await this.validateSchedule(id);

    const alreadyCanceled = schedule.getCanceled();
    if (alreadyCanceled) return new AthleteCancelScheduleResponseDto(schedule);

    schedule.cancel();

    await this.scheduleRepository.cancel(schedule);

    return new AthleteCancelScheduleResponseDto(schedule);
  }

  private async validateSchedule(id: string) {
    const schedule = await this.scheduleRepository.findByUuid(id);

    if (!schedule)
      throw new NotFoundException({
        title: 'Agendamento não encontrado.',
        message:
          'Não foi possível concluir o cancelamento pois não encontramos o Agendamento. Verifique e tente novamente!',
      });

    return { schedule };
  }
}
