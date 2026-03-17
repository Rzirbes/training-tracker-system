import {  Injury } from "@prisma/client";
import { InjuryEntity } from "src/app/modules/injury/entities";
import { BodySide, InjuryContext, InjuryDegree } from "src/app/shared";

export class InjuryAdapter {
  static create(injury: Injury): InjuryEntity {
    return new InjuryEntity({
      ...injury,
      examType: injury.examType ?? '',
      description: injury.description ?? '',
      treatmentType: injury.treatmentType ?? '',
      notes: injury.notes ?? '',
      bodySide: injury.bodySide as BodySide,
      degree: injury.degree as InjuryDegree,
      occurredDuring: injury.occurredDuring as InjuryContext,
      ...(!!injury.surgeryDate && {
        surgeryDate: new Date(injury.surgeryDate),
      }),
      ...(!!injury.returnDatePlanned && {
        returnDatePlanned: new Date(injury.returnDatePlanned),
      }),
      ...(!!injury.returnDateActual && {
        returnDateActual: new Date(injury.returnDateActual),
      }),
    });
  }
}