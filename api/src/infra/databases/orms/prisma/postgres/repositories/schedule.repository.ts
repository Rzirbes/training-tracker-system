import { Injectable } from '@nestjs/common';
import {
  AbsenceScheduleEntity,
  ScheduleEntity,
} from 'src/app/modules/schedule/entities';
import { IScheduleRepository } from 'src/app/modules/schedule/repositories';
import { PrismaPGService } from '../prisma-pg.service';
import { AthleteAdapter, TrainingPlanningAdapter } from '../adapters';
import { TrainingPlanningEntity } from 'src/app/modules/training-planning';
import { CoachEntity } from 'src/app/modules/coaches/entities';
import { TrainingTypeEntity } from 'src/app/modules/training-type';
import { SortDirectionEnum } from 'src/app/shared';

@Injectable()
export class SchedulePostgresRepository implements IScheduleRepository {
  private include = {
    athlete: true,
    coach: true,
    trainingPlanning: {
      include: {
        trainingType: true,
      },
    },
  };

  constructor(private readonly prismaService: PrismaPGService) {}
  async create(schedule: ScheduleEntity): Promise<{ uuid: string }> {
    const trainingPlanning = schedule.getTrainingPlanning();
    const athleteId = schedule.getAthlete().getId();

    const { uuid } = await this.prismaService.scheduleWorkout.create({
      data: {
        start: schedule.getStart(),
        end: schedule.getEnd(),
        athlete: {
          connect: {
            id: athleteId,
          },
        },
        coach: {
          connect: {
            id: schedule.getCoach().getId(),
          },
        },
        trainingPlanning: {
          create: TrainingPlanningAdapter.create(trainingPlanning),
        },
      },
    });

    return { uuid };
  }

  async find(query?: { start: Date; end: Date; userId?: number }) {
    const schedules = await this.prismaService.scheduleWorkout.findMany({
      include: this.include,
      where: {
        start: {
          gte: query?.start,
        },
        end: {
          lte: query?.end,
        },
        coach: {
          user: {
            id: query.userId,
          },
        },
      },
      orderBy: [
        { start: SortDirectionEnum.ASC },
        {
          coach: {
            name: SortDirectionEnum.ASC,
          },
        },
      ],
    });
    return schedules.map(
      ({ athlete, coach, trainingPlanning, ...schedule }) =>
        new ScheduleEntity({
          ...schedule,
          athlete: AthleteAdapter.create(athlete),
          coach: new CoachEntity(coach),
          trainingPlanning: new TrainingPlanningEntity({
            ...trainingPlanning,
            trainingType: new TrainingTypeEntity(trainingPlanning.trainingType),
          }),
        }),
    );
  }

  async findByUuid(uuid: string): Promise<ScheduleEntity | null> {
    const { athlete, coach, trainingPlanning, ...schedule } =
      await this.prismaService.scheduleWorkout.findUnique({
        where: { uuid },
        include: this.include,
      });

    return new ScheduleEntity({
      ...schedule,
      athlete: AthleteAdapter.create(athlete),
      coach: new CoachEntity(coach),
      trainingPlanning: new TrainingPlanningEntity({
        ...trainingPlanning,
        trainingType: new TrainingTypeEntity(trainingPlanning.trainingType),
      }),
    });
  }

  async update(schedule: ScheduleEntity): Promise<void> {
    const trainingPlanning = schedule.getTrainingPlanning();
    await this.prismaService.scheduleWorkout.update({
      where: { id: schedule.getId() },
      data: {
        start: schedule.getStart(),
        end: schedule.getEnd(),
        confirmed: schedule.getConfirmed(),
        canceled: schedule.getCanceled(),
        coach: {
          connect: {
            id: schedule.getCoach().getId(),
          },
        },
        trainingPlanning: {
          update: {
            date: schedule.getStart(),
            duration: trainingPlanning.getDuration(),
            description: trainingPlanning.getDescription(),
            pse: trainingPlanning.getPSE(),
            trainingTypeId: trainingPlanning.getTrainingTypeId(),
          },
        },
      },
    });
  }

  async confirm(schedule: ScheduleEntity): Promise<void> {
    await this.prismaService.scheduleWorkout.update({
      where: { id: schedule.getId() },
      data: {
        confirmed: schedule.getConfirmed(),
        canceled: schedule.getCanceled(),
      },
    });
  }

  async cancel(schedule: ScheduleEntity): Promise<void> {
    await this.prismaService.scheduleWorkout.update({
      where: { id: schedule.getId() },
      data: {
        confirmed: schedule.getConfirmed(),
        canceled: schedule.getCanceled(),
      },
    });
  }

