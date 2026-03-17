import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAthleteDto } from '../dtos';
import { AthleteEntity, AthleteClubEntity } from '../entities';
import { InjuryEntity } from '../../injury/entities';
import { PainEntity } from '../../pain/entities';
import { AddressEntity, Cpf, type IBaseUseCase } from 'src/app/shared';
import type { IAthleteRepository } from '../repositories';
import type { IClubRepository } from '../../club/repositories';
import type { IBucketRepository } from '../../buckets/repositories';

@Injectable()
export class CreateAthleteUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('IBucketRepository')
    private readonly bucketRepository: IBucketRepository,
    @Inject('IClubRepository')
    private readonly clubRepository: IClubRepository,
  ) {}

  async execute(input: CreateAthleteDto): Promise<void> {
    await this.valideEmail(input.email);
    await this.valideCpf(input.cpf);

    const {
      avatar,
      address,
      clubs: _clubs = [],
      injuries = [],
      pains = [],
      ...rest
    } = input;

    const clubs = await this.validateClubs(_clubs);

    const avatarUrl = await this.storeAvatar(rest.email, avatar);

    const athlete = new AthleteEntity({
      ...rest,
      clubs,
      avatar: avatarUrl,
      injuries: injuries?.map((data) => new InjuryEntity(data)),
      pains: pains?.map((data) => new PainEntity(data)),
      ...(address && { address: new AddressEntity(address) }),
    });

    await this.athleteRepository.create(athlete);
  }

  private async storeAvatar(email: string, avatar: CreateAthleteDto['avatar']) {
    if (!avatar) return;

    const type = avatar.originalname.split('.')[1];
    const avatarUrl = `athletes/${email}/avatar/${Date.now()}.${type}`;

    if (avatar) {
      await this.bucketRepository.uploadFile(avatar, avatarUrl);
    }

    return avatarUrl;
  }

  private async valideEmail(email: string) {
    const existentEmail = await this.athleteRepository.findByEmail(email);
    if (existentEmail) {
      throw new ConflictException({
        field: 'email',
        title: 'E-mail já cadastrado.',
        message:
          'Não foi possível cadastrar o atleta. Verifique e tente novamente...',
      });
    }
  }

  private async valideCpf(cpf: string) {
    if (!cpf) return;

    const existentCpf = await this.athleteRepository.findByCpf(
      new Cpf(cpf).getValue(),
    );
    
    if (existentCpf) {
      throw new ConflictException({
        field: 'cpf',
        title: 'CPF já cadastrado.',
        message:
          'Não foi possível cadastrar o atleta. Verifique e tente novamente...',
      });
    }
  }

  private async validateClubs(clubs: CreateAthleteDto['clubs']) {
    if (!clubs.length) return;

    const _clubs = await this.clubRepository.findByUuid(
      clubs.map(({ clubId }) => clubId),
    );

    return clubs?.map((data) => {
      const entity = _clubs.find((c) => c.getUuid() === data.clubId);

      if (!entity)
        throw new NotFoundException({
          title: 'Clube não encontrado!',
          message: 'Verifique os clubes selecionados e tente novamente...',
        });

      return new AthleteClubEntity({
        ...data,
        club: entity,
      });
    });
  }
}
