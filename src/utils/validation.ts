import { Context } from 'hono'
import { ZodSchema } from 'zod'

export async function parseAndValidate<T>(c: Context, schema: ZodSchema<T>) {
  let body
  try {
    body = await c.req.json()
  } catch {
    return { error: { error: 'Invalid or missing request payload' }, status: 400 }
  }
  if (!body || typeof body !== 'object') {
    return { error: { error: 'Invalid or missing request payload' }, status: 400 }
  }
  const result = schema.safeParse(body)
  if (!result.success) {
    return { error: { error: 'Invalid payload format', details: result.error.issues }, status: 400 }
  }
  return { data: result.data }
}
