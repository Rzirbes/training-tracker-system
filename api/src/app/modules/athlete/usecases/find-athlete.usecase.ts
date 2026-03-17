import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindAthleteResponseDto } from '../dtos';
import type { IAthleteRepository } from '../repositories';
import type { IBucketRepository } from '../../buckets/repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class FindAthleteUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('IBucketRepository')
    private readonly bucketRepository: IBucketRepository,
  ) {}

  async execute(uuid: string): Promise<FindAthleteResponseDto> {
    const athlete = await this.athleteRepository.findByUuid(uuid);

    if (!athlete) {
      throw new NotFoundException({
        title: 'Não foi possível encontrar o Atleta.',
        description: 'Verifique e tente novamente.',
      });
    }

    const avatar = athlete.getAvatar();
    const avatarUrl = !!avatar
      ? this.bucketRepository.getStaticUrl(avatar)
      : undefined;

    const address = athlete.getAddress();

    return {
      avatarUrl,
      id: athlete.getUuid(),
      name: athlete.getName(),
      email: athlete.getEmail(),
      birthday: athlete.getBirthday(),
      height: athlete.getHeight(),
      weight: athlete.getWeight(),
      isEnabled: athlete.getIsEnabled(),
      cpf: athlete.getCpfMasked(),
      phone: athlete.getPhone(),
      position: athlete.getPosition(),
      positions: athlete.getPositions(),
      isMonitorDaily: athlete.getIsMonitorDaily(),
      dominantFoot: athlete.getDominantFoot(),
      bestSkill: athlete.getBestSkill(),
      worstSkill: athlete.getWorstSkill(),
      goal: athlete.getGoal(),
      observation: athlete.getObservation(),
      injuries: athlete
        .getInjuries()
        .map((entity) => ({ ...entity.toJSON(), uuid: entity.getUuid() })),
      pains: athlete
        .getPains()
        .map((entity) => ({ ...entity.toJSON(), uuid: entity.getUuid() })),
      clubs: athlete.getClubs().map((contract) => {
        const club = contract.getClub();
        return {
          uuid: contract.getUuid(),
          clubId: contract.getClubId(),
          startDate: contract.getStartDate(),
          endDate: contract.getEndDate(),
          name: club.getName(),
          country: club.getCountry()?.getName(),
          countryId: club.getCountry()?.getUuid(),
          state: club.getState()?.getName(),
          stateId: club.getState()?.getUuid(),
          city: club.getCity()?.getName(),
          cityId: club.getCity()?.getUuid(),
        };
      }),
      ...(!!address && {
        address: {
          ...address.getDto(),
          country: address.getCountry()?.getName(),
          state: address.getState()?.getName(),
          city: address.getCity()?.getName(),
        },
      }),
    };
  }
}
