import { Inject, Injectable } from '@nestjs/common';
import { IBaseUseCase } from 'src/app/shared';
import { ICoachRepository } from '../repositories';
import { CoachTransformer } from '../transformers';

@Injectable()
export class GetAllCoachesUseCase implements IBaseUseCase {
  constructor(
    @Inject('ICoachRepository')
    private readonly coachesRepository: ICoachRepository,
  ) {}

  public async execute() {
    const coaches = await this.coachesRepository.findAll({
      isEnabled: true,
    });
    return CoachTransformer.listAll(coaches);
  }
}
