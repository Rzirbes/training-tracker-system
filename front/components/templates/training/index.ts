import { TrainingForm, trainingSchema, type ITrainingFormProps } from './form'

export const TrainingTemplate = Object.assign({}, { Form: TrainingForm, schema: trainingSchema })

export type { ITrainingFormProps }
