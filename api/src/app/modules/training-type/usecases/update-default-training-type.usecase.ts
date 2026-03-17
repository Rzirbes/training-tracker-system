import { IBaseUseCase } from "src/app/shared";
import { IDefaultTrainingTypeRepository, ITrainingTypeRepository } from "../repositories";
import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { UpdateDefaultTrainingTypeDto } from "../dtos";
import { DefaultTrainingTypeEntity } from "../entities";

export class UpdateDefaultTrainingTypeUseCase implements IBaseUseCase {
  constructor(
    @Inject('IDefaultTrainingTypeRepository')
    private readonly defaultTrainingTypeRepository: IDefaultTrainingTypeRepository,
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
  ) {}

  public async execute(input: UpdateDefaultTrainingTypeDto) {
    try {
      const trainingTypeUuid = input.trainingTypeId;

      const trainingType = await this.trainingTypeRepository.findByUuid(
        trainingTypeUuid,
      );

      if (!trainingType) throw new NotFoundException({
        title: 'Tipo de Treino não encontrado!',
        message: 'Não foi possível definir tipo de treino como Padrão...',
      });

      const trainingTypeId = trainingType.getId()

      const defaultTrainingType =
        await this.defaultTrainingTypeRepository.findUnique();


      if (!defaultTrainingType) {
        await this.defaultTrainingTypeRepository.create(
          new DefaultTrainingTypeEntity({ trainingTypeId }),
        );

        return { message: `Tipo de treino '${trainingType.getName()}' definido como Padrão!` };
      }

      defaultTrainingType.update({ trainingTypeId });
      await this.defaultTrainingTypeRepository.update(defaultTrainingType);

      return { message: `Tipo de treino '${trainingType.getName()}' definido como Padrão!` };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}