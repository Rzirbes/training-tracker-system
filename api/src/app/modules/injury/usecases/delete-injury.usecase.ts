import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteInjuryDto } from '../dtos';
import { IInjuryRepository } from '../repositories';
import { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class DeleteInjuryUseCase implements IBaseUseCase {
  constructor(
    @Inject('IInjuryRepository')
    private readonly injuryRepository: IInjuryRepository,
  ) {}

  async execute({ uuid }: DeleteInjuryDto) {
    const { injury } = await this.validateInjury(uuid);

    const injuryId = injury.getId();

    await this.injuryRepository.delete(injuryId);

    return { message: 'Lesão excluída com sucesso!' };
  }

  private async validateInjury(uuid: string) {
    const injury = await this.injuryRepository.findByUuid(uuid);

    if (!injury)
      throw new NotFoundException({
        title: 'Lesão não encontrada!',
        message: 'Verifique e tente novamente...',
      });

    return { injury };
  }
}
