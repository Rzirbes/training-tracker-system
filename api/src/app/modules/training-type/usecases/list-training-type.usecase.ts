import { Inject, Injectable } from '@nestjs/common';
import { PaginateResponseDto, type IBaseUseCase } from 'src/app/shared';
import { ListTrainingTypeDto, ListTrainingTypeRequestDto } from '../dtos';
import type { ITrainingTypeRepository } from '../repositories';

@Injectable()
export class ListTrainingTypeUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
  ) {}

  async execute({
    page = 1,
    size = 10,
    search,
  }: ListTrainingTypeRequestDto): Promise<
    PaginateResponseDto<ListTrainingTypeDto>
  > {
    const athletes = await this.trainingTypeRepository.list({
      page,
      size,
      search,
    });

    const total = await this.trainingTypeRepository.count({
      page,
      size,
      search,
    });

    return new PaginateResponseDto<ListTrainingTypeDto>({
      page,
      size,
      total,
      data: athletes.map((athlete) => ({
        id: athlete.getUuid(),
        name: athlete.getName(),
        isEnabled: athlete.getIsEnabled(),
        isDefault: athlete.getIsDefault(),
      })),
    });
  }
}
