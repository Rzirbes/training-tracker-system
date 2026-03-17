export class BaseEntity {
  constructor(
    private id?: number,
    private uuid?: string,
    private createdAt?: Date,
    private updatedAt?: Date,
  ) {}

  getId(): number {
    return this.id;
  }

  getUuid(): string {
    return this.uuid;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setId(id: number) {
    this.id = id;
  }

  setUuid(uuid: string) {
    this.uuid = uuid;
  }

  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }
}
