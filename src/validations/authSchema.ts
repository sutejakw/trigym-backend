import z from 'zod'
import { zValidator } from '@hono/zod-validator'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const loginValidator = zValidator('json', loginSchema, (result, c) => {
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

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(32),
})

export const refreshTokenValidator = zValidator('json', refreshTokenSchema, (result, c) => {
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
