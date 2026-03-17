import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeletePainDto } from '../dtos';
import { IPainRepository } from '../repositories';
import { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class DeletePainUseCase implements IBaseUseCase {
  constructor(
    @Inject('IPainRepository')
    private readonly injuryRepository: IPainRepository,
  ) {}

  async execute({ uuid }: DeletePainDto) {
    const { injury } = await this.validatePain(uuid);

    const injuryId = injury.getId();

    await this.injuryRepository.delete(injuryId);

    return { message: 'Dor excluída com sucesso!' };
  }

  private async validatePain(uuid: string) {
    const injury = await this.injuryRepository.findByUuid(uuid);

    if (!injury)
      throw new NotFoundException({
        title: 'Dor não encontrada!',
        message: 'Verifique e tente novamente...',
      });

    return { injury };
  }
}
