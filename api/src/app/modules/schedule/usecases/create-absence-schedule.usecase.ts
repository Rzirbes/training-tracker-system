import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase } from 'src/app/shared';
import {  CreateAbsenceScheduleDto } from '../dtos';
import { AbsenceScheduleEntity } from '../entities';
import {  IScheduleRepository } from '../repositories';
import { ICoachRepository } from '../../coaches/repositories';
import { ValidateScheduleConflictUseCase } from './validate-conflict.usecase';

@Injectable()
export class CreateAbsenceScheduleUseCase
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

  public async execute({
    start,
    end,
    coachId,
    description,
  }: CreateAbsenceScheduleDto) {
    const coach = await this.getEntities(coachId);

    await this.validateConflict({ start, end, coachId: coach.getId() });

    const absence = new AbsenceScheduleEntity({
      start,
      end,
      coach,
      description,
    });

    await this.scheduleRepository.createAbsence(absence);

    return {
      title: 'Ausência registada!',
      message:
        'O colaborador não poderá ser relacionado a nenhum treino durante o período informado.',
    };
  }

  private async getEntities(coachId: string) {
    const coach = await this.coachRepository.findByUuid(coachId);
    if (!coach) this.notFoundException('Colaborador');
    return coach;
  }

  private notFoundException(entity: string) {
    throw new NotFoundException({
      title: entity.concat(' não encontrado.'),
      message: `Não foi possível concluir o agendamento pois não encontramos o ${entity}. Verifique e tente novamente!`,
    });
  }
}
