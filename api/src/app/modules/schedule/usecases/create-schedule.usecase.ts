import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase, MailQueueEnum } from 'src/app/shared';
import { CreateScheduleDto } from '../dtos';
import { ScheduleEntity } from '../entities';
import { IScheduleRepository } from '../repositories';
import { AthleteEntity, IAthleteRepository } from '../../athlete';
import { TrainingPlanningEntity } from '../../training-planning';
import { ICoachRepository } from '../../coaches/repositories';
import { ITrainingTypeRepository } from '../../training-type';
import { IQueueRepository } from '../../queues';
import { ValidateScheduleConflictUseCase } from './validate-conflict.usecase';
import { CoachEntity } from '../../coaches/entities';

@Injectable()
export class CreateScheduleUseCase
  extends ValidateScheduleConflictUseCase
  implements IBaseUseCase
{
  private WEEKDAY_MAP: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
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
    start,
    end,
    recurrence,
    athleteId,
    coachId,
    trainingPlanning: { trainingTypeId, ...trainingPlanning },
  }: CreateScheduleDto) {
    const { athlete, coach, trainingType } = await this.validateEntities(
      athleteId,
      coachId,
      trainingTypeId,
    );

    await this.validateConflict({
      start,
      end,
      coachId: coach.getId(),
      athleteId: athlete.getId(),
    });

    const initialSchedule = new ScheduleEntity({
      start,
      end,
      athlete,
      coach,
      trainingPlanning: new TrainingPlanningEntity({
        ...trainingPlanning,
        athleteId: athlete.getId(),
        trainingTypeId: trainingType.getId(),
        date: start,
      }),
    });

    const schedules: ScheduleEntity[] = [initialSchedule];

    if (recurrence && !!recurrence.sessions && !!recurrence.days?.length) {
      const recurrenceSchedules = this.generateRecurrenceSchedules(
        start,
        end,
        recurrence.sessions,
        recurrence.days,
        athlete,
        coach,
        trainingPlanning,
        trainingType.getId(),
      );

      for (const schedule of recurrenceSchedules) {
        await this.validateConflict({
          start: schedule.getStart(),
          end: schedule.getEnd(),
          coachId: coach.getId(),
          athleteId: athlete.getId(),
        });
      }

      schedules.push(...recurrenceSchedules);
    }

    const created = await Promise.all(
      schedules.map((schedule) => this.scheduleRepository.create(schedule)),
    );

    const shouldNotification = await this.notification(
      created[0].uuid,
      schedules[0],
    );

    return {
      title: 'Agendamento registado!',
      ...(shouldNotification && {
        message:
          'Enviaremos uma notificação para o atleta informando sobre o agendamento.',
      }),
    };
  }

  private generateRecurrenceSchedules(
    start: Date,
    end: Date,
    sessions: number,
    days: string[],
    athlete: AthleteEntity,
    coach: CoachEntity,
    trainingPlanning: Omit<
      CreateScheduleDto['trainingPlanning'],
      'trainingTypeId'
    >,
    trainingTypeId: number,
  ): ScheduleEntity[] {
    const weekdays = days.map((day) => this.WEEKDAY_MAP[day.toLowerCase()]);
    const schedules: ScheduleEntity[] = [];
    let currentDate = new Date(start);
    let added = 0;

    while (added < sessions) {
      currentDate.setDate(currentDate.getDate() + 1);

      if (!weekdays.includes(currentDate.getDay())) continue;

      const startTime = new Date(currentDate);
      startTime.setHours(start.getHours(), start.getMinutes(), 0, 0);

      const endTime = new Date(startTime);
      endTime.setTime(startTime.getTime() + (end.getTime() - start.getTime()));

      schedules.push(
        new ScheduleEntity({
          start: startTime,
          end: endTime,
          athlete,
          coach,
          trainingPlanning: new TrainingPlanningEntity({
            ...trainingPlanning,
            athleteId: athlete.getId(),
            trainingTypeId,
            date: startTime,
          }),
        }),
      );

      added++;
    }

    return schedules;
  }

  private async notification(token: string, schedule: ScheduleEntity) {
    const now = new Date();

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const startDate = schedule.getStart();

    const shouldNotification =
      startDate.getTime() >= now.getTime() &&
      startDate.getTime() <= endOfDay.getTime();

    const athlete = schedule.getAthlete();
    const coach = schedule.getCoach();

    if (shouldNotification)
      await this.queueRepository.sendMailToQueue({
        token,
        name: athlete.getName(),
        email: athlete.getEmail(),
        type: MailQueueEnum.CREATE_SCHEDULE,
        schedule: {
          coach: coach.getName(),
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

    return shouldNotification;
  }

  private async validateEntities(
    athleteId: string,
    coachId: string,
    trainingTypeId: string,
  ) {
    const [athlete, coach, trainingType] = await Promise.all([
      this.athleteRepository.findByUuid(athleteId),
      this.coachRepository.findByUuid(coachId),
      this.trainingTypeRepository.findByUuid(trainingTypeId),
    ]);

    if (!athlete) this.notFoundException('Atleta');
    if (!coach) this.notFoundException('Colaborador');
    if (!trainingType) this.notFoundException('Tipo de treino');

    return { athlete, coach, trainingType };
  }

  private notFoundException(entity: string) {
    throw new NotFoundException({
      title: entity.concat(' não encontrado.'),
      message: `Não foi possível concluir o agendamento pois não encontramos o ${entity}. Verifique e tente novamente!`,
    });
  }
}
