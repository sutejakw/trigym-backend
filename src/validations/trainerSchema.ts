import z from 'zod'
import { zValidator } from '@hono/zod-validator'

export const createTrainerSchema = z.object({
  user_id: z.number().int().positive('user_id is required'),
  bio: z.string().optional(),
  specialization: z.string().max(255).optional(),
  hourly_rate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'hourly_rate must be a decimal')
    .optional(),
  is_active: z.boolean().optional(),
})

export const createTrainerValidator = zValidator('json', createTrainerSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        error: 'Invalid request payload',
        details: result.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
      400
    )
  }
})

export const updateTrainerSchema = z.object({
  user_id: z.number().int().positive().optional(),
  bio: z.string().optional(),
  specialization: z.string().max(255).optional(),
  hourly_rate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'hourly_rate must be a decimal')
    .optional(),
  is_active: z.boolean().optional(),
})

export const updateTrainerValidator = zValidator('json', updateTrainerSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        error: 'Invalid request payload',
        details: result.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
      400
    )
  }
})

export const trainerIdSchema = z.object({
  id: z.string().regex(/^[0-9]+$/, 'ID must be a valid number'),
})

export const trainerIdValidator = zValidator('param', trainerIdSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        error: 'Invalid parameter',
        details: result.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
      400
    )
  }
})
