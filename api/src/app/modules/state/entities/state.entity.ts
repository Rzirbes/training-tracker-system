import { transformer } from 'src/app/shared';

export class StateEntity {
  private id: number;
  private uuid: string;
  private name: string;
  private uf?: string;
  private isEnabled: boolean;
  private countryId: string;

  constructor() {
    this.isEnabled = false;
  }

  public getId(): number {
    return this.id;
  }
  public setId(id: number): void {
    this.id = id;
  }

  public getUuid(): string {
    return this.uuid;
  }

  public setUuid(uuid: string): void {
    this.uuid = uuid;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = transformer.nameToTitleCase(name);
  }

  public getUf(): string {
    return this.uf;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public setIsEnabled(isEnabled: boolean): void {
    this.isEnabled = isEnabled;
  }

  public setUf(uf: string): void {
    this.uf = String(uf).toUpperCase();
  }

  public getLabel(): string {
    return `${this.getName()} - ${this.getUf()}`;
  }

  public getCountryId(): string {
    return this.countryId;
  }

  public setCountryId(countryId: string): void {
    this.countryId = countryId;
  }
}
