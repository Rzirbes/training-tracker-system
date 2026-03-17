import { BodySide, InjuryContext, InjuryDegree } from '@/enums'
import { z } from 'zod'

const injurySchema = z.object({
  // 📅 Campos obrigatórios
  date: z.coerce.date({
    errorMap: (issue, { defaultError }) => ({
      message: issue.code === 'invalid_date' ? 'Data da lesão é obrigatório' : defaultError,
    }),
  }),

  type: z
    .string({
      required_error: 'Tipo da lesão é obrigatório',
    })
    .min(1, 'Tipo da lesão é obrigatório')
    .max(255, 'Tipo da lesão deve ter no máximo 255 caracteres'),

  bodyRegion: z
    .string({
      required_error: 'Região do corpo é obrigatório',
    })
    .min(1, 'Região do corpo é obrigatória')
    .max(255, 'Região do corpo deve ter no máximo 255 caracteres'),

  bodySide: z.nativeEnum(BodySide, {
    required_error: 'Lado do corpo é obrigatório',
  }),

  degree: z.nativeEnum(InjuryDegree, {
    required_error: 'Grau da lesão é obrigatório',
  }),

  occurredDuring: z.nativeEnum(InjuryContext, {
    required_error: 'Momento da ocorrência é obrigatório',
  }),

  // 📝 Campos opcionais
  description: z.string().max(2000, 'Descrição deve ter no máximo 2000 caracteres').optional(),

  diagnosisConfirmed: z
    .boolean({
      required_error: 'Confirmação do diagnóstico é obrigatória',
    })
    .optional()
    .default(false),

  examType: z.string().optional().default(''),

  requiresSurgery: z
    .boolean({
      required_error: 'Indicação de cirurgia é obrigatória',
    })
    .optional()
    .default(false),

  surgeryDate: z.coerce
    .date({})
    .optional()
    .transform((value) => (!!value ? new Date(value) : undefined)),

  treatmentType: z.string().max(255, 'Tipo de tratamento deve ter no máximo 255 caracteres').optional(),

  returnDatePlanned: z.coerce
    .date({})
    .optional()
    .transform((value) => (!!value ? new Date(value) : undefined)),

  returnDateActual: z.coerce
    .date({})
    .optional()
    .transform((value) => (!!value ? new Date(value) : undefined)),

  minutesFirstGame: z.coerce
    .number({
      invalid_type_error: 'Minutos no primeiro jogo deve ser um número',
    })
    .optional(),

  recurrence: z.boolean().optional().default(false),

  notes: z.string().max(2000, 'Deve ter no máximo 2000 caracteres').optional(),

  uuid: z.string().default('').optional(),
})

export const injuriesSchema = z
  .object({
    injuries: z.array(injurySchema),
    serverError: z.string().default('').optional(),
  })
  .transform(({ injuries = [] }) => ({ injuries }))
