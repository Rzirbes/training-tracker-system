import { BaseEntity, transformer } from 'src/app/shared';

export class CityEntity extends BaseEntity {
  private name: string;
  private stateId: string;
  private isEnabled: boolean;
  private slug: string;

  super() {
    this.isEnabled = true;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
   this.name = transformer.nameToTitleCase(name);
  }

  public getStateId(): string {
    return this.stateId;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public setIsEnabled(isEnabled: boolean): void {
    this.isEnabled = isEnabled;
  }

  public setStateId(stateId: string): void {
    this.stateId = stateId;
  }

  public setSlug(slug?: string): void {
    this.slug = slug ?? transformer.slug(this.name);
  }

  public getSlug(): string {
    return this.slug;
  }
}
