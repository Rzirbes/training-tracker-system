import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  GetDayWellBeingRequestDto,
  GetDayWellBeingResponseDto,
} from '../dtos';
import type { IAthleteRepository } from '../../athlete';
import type { IWellBeingRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class GetDayWellBeingUseCase implements IBaseUseCase {
  constructor(
    @Inject('IWellBeingRepository')
    private readonly wellBeingRepository: IWellBeingRepository,
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
  ) {}

  public async execute(
    input: GetDayWellBeingRequestDto,
  ): Promise<GetDayWellBeingResponseDto> {
    const { athleteId, date } = input;
    const athlete = await this.athleteRepository.findByUuid(athleteId);

    if (!athlete)
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 59);

    const wellBeing = await this.wellBeingRepository.getDay({
      athleteUuid: athlete.getUuid(),
      startDate,
      endDate,
    });

    if (!wellBeing) throw new NotFoundException({
      title: 'Bem-estar diário não encontrado!',
      message: 'Verifique e tente novamente...',
    });


    return new GetDayWellBeingResponseDto(wellBeing);
  }
}
