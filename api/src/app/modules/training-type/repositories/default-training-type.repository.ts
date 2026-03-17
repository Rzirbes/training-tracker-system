import { DefaultTrainingTypeEntity } from '../entities';

export interface IDefaultTrainingTypeRepository {
  create(trainingType: DefaultTrainingTypeEntity): Promise<void>;
  findUnique(): Promise<DefaultTrainingTypeEntity | null>;
  update(trainingType: DefaultTrainingTypeEntity): Promise<void>;
}
