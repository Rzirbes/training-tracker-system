import { Inject, Injectable } from '@nestjs/common';
import { IClubRepository } from '../repositories';
import { CreateClubRequestDto, CreateClubResponseDto } from '../dtos';
import { ClubEntity } from '../entities';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreateClubUseCase implements IBaseUseCase {
  constructor(
    @Inject('IClubRepository')
    private readonly clubRepository: IClubRepository,
  ) {}

  public async execute({ name, countryId, stateId, cityId }: CreateClubRequestDto): Promise<CreateClubResponseDto> {
    const club = new ClubEntity({ name, countryId, stateId, cityId });
    const { uuid } = await this.clubRepository.create(club);

    return {
      id: uuid,
      message: 'Clube cadastrado com sucesso!'
    };
  }
}
