import { BaseEntity, type IBaseConstructor } from 'src/app/shared';

interface IConstructor extends IBaseConstructor {
  trainingTypeId: number;
}

export class DefaultTrainingTypeEntity extends BaseEntity {
  private trainingTypeId: number;

  constructor({
    trainingTypeId,
    id,
    uuid,
    createdAt,
    updatedAt,
  }: IConstructor) {
    super(id, uuid, createdAt, updatedAt);
    this.trainingTypeId = trainingTypeId;
  }

  public update({ trainingTypeId }: Pick<IConstructor, 'trainingTypeId'>) {
    this.trainingTypeId = trainingTypeId;
  }

  public getTrainingTypeId(): number {
    return this.trainingTypeId;
  }
}
