import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { compareDateTimes, IBaseUseCase, MailQueueEnum } from 'src/app/shared';
import { UpdateScheduleDto } from '../dtos';
import { ScheduleEntity } from '../entities';
import { IScheduleRepository } from '../repositories';
import { ICoachRepository } from '../../coaches/repositories';
import { ITrainingTypeRepository } from '../../training-type';
import { IQueueRepository } from '../../queues';
import { ValidateScheduleConflictUseCase } from './validate-conflict.usecase';

@Injectable()
export class UpdateScheduleUseCase
  extends ValidateScheduleConflictUseCase
  implements IBaseUseCase
{
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
    @Inject('ICoachRepository')
    private readonly coachRepository: ICoachRepository,
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
    @Inject('IQueueRepository')
    private readonly queueRepository: IQueueRepository,
  ) {
    super(scheduleRepository);
  }

  public async execute({
    id,
    start,
    end,
    coachId,
    trainingPlanning: { trainingTypeId, duration, pse, description },
  }: UpdateScheduleDto) {
    const { schedule, coach, trainingType } = await this.validateEntities(
      id,
      coachId,
      trainingTypeId,
    );

    const compare = {
      start: compareDateTimes(new Date(start), schedule.getStart()),
      end: compareDateTimes(new Date(end), schedule.getEnd()),
    };

    const changedDate = !compare.start || !compare.end;

    if (changedDate)
    await this.validateConflict({
      start,
      end,
      coachId: coach.getId(),
      ignoreId: { schedule: schedule.getId() },
    });

    const trainingPlanning = schedule.getTrainingPlanning();

    trainingPlanning.updateTrainingTypeId(trainingType.getId());

    trainingPlanning.update({
      date: start,
      duration,
      pse,
      description,
      trainingType,
    });

    schedule.update({
      start,
      end,
      coach,
      trainingPlanning,
    });

    await this.scheduleRepository.update(schedule);

    const shouldNotification = await this.notification(schedule, changedDate);

    return {
      title: 'Agendamento atualizado!',
      ...(shouldNotification && {
        message:
          'Enviaremos uma notificação para o atleta informando sobre a atualização.',
      }),
    };
  }

  private async notification(schedule: ScheduleEntity, changedDate: boolean) {
    const now = new Date();

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const startDate = schedule.getStart();

    const shouldNotification =
      changedDate &&
      startDate.getTime() >= now.getTime() &&
      startDate.getTime() <= endOfDay.getTime();

    const athlete = schedule.getAthlete();

    if (shouldNotification) {
      await this.queueRepository.sendMailToQueue({
        token: schedule.getUuid(),
        name: athlete.getName(),
        email: athlete.getEmail(),
        type: MailQueueEnum.UPDATE_SCHEDULE,
        schedule: {
          date: schedule
            .getStart()
            .toLocaleDateString('pt-BR', { dateStyle: 'full' }),
          time: {
            start: schedule.getStart().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            end: schedule.getEnd().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        },
      });
    }

    return shouldNotification;
  }

  private async validateEntities(
    scheduleId: string,
    coachId: string,
    trainingTypeId: string,
  ) {
    const [schedule, coach, trainingType] = await Promise.all([
      this.scheduleRepository.findByUuid(scheduleId),
      this.coachRepository.findByUuid(coachId),
      this.trainingTypeRepository.findByUuid(trainingTypeId),
    ]);

    if (!schedule) this.notFoundException('Agendamento');

    if (!coach) this.notFoundException('Colaborador');

    if (!trainingType) this.notFoundException('Tipo de treino');

    return { schedule, coach, trainingType };
  }

  private notFoundException(entity: string) {
    throw new NotFoundException({
      title: entity.concat(' não encontrado.'),
      message: `Não foi possível concluir a atualização pois não encontramos o ${entity}. Verifique e tente novamente!`,
    });
  }
}
