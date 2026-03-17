import {
  AddressDto,
  AddressEntity,
  BaseEntity,
  transformer,
  UserRoleEnum,
  type IBaseConstructor,
} from 'src/app/shared';
import { UserEntity } from '../../user';

interface ICoachConstructor {
  name: string;
  email: string;
  isEnabled?: boolean;
  role?: string;
  address?: AddressDto;
  schedulerColor?: string;
  phone?: string;
  addressId?: number;
  allowScheduleConflict?: boolean;
}

export class CoachEntity extends BaseEntity {
  private name: string;
  private email: string;
  private isEnabled = true;
  private user?: UserEntity;
  private role?: string;
  private address?: AddressEntity;
  private schedulerColor?: string;
  private phone?: string;
  private addressId?: number;
  private allowScheduleConflict?: boolean;

  constructor({
    name,
    email,
    isEnabled = true,
    id,
    uuid,
    createdAt,
    updatedAt,
    role,
    address,
    schedulerColor,
    phone,
    addressId,
    allowScheduleConflict,
  }: ICoachConstructor & IBaseConstructor) {
    super(id, uuid, createdAt, updatedAt);
    this.name = transformer.nameToTitleCase(name);
    this.email = email;
    this.isEnabled = isEnabled;
    this.role = role;
    this.schedulerColor = schedulerColor;
    this.allowScheduleConflict = allowScheduleConflict;
    this.phone = phone;
    this.addressId = addressId;
    if (address) this.address = new AddressEntity(address);
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public getUser() {
    return this.user;
  }

  public getRole() {
    return this.role;
  }

  public getAddress() {
    return this.address || undefined;
  }

  public getSchedulerColor() {
    return this.schedulerColor;
  }

  public getAllowScheduleConflict() {
    return this.allowScheduleConflict;
  }

  public getPhone() {
    return this.phone;
  }

  public getAddressId() {
    return this.addressId;
  }

  public toggleIsEnabled() {
    this.isEnabled = !this.isEnabled;
  }

  public buildUser(password: string) {
    const user = new UserEntity({
      password,
      name: this.name,
      email: this.email,
      role: UserRoleEnum.COLLABORATOR,
    });
    this.user = user;
    return user;
  }

  public update({
    name,
    email,
    role,
    address,
    schedulerColor,
    phone,
  }: ICoachConstructor) {
    this.name = transformer.nameToTitleCase(name);
    this.email = email;
    this.role = role;
    this.schedulerColor = schedulerColor;
    this.phone = phone;
    if (address) this.address = new AddressEntity(address);
  }
}
