import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePainsDto } from '../dtos';
import { PainEntity } from '../entities';
import { IPainRepository } from '../repositories';
import { IAthleteRepository } from '../../athlete';
import { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreatePainUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('IPainRepository')
    private readonly injuryRepository: IPainRepository,
  ) {}

  async execute(input: CreatePainsDto) {
    const { athleteUuid = '' } = input;

    const { athlete } = await this.validateAthlete(athleteUuid);

    const athleteId = athlete.getId();

    const pains = input.pains.map(
      (data) => new PainEntity({ ...data, athleteId }),
    );
  
    await this.injuryRepository.createMany(pains);

    return { message: 'Dores cadastradas com sucesso!' }
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
