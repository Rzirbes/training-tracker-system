import { randomUUID } from 'crypto';
import { BaseEntity, IBaseConstructor, TokenTypeEnum } from 'src/app/shared';

interface ITokenEntityConstructor extends IBaseConstructor {
  type: TokenTypeEnum;
  userId: number;
  isValid?: boolean;
  expiresIn?: Date;
  token?: string;
  id?: number;
  uuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TokenEntity extends BaseEntity {
  private token: string;
  private type: TokenTypeEnum;
  private userId: number;
  private expiresIn: Date;
  private isValid: boolean;

  constructor({
    token,
    userId,
    expiresIn,
    type,
    isValid = true,
    id,
    uuid,
    createdAt,
    updatedAt,
  }: ITokenEntityConstructor) {
    super(id, uuid, createdAt, updatedAt);
    this.expiresIn = this.generateExpiresDate(expiresIn);
    this.token = this.generateRandomToken(token);
    this.userId = userId;
    this.isValid = isValid;
    this.type = type;
  }

  public invalid() {
    this.isValid = false;
  }

  public getExpiresIn(): Date {
    return this.expiresIn;
  }

  public getToken(): string {
    return this.token;
  }

  public getUserId(): number {
    return this.userId;
  }

  public getType(): TokenTypeEnum {
    return this.type;
  }

  public getIsValid(): boolean {
    return this.isValid;
  }

  private generateRandomToken(token?: string): string {
    if (token) return token;
    return randomUUID();
  }

  private generateExpiresDate(expiresIn?: Date) {
    if (expiresIn) return expiresIn;
    const dayInMilliseconds = 86400000;
    const today = new Date();
    return new Date(today.getTime() + dayInMilliseconds);
  }
}
