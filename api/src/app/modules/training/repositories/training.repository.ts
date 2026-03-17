import { TrainingEntity } from '../entities';

export interface ITrainingRepository {
  create(entity: TrainingEntity): Promise<{ uuid: string }>;
  delete(uuid: string): Promise<void>;
  findByUuid(uuid: string): Promise<TrainingEntity | null>;
  update(training: TrainingEntity): Promise<void>;
  find(search: {
    athleteId: number;
    startDate: Date;
    endDate: Date;
  }): Promise<TrainingEntity[]>;
}
