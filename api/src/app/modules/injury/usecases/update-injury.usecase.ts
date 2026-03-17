import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjuryDto } from '../dtos';
import type { IInjuryRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class UpdateInjuryUseCase implements IBaseUseCase {
  constructor(
    @Inject('IInjuryRepository')
    private readonly injuryRepository: IInjuryRepository,
  ) {}

  async execute(id: string, input: InjuryDto) {
    const injury = await this.injuryRepository.findByUuid(id);

    if (!injury)
      throw new NotFoundException({
        title: 'Lesão não encontrada!',
        message: 'Verifique e tente novamente...',
      });

    injury.update(input);

    await this.injuryRepository.update(injury);

    return { message: 'Lesão atualizada com sucesso!'}
  }
}
