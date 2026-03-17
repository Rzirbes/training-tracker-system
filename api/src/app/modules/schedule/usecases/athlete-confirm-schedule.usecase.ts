import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from 'src/app/shared';
import { IScheduleRepository } from '../repositories';
import { AthleteConfirmScheduleResponseDto } from '../dtos';

@Injectable()
export class AthleteConfirmScheduleUseCase implements IBaseUseCase {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
  ) {}
  public async execute(id: string): Promise<AthleteConfirmScheduleResponseDto> {
    const { schedule } = await this.validateSchedule(id);

    const alreadyConfirmed = schedule.getConfirmed();
    if (alreadyConfirmed)
      return new AthleteConfirmScheduleResponseDto(schedule);

    schedule.confirm();

    await this.scheduleRepository.confirm(schedule);

    return new AthleteConfirmScheduleResponseDto(schedule);
  }

  private async validateSchedule(id: string) {
    const schedule = await this.scheduleRepository.findByUuid(id);

    if (!schedule)
      throw new NotFoundException({
        title: 'Agendamento não encontrado.',
        message:
          'Não foi possível confirmar sua presença pois não encontramos o Agendamento. Verifique e tente novamente!',
      });

    return { schedule };
  }
}
