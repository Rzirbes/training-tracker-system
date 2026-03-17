export enum InjuryDegree {
  MICROTRAUMA = 'MICROTRAUMA',
  GRAU_I = 'GRAU_I',
  GRAU_II = 'GRAU_II',
  GRAU_III = 'GRAU_III',
  TOTAL = 'TOTAL',
}

export const degreeLabels: Record<InjuryDegree, string> = {
  [InjuryDegree.MICROTRAUMA]: 'Microtrauma (sobrecarga leve)',
  [InjuryDegree.GRAU_I]: 'Grau I (leve)',
  [InjuryDegree.GRAU_II]: 'Grau II (moderada)',
  [InjuryDegree.GRAU_III]: 'Grau III (grave)',
  [InjuryDegree.TOTAL]: 'Total (ruptura completa)',
};