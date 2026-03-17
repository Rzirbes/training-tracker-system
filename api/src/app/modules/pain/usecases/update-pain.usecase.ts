import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PainDto } from '../dtos';
import type { IPainRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class UpdatePainUseCase implements IBaseUseCase {
  constructor(
    @Inject('IPainRepository')
    private readonly painRepository: IPainRepository,
  ) {}

  async execute(id: string, input: PainDto) {
    const injury = await this.painRepository.findByUuid(id);

    if (!injury)
      throw new NotFoundException({
        title: 'Dor não encontrada!',
        message: 'Verifique e tente novamente...',
      });

    injury.update(input);

    await this.painRepository.update(injury);

    return { message: 'Dor atualizada com sucesso!' };
  }
}
