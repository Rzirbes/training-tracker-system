import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetPainResponseDto } from '../dtos';
import type { IBaseUseCase } from 'src/app/shared';
import type { IPainRepository } from '../repositories';

@Injectable()
export class FindPainUseCase implements IBaseUseCase {
  constructor(
    @Inject('IPainRepository')
    private readonly injuryRepository: IPainRepository,
  ) {}

  async execute(uuid: string): Promise<GetPainResponseDto> {
    const entity = await this.injuryRepository.findByUuid(uuid);

    if (!entity)
      throw new NotFoundException({
        title: 'Dor não encontrada!',
        message: 'Verifique e tente novamente...',
      });
    

    return entity.toJSON();
  }
}
