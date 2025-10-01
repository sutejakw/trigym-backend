import z from 'zod'
import { zValidator } from '@hono/zod-validator'

export const createMembershipPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid decimal'),
  duration_months: z.number().int().positive('Duration must be a positive integer'),
  features: z.string().optional(),
  is_active: z.boolean().default(true),
})

export const createMembershipPlanValidator = zValidator(
  'json',
  createMembershipPlanSchema,
  (result, c) => {
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
  }
)

export const updateMembershipPlanSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid decimal')
    .optional(),
  duration_months: z.number().int().positive('Duration must be a positive integer').optional(),
  features: z.string().optional(),
  is_active: z.boolean().optional(),
})

export const updateMembershipPlanValidator = zValidator(
  'json',
  updateMembershipPlanSchema,
  (result, c) => {
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
  }
)

export const membershipPlanIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a valid number'),
})

export const membershipPlanIdValidator = zValidator(
  'param',
  membershipPlanIdSchema,
  (result, c) => {
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
  }
)

export const datatableQuerySchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a valid number').optional().default('1'),
  limit: z.string().regex(/^\d+$/, 'Limit must be a valid number').optional().default('10'),
  search: z.string().optional(),
  sortBy: z
    .enum(['id', 'name', 'price', 'duration_months', 'is_active', 'created_at'])
    .optional()
    .default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  status: z.enum(['active', 'inactive', 'all']).optional().default('all'),
})

export const datatableQueryValidator = zValidator('query', datatableQuerySchema, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        error: 'Invalid query parameters',
        details: result.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
      400
    )
  }
})
