import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ListPainRequestDto,  ListPainResponseDto} from '../dtos';
import { bodySides,  injuryContexts, PaginateResponseDto, type IBaseUseCase } from 'src/app/shared';
import type { IPainRepository } from '../repositories';
import type { IAthleteRepository } from '../../athlete';

@Injectable()
export class ListPainUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('IPainRepository')
    private readonly injuryRepository: IPainRepository,
  ) {}

  public async execute(
    input: ListPainRequestDto,
  ): Promise<PaginateResponseDto<ListPainResponseDto>> {
    const { page = 1, size = 10, search = '', athleteUuid } = input;
    const athlete = await this.athleteRepository.findByUuid(athleteUuid);

    if (!athlete)
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    const startDate = new Date(input.startDate ?? '');
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(input.endDate ?? '');
    endDate.setHours(23, 59, 59, 59);

    const query = {
      athleteId: athlete.getId(),
      page,
      size,
      search,
      ...(input.startDate && { startDate }),
      ...(input.endDate && { endDate }),
    };

    const pains = await this.injuryRepository.list(query);
    const total = await this.injuryRepository.count(query);

    return new PaginateResponseDto({
      page,
      size,
      total,
      data: pains.map((entity) => {
        const props = entity.toJSON();
        return {
          ...props,
          id: entity.getUuid(),
          bodySide: bodySides[props.bodySide],
          occurredDuring: injuryContexts[props.occurredDuring],
        };
      }),
    });
  }
}
