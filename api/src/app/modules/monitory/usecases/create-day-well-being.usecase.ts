import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAthleteRepository } from '../../athlete';
import { WellBeingMonitoryEntity } from '../entities';
import { CreateDayWellBeingDto } from '../dtos';
import type { IWellBeingRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreateDayWellBeingUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('IWellBeingRepository')
    private readonly wellBeingRepository: IWellBeingRepository,
  ) {}

  async execute(input: CreateDayWellBeingDto) {
    const { athleteId, date } = input;
    const athlete = await this.athleteRepository.findByUuid(athleteId);

    if (!athlete)
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });
    

    const capture = new WellBeingMonitoryEntity({
      ...input,
      date: new Date(date),
      athleteId: athlete.getId(),
    });

    await this.wellBeingRepository.capture(capture);

    return {
      title: 'Bem-estar diário cadastrado com sucesso!',
      message: 'As informações já serão muito importantes para o planejamento a seguir.',
    };
  }
}
