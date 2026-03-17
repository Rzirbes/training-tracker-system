import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateTrainingTypeDto } from '../dtos';
import { TrainingTypeEntity } from '../entities';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingTypeRepository } from '../repositories';

@Injectable()
export class CreateTrainingTypeUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
  ) {}

  async execute(input: CreateTrainingTypeDto): Promise<void> {
    const trainingType = new TrainingTypeEntity(input);
    await this.trainingTypeRepository.create(trainingType);
  }
}
