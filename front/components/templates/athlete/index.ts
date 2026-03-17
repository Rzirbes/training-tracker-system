import { AthleteDetailTemplate } from './detail'
import { AthleteForm, athleteSchema, type IAthleteFormProps } from './form'

export const AthleteTemplate = Object.assign(
  {},
  { Detail: AthleteDetailTemplate, Form: AthleteForm, schema: athleteSchema }
)

export type { IAthleteFormProps }
