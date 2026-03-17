'use server'

import { createServerAction } from '@/lib'
import { deleteSession } from '../session'

export const signOutAction = createServerAction().handler(deleteSession)
