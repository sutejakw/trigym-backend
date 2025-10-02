import z from 'zod'
import { zValidator } from '@hono/zod-validator'

// Create Membership Schema
// A membership ties a user to a membership plan with start/end dates and status.
// We allow passing start_date and end_date as ISO strings (or YYYY-MM-DD) and
// optionally auto-calculate end_date on route layer if omitted (using plan duration).
export const createMembershipSchema = z.object({
  user_id: z.number().int().positive('user_id is required'),
  membership_plan_id: z.number().int().positive('membership_plan_id is required'),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/i, 'start_date must be in YYYY-MM-DD format')
    .optional(),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/i, 'end_date must be in YYYY-MM-DD format')
    .optional(),
  status: z.enum(['active', 'expired', 'canceled', 'pending']).optional().default('pending'),
})

export const createMembershipValidator = zValidator('json', createMembershipSchema, (result, c) => {
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

export const updateMembershipSchema = z.object({
  user_id: z.number().int().positive().optional(),
  membership_plan_id: z.number().int().positive().optional(),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/i, 'start_date must be in YYYY-MM-DD format')
    .optional(),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/i, 'end_date must be in YYYY-MM-DD format')
    .optional(),
  status: z.enum(['active', 'expired', 'canceled', 'pending']).optional(),
})

export const updateMembershipValidator = zValidator('json', updateMembershipSchema, (result, c) => {
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

export const membershipIdSchema = z.object({
  id: z.string().regex(/^[0-9]+$/, 'ID must be a valid number'),
})

export const membershipIdValidator = zValidator('param', membershipIdSchema, (result, c) => {
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

export const membershipDatatableQuerySchema = z.object({
  page: z
    .string()
    .regex(/^[0-9]+$/, 'Page must be a valid number')
    .optional()
    .default('1'),
  limit: z
    .string()
    .regex(/^[0-9]+$/, 'Limit must be a valid number')
    .optional()
    .default('10'),
  search: z.string().optional(),
  sortBy: z
    .enum(['id', 'user_id', 'membership_plan_id', 'start_date', 'end_date', 'status', 'created_at'])
    .optional()
    .default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  status: z.enum(['active', 'expired', 'canceled', 'pending', 'all']).optional().default('all'),
})

export const membershipDatatableQueryValidator = zValidator(
  'query',
  membershipDatatableQuerySchema,
  (result, c) => {
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
  }
)
