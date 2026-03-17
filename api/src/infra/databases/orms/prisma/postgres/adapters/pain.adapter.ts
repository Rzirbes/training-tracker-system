import { Pain } from "@prisma/client";
import { PainEntity } from "src/app/modules/pain/entities";
import { BodySide, InjuryContext } from "src/app/shared";

export class PainAdapter {
  static create(pain: Pain): PainEntity {
    return new PainEntity({
      ...pain,
      bodySide: pain.bodySide as BodySide,
      occurredDuring: pain.occurredDuring as InjuryContext,
    });
  }
}