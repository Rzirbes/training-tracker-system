export enum InjuryContext {
  GAME = 'GAME',
  TRAINING = 'TRAINING',
  ACADEMY = 'ACADEMY',
  OUT_FIELD = 'OUT_FIELD',
  OTHERS = 'OTHERS',
}

export const injuryContexts: Record<InjuryContext, string> = {
  [InjuryContext.GAME]: 'Jogo',
  [InjuryContext.TRAINING]: 'Treino',
  [InjuryContext.ACADEMY]: 'Academia',
  [InjuryContext.OUT_FIELD]: 'Fora do campo',
  [InjuryContext.OTHERS]: 'Outros',
};
