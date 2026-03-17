import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindCoachResponseDto } from '../dtos';
import type { ICoachRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class FindCoachUseCase implements IBaseUseCase {
  constructor(
    @Inject('ICoachRepository')
    private readonly coachRepository: ICoachRepository,
  ) {}

  async execute(uuid: string): Promise<FindCoachResponseDto> {
    const coach = await this.coachRepository.findByUuid(uuid, {
      include: { address: true },
    });

    if (!coach) {
      throw new NotFoundException({
        title: 'Não foi possível encontrar o Colaborador.',
        description: 'Verifique e tente novamente.',
      });
    }

    const address = coach.getAddress();

    return {
      id: coach.getUuid(),
      name: coach.getName(),
      email: coach.getEmail(),
      isEnabled: coach.getIsEnabled(),
      role: coach.getRole(),
      schedulerColor: coach.getSchedulerColor(),
      phone: coach.getPhone(),
      address: {
        buildingNumber: address?.getBuildingNumber(),
        street: address?.getStreet(),
        zipCode: address?.getZipCode(),
        neighborhood: address?.getNeighborhood(),
        complement: address?.getComplement(),
        cityId: address?.getCityId(),
        stateId: address?.getStateId(),
        countryId: address?.getCountryId(),
      },
    };
  }
}
