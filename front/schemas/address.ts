import { validator } from '@/utils/validator'
import { z } from 'zod'

export const address = z
  .object({
    zipCode: z
      .string()
      // .min(1, 'CEP é obrigatório')
      .refine((v) => !v || validator.zipCode(v), 'CEP inválido')
      .default(''),
    street: z
      .string()
      // .min(1, 'Rua é obrigatório')
      .max(255, 'Rua deve ter no máximo 255 caracteres')
      .default(''),
    buildingNumber: z
      .string()
      // .min(1, 'Numero é obrigatório')
      .default(''),
    complement: z.string().optional().default(''),
    neighborhood: z
      .string()
      // .min(1, 'Bairro é obrigatório')
      .default(''),
    stateId: z.string().default(''),
    cityId: z.string().default(''),
    countryId: z.string().default(''),
  })
  .optional()