  async delete(schedule: ScheduleEntity): Promise<void> {
    await this.prismaService.$transaction(async (prisma) => {
      await prisma.scheduleWorkout.delete({
        where: { id: schedule.getId() },
      });
      await prisma.trainingPlanning.delete({
        where: {
          id: schedule.getTrainingPlanning().getId(),
        },
      });
    });
  }

  async finish(schedule: ScheduleEntity): Promise<void> {
    await this.prismaService.scheduleWorkout.update({
      where: { id: schedule.getId() },
      data: {
        finishTraining: {
          connect: {
            uuid: schedule.getIsFinished(),
          },
        },
      },
    });
  }

  async detectWorkoutConflict({
    start,
    end,
    athleteId,
    coachId,
    notId,
  }: {
    start: Date;
    end: Date;
    athleteId: number;
    coachId: number;
    notId?: number;
  }): Promise<{ athlete: boolean; coach: boolean }> {
    const conflicts = await this.prismaService.scheduleWorkout.findMany({
      where: {
        OR: [
          { athleteId, canceled: false },
          {
            coachId,
            canceled: false,
            coach: {
              allowScheduleConflict: false,
            },
          },
        ],
        AND: [
          {
            start: {
              lt: end,
            },
          },
          {
            end: {
              gt: start,
            },
          },
          {
            NOT: {
              id: notId,
            },
          },
        ],
      },
    });
    return conflicts.reduce(
      (conflict, schedule) => {
        if (schedule.athleteId === athleteId) conflict.athlete = true;
        if (schedule.coachId === coachId) conflict.coach = true;
        return conflict;
      },
      { athlete: false, coach: false } as Record<'athlete' | 'coach', boolean>,
    );
  }

  async createAbsence(
    absence: AbsenceScheduleEntity,
  ): Promise<{ uuid: string }> {
    const { uuid } = await this.prismaService.absenceSchedule.create({
      data: {
        start: absence.getStart(),
        end: absence.getEnd(),
        description: absence.getDescription(),
        coach: {
          connect: {
            id: absence.getCoach().getId(),
          },
        },
      },
    });

    return { uuid };
  }

  async findAbsences(query?: {
    start: Date;
    end: Date;
    userId?: number;
  }): Promise<AbsenceScheduleEntity[]> {
    const absences = await this.prismaService.absenceSchedule.findMany({
      include: {
        coach: true,
      },
      where: {
        start: {
          gte: query?.start,
        },
        end: {
          lte: query?.end,
        },
        coach: {
          user: {
            id: query.userId,
          },
        },
      },
      orderBy: [
        { start: SortDirectionEnum.ASC },
        {
          coach: {
            name: SortDirectionEnum.ASC,
          },
        },
      ],
    });

    return absences.map(
      ({ coach, ...absence }) =>
        new AbsenceScheduleEntity({
          ...absence,
          coach: new CoachEntity(coach),
        }),
    );
  }

  async detectAbsence({
    start,
    end,
    coachId,
    notId,
  }: {
    start: Date;
    end: Date;
    coachId: number;
    notId?: number;
  }): Promise<boolean> {
    const find = await this.prismaService.absenceSchedule.findFirst({
      select: { id: true },
      where: {
        coachId,
        AND: [
          {
            start: {
              lt: end,
            },
          },
          {
            end: {
              gt: start,
            },
          },
          {
            NOT: {
              id: notId,
            },
          },
        ],
      },
    });
    return !!find;
  }

  async findAbsenceByUuid(uuid: string): Promise<AbsenceScheduleEntity | null> {
    const absence = await this.prismaService.absenceSchedule.findUnique({
      where: { uuid },
      include: {
        coach: true,
      },
    });

    if (!absence) return null;
    return new AbsenceScheduleEntity({
      ...absence,
      coach: new CoachEntity(absence.coach),
    });
  }

  async updateAbsence(absence: AbsenceScheduleEntity): Promise<void> {
    await this.prismaService.absenceSchedule.update({
      where: { id: absence.getId() },
      data: {
        start: absence.getStart(),
        end: absence.getEnd(),
        description: absence.getDescription(),
        coach: {
          connect: {
            id: absence.getCoach().getId(),
          },
        },
      },
    });
  }

  async deleteAbsence(absence: AbsenceScheduleEntity): Promise<void> {
    await this.prismaService.absenceSchedule.delete({
      where: {
        id: absence.getId(),
      },
    });
  }
}
