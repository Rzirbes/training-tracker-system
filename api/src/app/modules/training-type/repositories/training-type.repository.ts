import { TrainingTypeEntity } from '../entities';
import { ListTrainingTypeRequestDto } from '../dtos';

export interface ITrainingTypeRepository {
  create(trainingType: TrainingTypeEntity): Promise<void>;
  list(query: ListTrainingTypeRequestDto): Promise<TrainingTypeEntity[]>;
  count(query: ListTrainingTypeRequestDto): Promise<number>;
  findByUuid(uuid: string): Promise<TrainingTypeEntity | null>;
  findAll(props?: { isEnabled: boolean }): Promise<TrainingTypeEntity[]>;
  update(trainingType: TrainingTypeEntity): Promise<void>;
}
