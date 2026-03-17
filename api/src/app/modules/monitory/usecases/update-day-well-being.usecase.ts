import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IBaseUseCase } from 'src/app/shared';
import { UpdateDayWellBeingDto } from '../dtos';
import type { IWellBeingRepository } from '../repositories';

@Injectable()
export class UpdateDayWellBeingUseCase implements IBaseUseCase {
  constructor(
    @Inject('IWellBeingRepository')
    private readonly wellBeingRepository: IWellBeingRepository,
  ) {}

  async execute(uuid: string, input: UpdateDayWellBeingDto) {
    const wellbeing = await this.wellBeingRepository.findByUuid(uuid);

    if (!wellbeing)
      throw new NotFoundException({
        title: 'Bem-estar diário não encontrado!',
        message: 'Verifique e tente novamente...',
      });
    
    wellbeing.update(input)


    await this.wellBeingRepository.update(wellbeing);

    return {
      title: 'Bem-estar diário atualizado com sucesso!',
      message: 'As informações já serão muito importantes para o planejamento a seguir.',
    };
  }
}
