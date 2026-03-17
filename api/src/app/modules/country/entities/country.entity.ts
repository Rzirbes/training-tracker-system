import { BaseEntity, IBaseConstructor } from "src/app/shared";
import { transformer } from "src/app/shared/utils";

export class CountryEntity extends BaseEntity {
  private name: string;
  private code?: string;
  private isEnabled: boolean;

  constructor({
    code = '',
    isEnabled = true,
    name,
    createdAt,
    id,
    updatedAt,
    uuid,
  }: IConstructor) {
    super(id, uuid, createdAt, updatedAt);

    this.name = transformer.nameToTitleCase(name);
    this.code = code.toUpperCase();
    this.isEnabled = isEnabled;
  }

  public getName(): string {
    return this.name;
  }

  public getCode(): string {
    return this.code;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }
}

interface IConstructor extends IBaseConstructor {
  name: string
  code?: string
  isEnabled?: boolean
}