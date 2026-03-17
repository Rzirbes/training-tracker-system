import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from 'src/app/shared';
import { IAthleteRepository } from '../repositories';

@Injectable()
export class GetAllAthletesUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
  ) {}

  public async execute() {
    const athletes = await this.athleteRepository.findAll({
      isEnabled: true,
    });
    return athletes.map((athlete) => ({
      id: athlete.getUuid(),
      name: athlete.getName(),
    }));
  }
}
