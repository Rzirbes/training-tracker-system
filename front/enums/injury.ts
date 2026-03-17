export enum BodySide {
  BILATERAL = 'BILATERAL',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

export enum InjuryDegree {
  MICROTRAUMA = 'MICROTRAUMA',
  GRAU_I = 'GRAU_I',
  GRAU_II = 'GRAU_II',
  GRAU_III = 'GRAU_III',
  TOTAL = 'TOTAL',
}

export enum InjuryContext {
  GAME = 'GAME',
  TRAINING = 'TRAINING',
  ACADEMY = 'ACADEMY',
  OUT_FIELD = 'OUT_FIELD',
  OTHERS = 'OTHERS',
}

export const bodySides = {
  [BodySide.BILATERAL]: 'Bilateral',
  [BodySide.RIGHT]: 'Direito',
  [BodySide.LEFT]: 'Esquerdo',
}

export const degreeLabels: Record<InjuryDegree, string> = {
  [InjuryDegree.MICROTRAUMA]: 'Microtrauma (sobrecarga leve)',
  [InjuryDegree.GRAU_I]: 'Grau I (leve)',
  [InjuryDegree.GRAU_II]: 'Grau II (moderada)',
  [InjuryDegree.GRAU_III]: 'Grau III (grave)',
  [InjuryDegree.TOTAL]: 'Total (ruptura completa)',
}

export const injuryContexts: Record<InjuryContext, string> = {
  [InjuryContext.GAME]: 'Jogo',
  [InjuryContext.TRAINING]: 'Treino',
  [InjuryContext.ACADEMY]: 'Academia',
  [InjuryContext.OUT_FIELD]: 'Fora do campo',
  [InjuryContext.OTHERS]: 'Outros',
}