import { z } from 'zod'

export type TrainingTypeFormProps = z.input<typeof trainingTypeSchema>
export type TrainingTypeProps = z.output<typeof trainingTypeSchema>

export const trainingTypeSchema = z
  .object({
    name: z
      .string()
      .min(2, {
        message: 'Nome do Tipo de Treino é obrigatório',
      })
      .default(''),
    serverError: z.string().default('').optional(),
  })
  .transform(({ name }) => ({ name }))
