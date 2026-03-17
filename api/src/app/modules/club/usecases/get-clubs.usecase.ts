import { Inject, Injectable } from '@nestjs/common';
import { IClubRepository } from '../repositories';
import { GetClubsRequestDto, GetClubsResponseDto } from '../dtos';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class GetClubsUseCase implements IBaseUseCase {
  constructor(
    @Inject('IClubRepository')
    private readonly clubRepository: IClubRepository,
  ) {}

  public async execute({ city }: GetClubsRequestDto): Promise<GetClubsResponseDto> {
    const clubs = await this.clubRepository.findAll({ city, isEnabled: true });

    return {
      clubs: clubs.map((club) => ({
        label: club.getName(),
        value: club.getUuid(),
      })),
    };
  }
}
