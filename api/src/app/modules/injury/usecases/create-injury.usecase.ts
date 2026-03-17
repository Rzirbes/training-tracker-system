import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInjuriesDto } from '../dtos';
import { InjuryEntity } from '../entities';
import { IInjuryRepository } from '../repositories';
import { IAthleteRepository } from '../../athlete';
import { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreateInjuryUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('IInjuryRepository')
    private readonly injuryRepository: IInjuryRepository,
  ) {}

  async execute(input: CreateInjuriesDto) {
    const { athleteUuid = '' } = input;

    const { athlete } = await this.validateAthlete(athleteUuid);

    const athleteId = athlete.getId();

    const injuries = input.injuries.map(
      (data) => new InjuryEntity({ ...data, athleteId }),
    );
  
    await this.injuryRepository.createMany(injuries);

    return { message: 'Lesões cadastradas com sucesso!' }
  }

  private async validateAthlete(athleteUuid: string) {
    const athlete = await this.athleteRepository.findByUuid(athleteUuid);

    if (!athlete)
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });

  
    return { athlete };
  }
}
