import { Inject, Injectable } from '@nestjs/common';
import { GetCoachesDto, GetCoachesRequestDto } from '../dtos';
import { PaginateResponseDto, type IBaseUseCase } from 'src/app/shared';
import { CoachTransformer } from '../transformers';
import type { ICoachRepository } from '../repositories';

@Injectable()
export class GetCoachesUseCase implements IBaseUseCase {
  constructor(
    @Inject('ICoachRepository')
    private readonly coachRepository: ICoachRepository,
  ) {}

  async execute({
    page = 1,
    size = 10,
    search,
    isEnabled,
  }: GetCoachesRequestDto): Promise<PaginateResponseDto<GetCoachesDto>> {
    const coaches = await this.coachRepository.findAll({
      page,
      size,
      search,
      isEnabled,
    });

    const total = await this.coachRepository.count({
      page,
      size,
      search,
      isEnabled,
    });

    return new PaginateResponseDto<GetCoachesDto>({
      page,
      size,
      total,
      data: CoachTransformer.paginate(coaches),
    });
  }
}
