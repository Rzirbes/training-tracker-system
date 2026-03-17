import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTrainingDto } from '../dtos';
import { TrainingEntity } from '../entities';
import {
  UpdateWeekLoadUseCase,
  type IMonitoryRepository,
} from '../../monitory';
import type { ITrainingRepository } from '../repositories';
import type { ITrainingTypeRepository } from '../../training-type';
import type { IBaseUseCase } from 'src/app/shared';
import { InjuryEntity } from '../../injury/entities';
import { IInjuryRepository } from '../../injury/repositories';
import { PainEntity } from '../../pain/entities';
import { IPainRepository } from '../../pain/repositories';

@Injectable()
export class UpdateTrainingUseCase
  extends UpdateWeekLoadUseCase
  implements IBaseUseCase
{
  constructor(
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
    @Inject('IMonitoryRepository')
    private readonly _: IMonitoryRepository,
    @Inject('IInjuryRepository')
    private readonly injuryRepository: IInjuryRepository,
    @Inject('IPainRepository')
    private readonly painRepository: IPainRepository,
  ) {
    super(_, trainingRepository);
  }

  async execute(input: UpdateTrainingDto) {
    const {
      id,
      trainingTypeUuid,
      date,
      duration,
      pse,
      description,
      psr,
      injuries,
      pains,
    } = input;

    const training = await this.trainingRepository.findByUuid(id);

    if (!training)
      throw new NotFoundException({
        title: 'Planejamento de treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    await this.validateTrainingType(training, trainingTypeUuid);

    training.update({
      date,
      duration,
      pse,
      description,
      psr,
    });

    await this.trainingRepository.update(training);

    await this.updateInjuries(training, injuries);
    await this.updatePains(training, pains);

    await this.updateWeekLoad({
      date,
      athleteId: training.getAthleteId(),
    });
  }

  private async validateTrainingType(
    training: TrainingEntity,
    trainingTypeUuid: string,
  ) {
    if (trainingTypeUuid !== training.getTrainingType().getUuid()) {
      const trainingType = await this.trainingTypeRepository.findByUuid(
        trainingTypeUuid,
      );

      if (!trainingType)
        throw new NotFoundException({
          title: 'Tipo de Treino não encontrado!',
          message: 'Verifique e tente novamente...',
        });

      training.updateTrainingTypeId(trainingType.getId());
    }
  }

  private async updateInjuries(
    training: TrainingEntity,
    newItems: UpdateTrainingDto['injuries'],
  ) {
    const oldItems = training.getInjuries();

    const oldMap = new Map(
      oldItems?.map((item) => {
        const uuid = item.getUuid();
        return [uuid, item];
      }),
    );
    const newMap = new Map(newItems?.map((item) => [item.uuid, item]));

    const created: InjuryEntity[] = newItems
      ?.filter((item) => !item.uuid)
      ?.map(
        (data) =>
          new InjuryEntity({
            ...data,
            athleteId: training.getAthleteId(),
            trainingId: training.getId(),
          }),
      );

    if (created?.length) await this.injuryRepository.createMany(created);

    const updated: InjuryEntity[] = newItems
      ?.map((item) => {
        if (!item?.uuid) return null;

        const old = oldMap?.get(item.uuid);
        old?.update(item);
        return old;
      })
      ?.filter(Boolean);

    if (updated?.length) await this.injuryRepository.updateMany(updated);

    const deleted: InjuryEntity[] = oldItems?.filter(
      (item) => !newMap.has(item.getUuid()),
    );

    if (deleted?.length) await this.injuryRepository.deleteMany(deleted);
  }

  private async updatePains(
    training: TrainingEntity,
    newItems: UpdateTrainingDto['pains'],
  ) {
    const oldItems = training.getPains();

    const oldMap = new Map(
      oldItems?.map((item) => {
        const uuid = item.getUuid();
        return [uuid, item];
      }),
    );
    const newMap = new Map(newItems?.map((item) => [item.uuid, item]));

    const created: PainEntity[] = newItems
      ?.filter((item) => !item.uuid)
      ?.map(
        (data) =>
          new PainEntity({
            ...data,
            athleteId: training.getAthleteId(),
            trainingId: training.getId(),
          }),
      );

    if (created?.length) await this.painRepository.createMany(created);

    const updated: PainEntity[] = newItems
      ?.map((item) => {
        if (!item.uuid) return;
        const old = oldMap.get(item.uuid);
        old?.update(item);
        return old;
      })
      ?.filter(Boolean);

    if (updated?.length) await this.painRepository.updateMany(updated);

    const deleted: PainEntity[] = oldItems?.filter(
      (item) => !newMap.has(item.getUuid()),
    );

    if (deleted?.length) await this.painRepository.deleteMany(deleted);
  }
}
