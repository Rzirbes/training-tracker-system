import { TrainingPlanningForm, trainingPlanningSchema, type ITrainingPlanningFormProps } from './form'

export const TrainingPlanningTemplate = Object.assign(
  {},
  { Form: TrainingPlanningForm, schema: trainingPlanningSchema }
)

export type { ITrainingPlanningFormProps }
