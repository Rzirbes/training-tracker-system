import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAthleteDto } from '../dtos';
import { AthleteClubEntity, AthleteEntity } from '../entities';
import { InjuryEntity } from '../../injury/entities';
import { PainEntity } from '../../pain/entities';
import { AddressEntity, Cpf, type IBaseUseCase } from 'src/app/shared';
import type { IAthleteRepository } from '../repositories';
import type { IBucketRepository } from '../../buckets/repositories';
import type { IInjuryRepository } from '../../injury/repositories';
import type { IPainRepository } from '../../pain/repositories';

@Injectable()
export class UpdateAthleteUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('IBucketRepository')
    private readonly bucketRepository: IBucketRepository,
    @Inject('IInjuryRepository')
    private readonly injuryRepository: IInjuryRepository,
    @Inject('IPainRepository')
    private readonly painRepository: IPainRepository,
  ) {}

  async execute(data: UpdateAthleteDto): Promise<{ message: string }> {
    const {
      uuid,
      avatar,
      address,
      deletedAvatar,
      injuries,
      pains,
      clubs,
      ...payload
    } = data;

    const athlete = await this.athleteRepository.findByUuid(uuid);

    if (!athlete) {
      throw new NotFoundException({
        title: 'Não foi possível encontrar o Atleta.',
        description: 'Verifique e tente novamente.',
      });
    }

    await this.valideEmail(athlete, data.email);
    await this.valideCpf(athlete, data.cpf);

    const avatarUrl = await this.storeAvatar(data.email, avatar, deletedAvatar);

    athlete.update({
      ...payload,
      avatar: avatarUrl,
      ...(!!Object.values(address).filter(Boolean).length && {
        address: new AddressEntity(address),
      }),
    });

    await this.athleteRepository.update(athlete);

    await Promise.all([
      this.updateClubs(athlete, clubs),
      this.updateInjuries(athlete, injuries),
      this.updatePains(athlete, pains),
    ]);

    return { message: 'Atleta atualizado sucesso!' };
  }

  private async storeAvatar(
    email: string,
    avatar: UpdateAthleteDto['avatar'],
    deletedAvatar = false,
  ): Promise<string | undefined> {
    if (deletedAvatar) return '';

    if (!avatar) return undefined;

    const type = avatar.originalname.split('.')[1];
    const avatarUrl = `athletes/${email}/avatar/${Date.now()}.${type}`;

    await this.bucketRepository.uploadFile(avatar, avatarUrl);

    return avatarUrl;
  }

  private async valideEmail(athlete: AthleteEntity, email: string) {
    if (athlete.getEmail() === email) return;

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

  private async valideCpf(athlete: AthleteEntity, _cpf: string) {
    if (!_cpf) return;
    
    const cpf = new Cpf(_cpf).getValue();

    if (athlete.getCpf() === cpf) return;

    const existentCpf = await this.athleteRepository.findByCpf(cpf);

    if (existentCpf) {
      throw new ConflictException({
        field: 'cpf',
        title: 'CPF já cadastrado.',
        message:
          'Não foi possível cadastrar o atleta. Verifique e tente novamente...',
      });
    }
  }

  private async updateInjuries(
    athlete: AthleteEntity,
    newItems: UpdateAthleteDto['injuries'],
  ) {
    const oldItems = athlete.getInjuries();

    const oldMap = new Map(
      oldItems?.map((item) => {
        const uuid = item.getUuid();
        return [uuid, item];
      }),
    );
    const newMap = new Map(newItems?.map((item) => [item.uuid, item]));

    const created: InjuryEntity[] = newItems
      ?.filter((item) => !item.uuid)
      ?.map(
        (data) =>
          new InjuryEntity({
            ...data,
            athleteId: athlete.getId(),
          }),
      );

    if (created?.length) await this.injuryRepository.createMany(created);

    const updated: InjuryEntity[] = newItems
      ?.map((item) => {
        if (!item?.uuid) return null;

        const old = oldMap?.get(item.uuid);
        old?.update(item);
        return old;
      })
      ?.filter(Boolean);

    if (updated?.length) await this.injuryRepository.updateMany(updated);

    const deleted: InjuryEntity[] = oldItems?.filter(
      (item) => !newMap.has(item.getUuid()),
    );

    if (deleted?.length) await this.injuryRepository.deleteMany(deleted);
  }

  private async updatePains(
    athlete: AthleteEntity,
    newItems: UpdateAthleteDto['pains'],
  ) {
    const oldItems = athlete.getPains();

    const oldMap = new Map(
      oldItems?.map((item) => {
        const uuid = item.getUuid();
        return [uuid, item];
      }),
    );
    const newMap = new Map(newItems?.map((item) => [item.uuid, item]));

    const created: PainEntity[] = newItems
      ?.filter((item) => !item.uuid)
      ?.map(
        (data) =>
          new PainEntity({
            ...data,
            athleteId: athlete.getId(),
          }),
      );

    if (created?.length) await this.painRepository.createMany(created);

    const updated: PainEntity[] = newItems
      ?.map((item) => {
        if (!item.uuid) return;
        const old = oldMap.get(item.uuid);
        old?.update(item);
        return old;
      })
      ?.filter(Boolean);

    if (updated?.length) await this.painRepository.updateMany(updated);

    const deleted: PainEntity[] = oldItems?.filter(
      (item) => !newMap.has(item.getUuid()),
    );

    if (deleted?.length) await this.painRepository.deleteMany(deleted);
  }

  private async updateClubs(
    athlete: AthleteEntity,
    newItems: UpdateAthleteDto['clubs'],
  ) {
    const oldItems = athlete.getClubs();

    const oldMap = new Map(
      oldItems?.map((item) => {
        const uuid = item.getUuid();
        return [uuid, item];
      }),
    );
    const newMap = new Map(newItems?.map((item) => [item.uuid, item]));

    const created: AthleteClubEntity[] = newItems
      ?.filter((item) => !item.uuid)
      ?.map(
        (data) =>
          new AthleteClubEntity({
            ...data,
            athleteId: athlete.getId(),
          }),
      );

    if (created?.length) await this.athleteRepository.addClubs(created);

    const updated: AthleteClubEntity[] = newItems
      ?.map((item) => {
        if (!item.uuid) return;
        const old = oldMap.get(item.uuid);
        old?.update(item);
        return old;
      })
      ?.filter(Boolean);

    if (updated?.length) await this.athleteRepository.updateClubs(updated);

    const deleted: AthleteClubEntity[] = oldItems?.filter(
      (item) => !newMap.has(item.getUuid()),
    );

    if (deleted?.length) await this.athleteRepository.removeClubs(deleted);
  }
}
