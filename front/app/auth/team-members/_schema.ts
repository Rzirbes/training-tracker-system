import { z } from 'zod'
import { schemas } from '@/schemas'

export const teamMemberSchema = z.object({
  address: schemas.address,
  name: z.string().min(2, { message: 'Nome é obrigatório' }).default(''),
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório').default(''),
  role: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  schedulerColor: z.string().min(1, 'A cor é obrigatória').default('#624f96'),
})

export type ITeamMemberFormProps = z.input<typeof teamMemberSchema>
