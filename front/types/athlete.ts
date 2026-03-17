import { BodySide, DominantFoot, FootballPosition, InjuryContext, InjuryDegree } from "@/enums"

export interface AthleteProps {
  id: string
  name: string
  email: string
  birthday: Date
  isEnabled: boolean
  isMonitorDaily?: boolean
  weight?: number
  height?: number
  cpf: string
  phone?: string
  position: FootballPosition
  positions: FootballPosition[]
  dominantFoot: DominantFoot
  bestSkill?: string
  worstSkill?: string
  goal?: string
  observation?: string
  avatarUrl?: string
  address?: {
    street?: string
    neighborhood?: string
    buildingNumber?: string
    complement?: string
    zipCode?: string
    cityId?: string
    stateId?: string
    countryId?: string
    city?: string
    state?: string
    country?: string
  }
  clubs: {
    uuid: string
    clubId: string
    startDate: Date
    endDate?: Date
    name?: string
    city?: string
    cityId?: string
    state?: string
    stateId?: string
    country?: string
    countryId?: string
  }[]
  injuries?: {
    date: Date
    type: string
    bodyRegion: string
    bodySide: BodySide
    degree: InjuryDegree
    occurredDuring: InjuryContext
    description?: string
    diagnosisConfirmed?: boolean
    examType?: string
    requiresSurgery?: boolean
    surgeryDate?: Date
    treatmentType?: string
    returnDatePlanned?: Date
    returnDateActual?: Date
    minutesFirstGame?: number
    notes?: string
    uuid?: string
  }[]
  pains?: {
    date: Date
    bodyRegion: string
    bodySide: BodySide
    occurredDuring: InjuryContext
    description?: string
    intensity: number
    uuid: string
  }[]
}
