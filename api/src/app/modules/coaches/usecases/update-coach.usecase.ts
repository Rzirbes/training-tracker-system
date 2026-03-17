import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IBaseUseCase } from 'src/app/shared';
import type { ICoachRepository } from '../repositories';
import { UpdateCoachDto } from '../dtos';

@Injectable()
export class UpdateCoachUseCase implements IBaseUseCase {
  constructor(
    @Inject('ICoachRepository')
    private readonly coachRepository: ICoachRepository,
  ) {}

  async execute({ uuid, ...data }: UpdateCoachDto) {
    try {
      const coach = await this.coachRepository.findByUuid(uuid);
      if (!coach) {
        throw new NotFoundException({
          title: 'Não foi possível encontrar o Colaborador.',
          description: 'Verifique e tente novamente.',
        });
      }

      coach.update(data);

      await this.coachRepository.update(coach);

      return {
        title: 'Colaborador atualizado com sucesso!',
      };
    } catch (error) {
      throw new BadRequestException({
        title: 'Não foi possível atualizar o Colaborador.',
        description: error?.message ?? 'Verifique e tente novamente.',
      });
    }
  }
}
