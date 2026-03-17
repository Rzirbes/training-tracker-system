import { ScheduleEntity } from '../entities';

export class FindScheduleByUuidResponseDto {
  type = 'SCHEDULE';

  id: string;
  start: Date;
  end: Date;
  confirmed: boolean;
  canceled: boolean;
  completed: boolean;
  athlete: {
    id: string;
    name: string;
  };
  trainer: {
    id: string;
    name: string;
    color: string;
  };
  trainingPlanning: {
    id: string;
    pse: number;
    duration: number;
    description?: string;
    trainingType: {
      id: string;
      name: string;
    };
  };

  constructor(entity: ScheduleEntity) {
    const athlete = entity.getAthlete();
    const coach = entity.getCoach();
    const trainingPlanning = entity.getTrainingPlanning();
    const trainingType = trainingPlanning.getTrainingType();

    this.id = entity.getUuid();
    this.start = entity.getStart();
    this.end = entity.getEnd();
    this.confirmed = entity.getConfirmed();
    this.canceled = entity.getCanceled();
    this.completed = Boolean(entity.getCompleted());
    this.athlete = {
      id: athlete.getUuid(),
      name: athlete.getName(),
    };
    this.trainer = {
      id: coach.getUuid(),
      name: coach.getName(),
      color: coach.getSchedulerColor(),
    };
    this.trainingPlanning = {
      id: trainingPlanning.getUuid(),
      pse: trainingPlanning.getPSE(),
      duration: trainingPlanning.getDuration(),
      description: trainingPlanning.getDescription(),
      trainingType: {
        id: trainingType.getUuid(),
        name: trainingType.getName(),
      },
    };
  }
}
