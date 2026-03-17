export enum DominantFoot {
  RIGHT = "RIGHT",
  LEFT = "LEFT",
  AMBIDEXTRO = "AMBIDEXTRO",
}

export const dominantFootLabel = {
  [DominantFoot.RIGHT]: 'Direito',
  [DominantFoot.LEFT]: 'Esquerdo',
  [DominantFoot.AMBIDEXTRO]: 'Ambidestro',
}

export enum FootballPosition {
  GOALKEEPER = 'GOALKEEPER',

  RIGHT_FULLBACK = 'RIGHT_FULLBACK',
  LEFT_FULLBACK = 'LEFT_FULLBACK',

  RIGHT_WING_BACK = 'RIGHT_WING_BACK',
  LEFT_WING_BACK = 'LEFT_WING_BACK',
  
  BACK = 'BACK',
  RIGHT_CENTER_BACK = 'RIGHT_CENTER_BACK',
  LEFT_CENTER_BACK = 'LEFT_CENTER_BACK',

  SWEEPER = 'SWEEPER',

  DEFENSIVE_MIDFIELDER = 'DEFENSIVE_MIDFIELDER',
  RIGHT_DEFENSIVE_MIDFIELDER = 'RIGHT_DEFENSIVE_MIDFIELDER',
  LEFT_DEFENSIVE_MIDFIELDER = 'LEFT_DEFENSIVE_MIDFIELDER',

  CENTRAL_MIDFIELDER = 'CENTRAL_MIDFIELDER',
  RIGHT_CENTRAL_MIDFIELDER = 'RIGHT_CENTRAL_MIDFIELDER',
  LEFT_CENTRAL_MIDFIELDER = 'LEFT_CENTRAL_MIDFIELDER',

  ATTACKING_MIDFIELDER = 'ATTACKING_MIDFIELDER',

  RIGHT_WINGER = 'RIGHT_WINGER',
  LEFT_WINGER = 'LEFT_WINGER',

  SECOND_STRIKER = 'SECOND_STRIKER',
  CENTER_FORWARD = 'CENTER_FORWARD',

  STRIKER = 'STRIKER',
}


export const footballPositionLabels: Record<FootballPosition, string> = {
  [FootballPosition.GOALKEEPER]: 'Goleiro (GL)',

  [FootballPosition.RIGHT_WING_BACK]: 'Ala Direito (AD)',
  [FootballPosition.RIGHT_FULLBACK]: 'Lateral Direito (LD)',

  [FootballPosition.LEFT_WING_BACK]: 'Ala Esquerdo (AE)',
  [FootballPosition.LEFT_FULLBACK]: 'Lateral Esquerdo (LE)',

  [FootballPosition.BACK]: 'Zagueiro (ZG)',
  [FootballPosition.RIGHT_CENTER_BACK]: 'Zagueiro Direito (ZGD)',
  [FootballPosition.LEFT_CENTER_BACK]: 'Zagueiro Esquerdo (ZGE)',

  [FootballPosition.SWEEPER]: 'Líbero (LIB)',

  [FootballPosition.DEFENSIVE_MIDFIELDER]: 'Volante (VOL)',
  [FootballPosition.RIGHT_DEFENSIVE_MIDFIELDER]: 'Volante Direito (VOD)',
  [FootballPosition.LEFT_DEFENSIVE_MIDFIELDER]: 'Volante Esquerdo (VOE)',

  [FootballPosition.CENTRAL_MIDFIELDER]: 'Meio-Campista Central (MC)',
  [FootballPosition.RIGHT_CENTRAL_MIDFIELDER]: 'Meio-Campista Direito (MD)',
  [FootballPosition.LEFT_CENTRAL_MIDFIELDER]: 'Meio-Campista Esquerdo (ME)',
  [FootballPosition.ATTACKING_MIDFIELDER]: 'Meia Ofensivo (MEI)',

  [FootballPosition.RIGHT_WINGER]: 'Ponta Direita (PD)',
  [FootballPosition.LEFT_WINGER]: 'Ponta Esquerda (PE)',

  [FootballPosition.SECOND_STRIKER]: 'Segundo Atacante (SA)',
  [FootballPosition.CENTER_FORWARD]: 'Centroavante (CA)',
  [FootballPosition.STRIKER]: 'Atacante (ATA)',
}
