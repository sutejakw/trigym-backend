import { verifyJWT } from '@/utils/jwt'
import { Context, Next } from 'hono'

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.replace('Bearer ', '')
  try {
    const payload = await verifyJWT(token)

    if (!payload) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    // Simpan payload ke context agar bisa diakses di handler
    c.set('jwtPayload', payload)
    await next()
  } catch (err) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
}
