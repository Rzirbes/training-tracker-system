import { BaseEntity, transformer, type IBaseConstructor } from 'src/app/shared';

interface IConstructor extends IBaseConstructor {
  name: string;
  isEnabled?: boolean;
  isDefault?: boolean;
}

export class TrainingTypeEntity extends BaseEntity {
  private name: string;
  private isEnabled: boolean;
  private isDefault: boolean;

  constructor({
    name,
    isEnabled = true,
    isDefault = false,
    id,
    uuid,
    createdAt,
    updatedAt,
  }: IConstructor) {
    super(id, uuid, createdAt, updatedAt);
    this.name = transformer.capitalizeFirstLetter(name);
    this.isEnabled = isEnabled;
    this.isDefault = isDefault;
  }

  public update({ name }: Pick<IConstructor, 'name'>) {
    this.name = transformer.capitalizeFirstLetter(name);
  }

  public toggleIsEnabled(): void {
    this.isEnabled = !this.isEnabled;
  }

  public getName(): string {
    return this.name;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public getIsDefault(): boolean {
    return this.isDefault;
  }
}
