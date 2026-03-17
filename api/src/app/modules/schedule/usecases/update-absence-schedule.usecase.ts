import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from 'src/app/shared';
import { UpdateAbsenceScheduleDto } from '../dtos';
import { AbsenceScheduleEntity } from '../entities';
import {  IScheduleRepository } from '../repositories';
import { ICoachRepository } from '../../coaches/repositories';
import { ValidateScheduleConflictUseCase } from './validate-conflict.usecase';

@Injectable()
export class UpdateAbsenceScheduleUseCase
  extends ValidateScheduleConflictUseCase
  implements IBaseUseCase
{
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
    @Inject('ICoachRepository')
    private readonly coachRepository: ICoachRepository,
  ) {
    super(scheduleRepository);
  }

  public async execute(uuid: string, payload: UpdateAbsenceScheduleDto) {
    const { start, end, coachId, description } = payload;

    const absence = await this.scheduleRepository.findAbsenceByUuid(uuid);

    if (!absence) {
      throw new NotFoundException({
        title: 'Ausência não encontrado.',
        message: `Não foi possível atualizar a ausência pois não o encontramos o agendamento. Verifique e tente novamente!`,
      });
    }
    const coach = await this.getCoach(coachId);
    await this.validateConflict({
      start,
      end,
      coachId: coach.getId(),
      ignoreId: { absence: absence.getId() },
    });

    absence.update({ start, end, coach, description });

    await this.scheduleRepository.updateAbsence(absence);

    return {
      title: 'Ausência atualizada!',
      message:
        'O colaborador não poderá ser relacionado a nenhum treino durante o período informado.',
    };
  }

  private async getCoach(coachId: string) {
    const coach = await this.coachRepository.findByUuid(coachId);
    if (!coach) this.notFoundException('Colaborador');
    return coach;
  }

  private notFoundException(entity: string) {
    throw new NotFoundException({
      title: entity.concat(' não encontrado.'),
      message: `Não foi possível concluir o agendamento da ausência pois não encontramos o ${entity}. Verifique e tente novamente!`,
    });
  }
}
