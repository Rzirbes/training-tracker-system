import {
  AddressEntity,
  BaseEntity,
  Cpf,
  DominantFoot,
  FootballPosition,
  transformer,
  type IBaseConstructor,
} from 'src/app/shared';
import { InjuryEntity } from '../../injury/entities';
import { PainEntity } from '../../pain/entities';
import { AthleteClubEntity } from './athlete-club.entity';

interface IConstructor extends IBaseConstructor {
  name: string;
  email: string;
  birthday: Date;
  weight?: number;
  height?: number;
  isEnabled?: boolean;
  cpf?: string;
  phone?: string;
  position?: FootballPosition;
  dominantFoot: DominantFoot;
  bestSkill?: string;
  worstSkill?: string;
  goal?: string;
  observation?: string;
  avatar?: string;
  injuries?: InjuryEntity[];
  pains?: PainEntity[];
  address?: AddressEntity;
  addressId?: number;
  clubs?: AthleteClubEntity[];
  positions?: FootballPosition[];
  isMonitorDaily?: boolean;
}

interface IUpdateConstructor
  extends Partial<
    Pick<
      IConstructor,
      | 'name'
      | 'email'
      | 'birthday'
      | 'weight'
      | 'height'
      | 'position'
      | 'dominantFoot'
      | 'bestSkill'
      | 'worstSkill'
      | 'goal'
      | 'observation'
      | 'avatar'
      | 'phone'
      | 'cpf'
      | 'address'
      | 'positions'
      | 'isMonitorDaily'
    >
  > {}

export class AthleteEntity extends BaseEntity {
  private name: string;
  private email: string;
  private birthday: Date;
  private coachId: number;
  private weight?: number;
  private height?: number;
  private isEnabled: boolean;
  private cpf?: Cpf;
  private phone: string;
  private position?: FootballPosition;
  private positions?: FootballPosition[];
  private isMonitorDaily?: boolean;
  private dominantFoot?: DominantFoot;
  private bestSkill?: string;
  private worstSkill?: string;
  private goal?: string;
  private observation?: string;
  private avatar?: string;
  private injuries: InjuryEntity[] = [];
  private pains: PainEntity[] = [];
  private address?: AddressEntity;
  private addressId?: number;
  private clubs: AthleteClubEntity[];

  constructor({
    name,
    email,
    birthday,
    weight,
    height,
    isEnabled = true,
    cpf,
    phone,
    position,
    dominantFoot,
    bestSkill,
    worstSkill,
    goal,
    observation,
    avatar,
    injuries = [],
    pains = [],
    id,
    uuid,
    createdAt,
    updatedAt,
    address,
    addressId,
    clubs,
    isMonitorDaily,
    positions = [],
  }: IConstructor) {
    super(id, uuid, createdAt, updatedAt);
    this.name = transformer.nameToTitleCase(name);
    this.email = email;
    this.birthday = birthday;
    if (weight) this.weight = weight;
    if (height) this.height = height;
    this.isEnabled = isEnabled;
    if (cpf) this.cpf = new Cpf(cpf);
    this.position = position;
    this.dominantFoot = dominantFoot;
    this.bestSkill = bestSkill;
    this.worstSkill = worstSkill;
    this.goal = goal;
    this.observation = observation;
    this.avatar = avatar;
    this.injuries = injuries;
    this.pains = pains;
    this.phone = transformer.phone(phone);
    this.address = address;
    this.addressId = addressId;
    this.clubs = clubs;
    this.isMonitorDaily = isMonitorDaily;
    this.positions = positions;
  }

  public update({
    name,
    email,
    birthday,
    weight,
    height,
    position,
    dominantFoot,
    bestSkill,
    worstSkill,
    goal,
    observation,
    avatar,
    phone,
    cpf,
    address,
    isMonitorDaily,
    positions = [],
  }: IUpdateConstructor) {
    this.avatar = avatar;
    this.name = transformer.nameToTitleCase(name);
    this.email = email;
    this.birthday = birthday;
    this.weight = weight;
    this.height = height;
    this.position = position;
    this.dominantFoot = dominantFoot;
    this.bestSkill = bestSkill;
    this.worstSkill = worstSkill;
    this.goal = goal;
    this.observation = observation;
    this.phone = transformer.phone(phone);
    this.cpf = cpf?.length ? new Cpf(cpf) : undefined;
    if (address) this.address = address;
    this.isMonitorDaily = isMonitorDaily;
    this.positions = positions;
  }

  public toggleIsEnabled() {
    this.isEnabled = !this.isEnabled;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getBirthday(): Date {
    return this.birthday;
  }

  public getCoachId(): number {
    return this.coachId;
  }

  public getWeight(): number | undefined {
    return this.weight;
  }

  public getHeight(): number | undefined {
    return this.height;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public getCpf(): string | undefined {
    return this.cpf?.getValue();
  }

  public getCpfMasked(): string | undefined {
    return this.cpf?.getMasked();
  }

  public getPhone(): string | undefined {
    return this.phone ?? undefined;
  }

  public getPosition(): FootballPosition | undefined {
    return this.position ?? undefined;
  }

  public getPositions(): FootballPosition[] {
    const position = this.position;
    const positions = this.positions;

    if (!positions.length) {
      if (!position) return [];

      return [position];
    }

    return this.positions ?? [];
  }

  public getDominantFoot(): DominantFoot | undefined {
    return this.dominantFoot ?? undefined;
  }

  public getBestSkill(): string | undefined {
    return this.bestSkill ?? undefined;
  }

  public getWorstSkill(): string | undefined {
    return this.worstSkill ?? undefined;
  }

  public getGoal(): string | undefined {
    return this.goal ?? undefined;
  }

  public getObservation(): string | undefined {
    return this.observation ?? undefined;
  }

  public getAvatar(): string | undefined {
    return this.avatar ?? undefined;
  }

  public getInjuries(): InjuryEntity[] {
    return this.injuries ?? [];
  }

  public getPains(): PainEntity[] {
    return this.pains ?? [];
  }

  public getClubs(): AthleteClubEntity[] {
    return this.clubs ?? [];
  }

  public getAddress(): AddressEntity | undefined {
    return this.address ?? undefined;
  }

  public getAddressId(): number | undefined {
    return this.addressId;
  }

  public getIsMonitorDaily(): boolean {
    return this.isMonitorDaily;
  }
}
