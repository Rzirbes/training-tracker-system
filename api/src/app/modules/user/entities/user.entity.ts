import { BaseEntity, UserRoleEnum, transformer } from 'src/app/shared';
interface IUserConstructor {
  name: string;
  email: string;
  password: string;
  role: UserRoleEnum | string;
  isEnabled?: boolean;
  firstAccess?: boolean;
  id?: number;
  uuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
  coachId?: number;
}

export class UserEntity extends BaseEntity {
  private name: string;
  private email: string;
  private password: string;
  private role: UserRoleEnum;
  private isEnabled = true;
  private firstAccess = false;
  private coachId?: number;

  constructor({
    name,
    email,
    password,
    role,
    isEnabled = true,
    firstAccess = false,
    id,
    uuid,
    createdAt,
    updatedAt,
    coachId,
  }: IUserConstructor) {
    super(id, uuid, createdAt, updatedAt);
    this.name = transformer.nameToTitleCase(name);
    this.email = email;
    this.password = password;
    this.role = role as UserRoleEnum;
    this.isEnabled = isEnabled;
    this.firstAccess = firstAccess;
    this.coachId = coachId;
  }

  public updatePassword(newPassword: string) {
    this.password = newPassword;

    if (this.firstAccess) {
      this.isEnabled = true;
      this.firstAccess = false;
    }
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public getFirstAccess(): boolean {
    return this.firstAccess;
  }

  public getRole(): UserRoleEnum {
    return this.role;
  }

  public getCoachId() {
    return this.coachId;
  }
}
